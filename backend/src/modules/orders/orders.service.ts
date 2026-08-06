import { prisma } from "../../lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { generateInvoicePdf } from "../../providers/pdf/invoice.pdf";
import * as cartService from "../cart/cart.service";
import * as paymentsService from "../payments/payments.service";
import { logger } from "../../lib/logger";
import type { Role, Order } from "@prisma/client";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"] as const;
const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

const ORDER_DETAIL_INCLUDE = { items: true, statusHistory: { orderBy: { createdAt: "asc" as const } } };

// A user leaving the PhonePe page via the browser back button (rather than its own
// redirect) never hits our /redirect callback, so the order can be stuck showing
// "Pending" until the periodic stale-payment sweep catches up (up to 10 minutes).
// Reconciling on read means the order self-corrects the moment the customer next
// looks at it, regardless of how they left the payment page.
async function reconcilePendingPayment(order: Pick<Order, "id" | "paymentMethod" | "paymentStatus">): Promise<boolean> {
  if (order.paymentMethod === "COD" || order.paymentStatus !== "PENDING") return false;

  const payment = await prisma.payment.findFirst({ where: { orderId: order.id }, orderBy: { createdAt: "desc" } });
  if (!payment || (payment.status !== "INITIATED" && payment.status !== "PENDING")) return false;

  try {
    await paymentsService.reconcile(payment.merchantTransactionId);
  } catch (err) {
    logger.warn({ err, orderId: order.id }, "Failed to reconcile pending payment on order read");
  }
  return true;
}

// Bounds worst-case load from a customer with many stale test/abandoned orders —
// reconciling is done one at a time (not Promise.all) to avoid bursting concurrent
// DB connections and outbound PhonePe calls on a resource-constrained host.
const MAX_RECONCILE_PER_LIST = 3;

export async function listOrdersForUser(userId: number) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  let reconciledAny = false;
  let attempts = 0;
  for (const order of orders) {
    if (attempts >= MAX_RECONCILE_PER_LIST) break;
    if (order.paymentMethod === "COD" || order.paymentStatus !== "PENDING") continue;
    attempts += 1;
    if (await reconcilePendingPayment(order)) reconciledAny = true;
  }
  if (!reconciledAny) return orders;

  return prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: "desc" } });
}

export async function getOrderForUser(userId: number, orderId: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: ORDER_DETAIL_INCLUDE });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");

  if (!(await reconcilePendingPayment(order))) return order;
  return prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: ORDER_DETAIL_INCLUDE });
}

/** Staff (Admin/Employee) can access any order; customers only their own. */
export async function getOrderForRoleAccess(actor: { id: number; role: Role }, orderId: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: ORDER_DETAIL_INCLUDE });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }

  if (!(await reconcilePendingPayment(order))) return order;
  return prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: ORDER_DETAIL_INCLUDE });
}

export async function cancelOrder(actor: { id: number; role: Role }, orderId: number, reason: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }
  if (!CANCELLABLE_STATUSES.includes(order.status as (typeof CANCELLABLE_STATUSES)[number])) {
    throw new BadRequestError("This order can no longer be cancelled as it has already shipped");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: reason },
    });

    await tx.orderStatusHistory.create({
      data: { orderId, fromStatus: order.status, toStatus: "CANCELLED", changedById: actor.id, note: reason },
    });

    if (order.paymentStatus === "PAID") {
      await tx.refund.create({
        data: { orderId, amount: order.totalAmount, reason: "Order cancelled", status: "REQUESTED" },
      });
    }

    return updated;
  });
}

export async function requestReturn(
  actor: { id: number; role: Role },
  orderId: number,
  input: { orderItemId?: number; reason: string; requestedQty: number },
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }
  if (order.status !== "DELIVERED") {
    throw new BadRequestError("Only delivered orders can be returned");
  }

  if (input.orderItemId) {
    const item = await prisma.orderItem.findUnique({ where: { id: input.orderItemId } });
    if (!item || item.orderId !== orderId) throw new BadRequestError("Invalid order item");
  }

  return prisma.$transaction(async (tx) => {
    const returnRequest = await tx.returnRequest.create({
      data: {
        orderId,
        orderItemId: input.orderItemId,
        userId: order.userId,
        reason: input.reason,
        requestedQty: input.requestedQty,
        status: "REQUESTED",
      },
    });

    await tx.order.update({ where: { id: orderId }, data: { status: "RETURN_REQUESTED" } });
    await tx.orderStatusHistory.create({
      data: { orderId, fromStatus: order.status, toStatus: "RETURN_REQUESTED", changedById: actor.id, note: input.reason },
    });

    return returnRequest;
  });
}

export async function reorder(userId: number, orderId: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");

  const added: string[] = [];
  const skipped: string[] = [];

  for (const item of order.items) {
    if (!item.productId) {
      skipped.push(item.productName);
      continue;
    }
    try {
      await cartService.addItem(userId, {
        productId: item.productId,
        sizeLabel: item.sizeLabel,
        tierIndex: item.tierIndex,
        quantity: item.quantity,
      });
      added.push(item.productName);
    } catch {
      skipped.push(item.productName);
    }
  }

  return { cart: await cartService.getCart(userId), added, skipped };
}

export async function addOrderNote(actor: { id: number; role: Role }, orderId: number, note: string, isInternal: boolean) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }
  return prisma.orderNote.create({ data: { orderId, authorId: actor.id, note, isInternal } });
}

export async function getInvoicePdf(actor: { id: number; role: Role }, orderId: number): Promise<{ buffer: Buffer; filename: string }> {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }

  const buffer = await generateInvoicePdf(order);
  return { buffer, filename: `${order.orderNumber}-invoice.pdf` };
}
