import { and, desc, eq, inArray, lt } from "drizzle-orm";
import { db } from "../../db";
import { orders, orderStatusHistory, payments, type PAYMENT_TXN_STATUS } from "../../db/schema";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import * as phonepe from "../../providers/payment/phonepe.provider";
import { sendOrderConfirmation } from "../checkout/checkout.service";
import { logger } from "../../lib/logger";

type Payment = typeof payments.$inferSelect;
type PaymentTxnStatus = (typeof PAYMENT_TXN_STATUS)[number];

function buildMerchantTransactionId(orderNumber: string): string {
  return `${orderNumber}-${Date.now()}`.slice(0, 38);
}

export async function initiate(userId: number, orderId: number) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");
  if (order.paymentMethod === "COD") throw new BadRequestError("This order is Cash on Delivery and does not need online payment");
  if (order.paymentStatus === "PAID") throw new BadRequestError("This order has already been paid");
  if (order.status === "CANCELLED") throw new BadRequestError("This order has been cancelled");

  const merchantTransactionId = buildMerchantTransactionId(order.orderNumber);

  await db.insert(payments).values({
    orderId: order.id,
    provider: "PHONEPE",
    merchantTransactionId,
    amount: order.totalAmount,
    status: "INITIATED",
    updatedAt: new Date(),
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

  await db.transaction(async (tx) => {
    await tx
      .update(payments)
      .set({
        status: newStatus,
        providerTransactionId: result.transactionId,
        rawResponse: result.raw as object,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id));

    if (result.success) {
      await tx.update(orders).set({ paymentStatus: "PAID", status: "CONFIRMED", updatedAt: new Date() }).where(eq(orders.id, payment.orderId));
      await tx.insert(orderStatusHistory).values({ orderId: payment.orderId, toStatus: "CONFIRMED", note: "Payment received via PhonePe" });
    } else {
      await tx
        .update(orders)
        .set({ paymentStatus: "FAILED", status: "CANCELLED", cancelledAt: new Date(), cancelReason: "Payment was not completed", updatedAt: new Date() })
        .where(eq(orders.id, payment.orderId));
      await tx.insert(orderStatusHistory).values({ orderId: payment.orderId, toStatus: "CANCELLED", note: "Order cancelled — payment failed" });
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

  const payment = await db.query.payments.findFirst({ where: eq(payments.merchantTransactionId, result.merchantTransactionId) });
  if (!payment) {
    logger.warn(`PhonePe callback for unknown transaction ${result.merchantTransactionId}`);
    return;
  }

  await applyPaymentResult(payment, result);
}

export async function reconcile(merchantTransactionId: string): Promise<{ orderId: number; status: PaymentTxnStatus }> {
  const payment = await db.query.payments.findFirst({ where: eq(payments.merchantTransactionId, merchantTransactionId) });
  if (!payment) throw new NotFoundError("Payment not found");

  if (payment.status === "SUCCESS" || payment.status === "FAILED") {
    return { orderId: payment.orderId, status: payment.status };
  }

  const result = await phonepe.checkStatus(merchantTransactionId);
  await applyPaymentResult(payment, result);

  const updated = await db.query.payments.findFirst({ where: eq(payments.id, payment.id) });
  if (!updated) throw new NotFoundError("Payment not found");
  return { orderId: updated.orderId, status: updated.status };
}

const STALE_PAYMENT_THRESHOLD_MINUTES = 10;

// Covers missed/delayed S2S callbacks: periodically re-checks any payment still
// sitting in INITIATED/PENDING and reconciles it via the Check Status API.
export async function sweepStalePayments(): Promise<void> {
  const cutoff = new Date(Date.now() - STALE_PAYMENT_THRESHOLD_MINUTES * 60 * 1000);
  const stalePayments = await db.query.payments.findMany({
    where: and(inArray(payments.status, ["INITIATED", "PENDING"]), lt(payments.createdAt, cutoff)),
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
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { payments: { orderBy: [desc(payments.createdAt)], limit: 1 } },
  });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");

  return {
    orderStatus: order.status,
    paymentStatus: order.paymentStatus,
    latestPayment: order.payments[0] ?? null,
  };
}
