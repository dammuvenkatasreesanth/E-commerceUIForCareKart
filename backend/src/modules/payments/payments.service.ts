import { prisma } from "../../lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import * as phonepe from "../../providers/payment/phonepe.provider";
import { sendOrderConfirmation } from "../checkout/checkout.service";
import { logger } from "../../lib/logger";
import type { Payment, PaymentTxnStatus } from "@prisma/client";

function buildMerchantTransactionId(orderNumber: string): string {
  return `${orderNumber}-${Date.now()}`.slice(0, 38);
}

export async function initiate(userId: number, orderId: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");
  if (order.paymentMethod === "COD") throw new BadRequestError("This order is Cash on Delivery and does not need online payment");
  if (order.paymentStatus === "PAID") throw new BadRequestError("This order has already been paid");
  if (order.status === "CANCELLED") throw new BadRequestError("This order has been cancelled");

  const merchantTransactionId = buildMerchantTransactionId(order.orderNumber);

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "PHONEPE",
      merchantTransactionId,
      amount: order.totalAmount,
      status: "INITIATED",
    },
  });

  const { redirectUrl } = await phonepe.initiatePayment({
    merchantTransactionId,
    amountRupees: Number(order.totalAmount),
    userId,
  });

  return { redirectUrl, merchantTransactionId };
}

async function applyPaymentResult(payment: Payment, result: phonepe.PhonePeCallbackPayload): Promise<void> {
  if (payment.status === "SUCCESS" || payment.status === "FAILED") {
    // Already resolved (e.g. callback arrived before redirect reconciliation) — idempotent no-op.
    return;
  }

  const newStatus: PaymentTxnStatus = result.success ? "SUCCESS" : "FAILED";

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        providerTransactionId: result.transactionId,
        rawResponse: result.raw as object,
      },
    });

    if (result.success) {
      await tx.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED" },
      });
      await tx.orderStatusHistory.create({
        data: { orderId: payment.orderId, toStatus: "CONFIRMED", note: "Payment received via PhonePe" },
      });
    } else {
      await tx.order.update({ where: { id: payment.orderId }, data: { paymentStatus: "FAILED" } });
    }
  });

  if (result.success) {
    await sendOrderConfirmation(payment.orderId).catch((err) => {
      logger.error({ err, orderId: payment.orderId }, "Failed to send order confirmation email after payment");
    });
  }
}

export async function handleCallback(authorizationHeader: string | undefined, rawBody: string): Promise<void> {
  const result = phonepe.verifyAndDecodeCallback(authorizationHeader, rawBody);

  const payment = await prisma.payment.findUnique({ where: { merchantTransactionId: result.merchantTransactionId } });
  if (!payment) {
    logger.warn(`PhonePe callback for unknown transaction ${result.merchantTransactionId}`);
    return;
  }

  await applyPaymentResult(payment, result);
}

export async function reconcile(merchantTransactionId: string): Promise<{ orderId: number; status: PaymentTxnStatus }> {
  const payment = await prisma.payment.findUnique({ where: { merchantTransactionId } });
  if (!payment) throw new NotFoundError("Payment not found");

  if (payment.status === "SUCCESS" || payment.status === "FAILED") {
    return { orderId: payment.orderId, status: payment.status };
  }

  const result = await phonepe.checkStatus(merchantTransactionId);
  await applyPaymentResult(payment, result);

  const updated = await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
  return { orderId: updated.orderId, status: updated.status };
}

const STALE_PAYMENT_THRESHOLD_MINUTES = 10;

// Covers missed/delayed S2S callbacks: periodically re-checks any payment still
// sitting in INITIATED/PENDING and reconciles it via the Check Status API.
export async function sweepStalePayments(): Promise<void> {
  const cutoff = new Date(Date.now() - STALE_PAYMENT_THRESHOLD_MINUTES * 60 * 1000);
  const stalePayments = await prisma.payment.findMany({
    where: { status: { in: ["INITIATED", "PENDING"] }, createdAt: { lt: cutoff } },
  });

  for (const payment of stalePayments) {
    try {
      await reconcile(payment.merchantTransactionId);
    } catch (err) {
      logger.error({ err, merchantTransactionId: payment.merchantTransactionId }, "Failed to reconcile stale payment");
    }
  }
}

export async function getStatus(userId: number, orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");

  return {
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
    latestPayment: order.payments[0] ?? null,
  };
}
