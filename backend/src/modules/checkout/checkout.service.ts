import { prisma } from "../../lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { tierUnitPrice, computeShipping } from "../../lib/pricing";
import { buildOrderNumber } from "../../lib/orderNumber";
import { getRawCartItems } from "../cart/cart.service";
import { resolveCoupon } from "../coupons/coupons.service";
import { generateInvoicePdf } from "../../providers/pdf/invoice.pdf";
import { sendMail } from "../../providers/email/mailer";
import { orderConfirmationEmail } from "../../providers/email/templates/orderConfirmation";
import { logger } from "../../lib/logger";
import type { PaymentMethod } from "@prisma/client";

interface CreateOrderInput {
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

function extractGst(lineTotal: number, gstRatePct: number): number {
  // Prices are stored GST-inclusive; this recovers the tax component for the invoice.
  return Math.round(lineTotal - lineTotal / (1 + gstRatePct / 100));
}

export async function createOrder(userId: number, input: CreateOrderInput) {
  const [user, address, cartItems] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.address.findUnique({ where: { id: input.addressId } }),
    getRawCartItems(userId),
  ]);

  if (!user) throw new NotFoundError("User not found");
  if (!address) throw new NotFoundError("Address not found");
  if (address.userId !== userId) throw new ForbiddenError("This address does not belong to you");
  if (cartItems.length === 0) throw new BadRequestError("Your cart is empty");

  const unavailable = cartItems.find((item) => !item.product.isActive || !item.product.inStock);
  if (unavailable) {
    throw new BadRequestError(`${unavailable.product.name} is currently out of stock. Please update your cart.`);
  }

  const lineItems = cartItems.map((item) => {
    const tier = item.product.packTiers.find((t) => t.tierIndex === item.tierIndex);
    const packQty = tier?.packQty ?? 1;
    const discountPct = tier?.discountPct ?? 0;
    const unitPrice = tierUnitPrice(item.product.price, discountPct);
    const lineTotal = unitPrice * packQty * item.quantity;
    const gstRate = Number(item.product.gstRate);

    return {
      productId: item.productId,
      productName: item.product.name,
      imageUrl: item.product.images[0]?.url ?? null,
      sizeLabel: item.sizeLabel,
      tierIndex: item.tierIndex,
      packQty,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      gstRate,
      hsnCode: item.product.hsnCode,
      gstAmount: extractGst(lineTotal, gstRate),
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const taxAmount = lineItems.reduce((sum, i) => sum + i.gstAmount, 0);

  let discountAmount = 0;
  let couponId: number | null = null;
  if (input.couponCode) {
    const { coupon, discountAmount: amount } = await resolveCoupon(input.couponCode, subtotal);
    discountAmount = amount;
    couponId = coupon.id;
  }

  const shippingAmount = computeShipping(subtotal);
  const totalAmount = subtotal - discountAmount + shippingAmount;

  const isCod = input.paymentMethod === "COD";
  const initialStatus = isCod ? "CONFIRMED" : "PENDING";

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: `PENDING-${userId}-${Date.now()}`,
        userId,
        status: initialStatus,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PENDING",
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        couponId,
        shipName: address.name,
        shipPhone: address.phone,
        shipLine1: address.line1,
        shipLine2: address.line2,
        shipCity: address.city,
        shipState: address.state,
        shipPincode: address.pincode,
        billingGstin: user.accountType === "BUSINESS" ? user.gstin : null,
        billingAccountType: user.accountType,
        items: {
          create: lineItems.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            imageUrl: i.imageUrl,
            sizeLabel: i.sizeLabel,
            tierIndex: i.tierIndex,
            packQty: i.packQty,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            lineTotal: i.lineTotal,
            gstRate: i.gstRate,
            hsnCode: i.hsnCode,
          })),
        },
      },
      include: { items: true },
    });

    const orderNumber = buildOrderNumber(created.id);
    const updated = await tx.order.update({
      where: { id: created.id },
      data: { orderNumber },
      include: { items: true },
    });

    await tx.orderStatusHistory.create({
      data: { orderId: created.id, fromStatus: null, toStatus: initialStatus, note: "Order placed" },
    });

    if (couponId) {
      await tx.couponRedemption.create({
        data: { couponId, orderId: created.id, userId, amount: discountAmount },
      });
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return updated;
  });

  if (isCod) {
    await sendOrderConfirmation(order.id).catch((err) => {
      logger.error({ err, orderId: order.id }, "Failed to send order confirmation email");
    });
  }

  return order;
}

export async function sendOrderConfirmation(orderId: number): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });
  if (!order) return;

  const pdfBuffer = await generateInvoicePdf(order);
  const recipient = order.user.email;
  if (!recipient) {
    logger.warn(`Order ${order.orderNumber} has no email on file — skipping invoice email`);
    return;
  }

  const { subject, html } = orderConfirmationEmail(order.orderNumber, Number(order.totalAmount).toFixed(2), order.user.name ?? "");
  await sendMail({
    to: recipient,
    subject,
    html,
    attachments: [{ filename: `${order.orderNumber}-invoice.pdf`, content: pdfBuffer, contentType: "application/pdf" }],
  });
}
