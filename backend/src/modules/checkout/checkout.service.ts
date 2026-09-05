import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { addresses, coupons, couponRedemptions, cartItems, orderItems, orders, orderStatusHistory, packPriceTiers, productImages, productSizes, products, users, type PAYMENT_METHOD } from "../../db/schema";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { tierUnitPrice, computeShipping } from "../../lib/pricing";
import { buildOrderNumber } from "../../lib/orderNumber";
import { getRawCartItems } from "../cart/cart.service";
import { resolveCoupon } from "../coupons/coupons.service";
import { generateInvoicePdf } from "../../providers/pdf/invoice.pdf";
import { sendMail } from "../../providers/email/mailer";
import { orderConfirmationEmail } from "../../providers/email/templates/orderConfirmation";
import { logger } from "../../lib/logger";
import { loadOrderItems } from "../../lib/orderRelations";
import { createShipmentForOrder } from "../shipping/shipping.service";

interface BuyNowInput {
  productId: number;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
}

interface CreateOrderInput {
  addressId: number;
  paymentMethod: (typeof PAYMENT_METHOD)[number];
  couponCode?: string;
  buyNow?: BuyNowInput;
}

function extractGst(lineTotal: number, gstRatePct: number): number {
  // Prices are stored GST-inclusive; this recovers the tax component for the invoice.
  return Math.round(lineTotal - lineTotal / (1 + gstRatePct / 100));
}

// Builds a single-item "raw cart line" for Buy Now, shaped exactly like
// getRawCartItems()'s output so the rest of createOrder() doesn't need to
// know which path it came from.
async function buildBuyNowLine(buyNow: BuyNowInput) {
  const [product] = await db.select().from(products).where(eq(products.id, buyNow.productId)).limit(1);
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  const [sizes, images, tiers] = await Promise.all([
    db.select().from(productSizes).where(eq(productSizes.productId, buyNow.productId)),
    db.select().from(productImages).where(eq(productImages.productId, buyNow.productId)).orderBy(productImages.sortOrder),
    db.select().from(packPriceTiers).where(eq(packPriceTiers.productId, buyNow.productId)),
  ]);
  if (!sizes.some((s) => s.size === buyNow.sizeLabel)) {
    throw new BadRequestError("Selected size is not available for this product");
  }
  if (!tiers.some((t) => t.tierIndex === buyNow.tierIndex)) {
    throw new BadRequestError("Selected pack tier is not available for this product");
  }

  return [
    {
      productId: buyNow.productId,
      sizeLabel: buyNow.sizeLabel,
      tierIndex: buyNow.tierIndex,
      quantity: buyNow.quantity,
      product: { ...product, images, packTiers: tiers },
    },
  ];
}

export async function createOrder(userId: number, input: CreateOrderInput) {
  const [user, address, items] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.query.addresses.findFirst({ where: eq(addresses.id, input.addressId) }),
    input.buyNow ? buildBuyNowLine(input.buyNow) : getRawCartItems(userId),
  ]);

  if (!user) throw new NotFoundError("User not found");
  if (!address) throw new NotFoundError("Address not found");
  if (address.userId !== userId) throw new ForbiddenError("This address does not belong to you");
  if (items.length === 0) throw new BadRequestError("Your cart is empty");

  const unavailable = items.find((item) => !item.product.isActive || !item.product.inStock);
  if (unavailable) {
    throw new BadRequestError(`${unavailable.product.name} is currently out of stock. Please update your cart.`);
  }

  const lineItems = items.map((item) => {
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
      weightGrams: item.product.weightGrams,
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

  const orderId = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(orders)
      .values({
        orderNumber: `PENDING-${userId}-${Date.now()}`,
        userId,
        status: initialStatus,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PENDING",
        subtotal: String(subtotal),
        discountAmount: String(discountAmount),
        shippingAmount: String(shippingAmount),
        taxAmount: String(taxAmount),
        totalAmount: String(totalAmount),
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
        updatedAt: new Date(),
      })
      .$returningId();

    await tx.insert(orderItems).values(
      lineItems.map((i) => ({
        orderId: id,
        productId: i.productId,
        productName: i.productName,
        imageUrl: i.imageUrl,
        sizeLabel: i.sizeLabel,
        tierIndex: i.tierIndex,
        packQty: i.packQty,
        unitPrice: String(i.unitPrice),
        quantity: i.quantity,
        lineTotal: String(i.lineTotal),
        gstRate: String(i.gstRate),
        hsnCode: i.hsnCode,
        weightGrams: i.weightGrams,
      })),
    );

    const orderNumber = buildOrderNumber(id);
    await tx.update(orders).set({ orderNumber, updatedAt: new Date() }).where(eq(orders.id, id));

    await tx.insert(orderStatusHistory).values({ orderId: id, fromStatus: null, toStatus: initialStatus, note: "Order placed" });

    if (couponId) {
      await tx.insert(couponRedemptions).values({ couponId, orderId: id, userId, amount: String(discountAmount) });
      await tx.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, couponId));
    }

    // Buy Now never touched the real cart, so there's nothing to clear. For
    // an online-payment order, the cart must survive until payment actually
    // succeeds (see payments.service.ts's applyPaymentResult) — this order
    // is only PENDING right now, and clearing the cart here would strand a
    // customer whose payment fails or who cancels on PhonePe's page with an
    // empty cart despite never having actually paid. COD orders are already
    // CONFIRMED at this point, so clearing immediately is correct for them.
    if (!input.buyNow && isCod) {
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));
    }

    return id;
  });

  const [orderRow] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!orderRow) throw new NotFoundError("Order not found");
  const itemsByOrder = await loadOrderItems([orderId]);
  const order = { ...orderRow, items: itemsByOrder.get(orderId) ?? [] };

  if (isCod) {
    await sendOrderConfirmation(order.id).catch((err) => {
      logger.error({ err, orderId: order.id }, "Failed to send order confirmation email");
    });
    createShipmentForOrder(order.id).catch((err) => {
      logger.error({ err, orderId: order.id }, "Failed to create Delhivery shipment");
    });
  }

  return order;
}

export async function sendOrderConfirmation(orderId: number): Promise<void> {
  const [orderRow] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!orderRow) return;

  const [itemsByOrder, [user]] = await Promise.all([
    loadOrderItems([orderId]),
    db.select().from(users).where(eq(users.id, orderRow.userId)).limit(1),
  ]);
  const order = { ...orderRow, items: itemsByOrder.get(orderId) ?? [], user };

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
