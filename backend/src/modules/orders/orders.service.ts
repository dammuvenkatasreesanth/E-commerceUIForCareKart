import { prisma } from "../../lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { generateInvoicePdf } from "../../providers/pdf/invoice.pdf";
import * as cartService from "../cart/cart.service";
import type { Role } from "@prisma/client";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"] as const;
const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

export async function listOrdersForUser(userId: number) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderForUser(userId: number, orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) throw new NotFoundError("Order not found");
  if (order.userId !== userId) throw new ForbiddenError("This order does not belong to you");
  return order;
}

/** Staff (Admin/Employee) can access any order; customers only their own. */
export async function getOrderForRoleAccess(actor: { id: number; role: Role }, orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) throw new NotFoundError("Order not found");
  if (!STAFF_ROLES.includes(actor.role) && order.userId !== actor.id) {
    throw new ForbiddenError("This order does not belong to you");
  }
  return order;
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
