import { stringify } from "csv-stringify/sync";
import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import type { Prisma, OrderStatus, PaymentStatus } from "@prisma/client";

interface ListOrdersQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
}

function buildWhere(query: ListOrdersQuery): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (query.status) where.status = query.status;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.from || query.to) {
    where.createdAt = {
      ...(query.from ? { gte: query.from } : {}),
      ...(query.to ? { lte: query.to } : {}),
    };
  }
  if (query.q) {
    where.OR = [
      { orderNumber: { contains: query.q } },
      { shipName: { contains: query.q } },
      { shipPhone: { contains: query.q } },
      { user: { email: { contains: query.q } } },
    ];
  }
  return where;
}

export async function listOrders(query: ListOrdersQuery) {
  const where = buildWhere(query);

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: { items: true, user: { select: { id: true, name: true, phone: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getOrder(id: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
      refunds: { orderBy: { createdAt: "desc" } },
      returns: { orderBy: { createdAt: "desc" } },
      user: { select: { id: true, name: true, phone: true, email: true } },
    },
  });
  if (!order) throw new NotFoundError("Order not found");
  return order;
}

export async function updateOrderStatus(
  actorId: number,
  id: number,
  input: { status: OrderStatus; note?: string; trackingId?: string; carrier?: string },
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundError("Order not found");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id },
      data: {
        status: input.status,
        trackingId: input.trackingId ?? order.trackingId,
        carrier: input.carrier ?? order.carrier,
        cancelledAt: input.status === "CANCELLED" ? new Date() : order.cancelledAt,
      },
    });

    await tx.orderStatusHistory.create({
      data: { orderId: id, fromStatus: order.status, toStatus: input.status, changedById: actorId, note: input.note },
    });

    return updated;
  });
}

export async function initiateRefund(actorId: number, orderId: number, input: { amount: number; reason: string }) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");
  if (order.paymentStatus !== "PAID" && order.paymentStatus !== "PARTIALLY_REFUNDED") {
    throw new BadRequestError("This order has not been paid, so it cannot be refunded");
  }
  if (input.amount > Number(order.totalAmount)) {
    throw new BadRequestError("Refund amount cannot exceed the order total");
  }

  const payment = await prisma.payment.findFirst({ where: { orderId, status: "SUCCESS" }, orderBy: { createdAt: "desc" } });

  return prisma.$transaction(async (tx) => {
    const refund = await tx.refund.create({
      data: {
        orderId,
        paymentId: payment?.id,
        amount: input.amount,
        reason: input.reason,
        status: "REQUESTED",
        initiatedById: actorId,
      },
    });

    const fullyRefunded = input.amount >= Number(order.totalAmount);
    await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED" },
    });

    return refund;
  });
}

export async function exportOrdersCsv(query: ListOrdersQuery): Promise<string> {
  const where = buildWhere(query);
  const orders = await prisma.order.findMany({
    where,
    include: { user: { select: { name: true, phone: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((o) => ({
    orderNumber: o.orderNumber,
    customer: o.user.name ?? "",
    phone: o.user.phone ?? "",
    email: o.user.email ?? "",
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    subtotal: o.subtotal.toString(),
    discount: o.discountAmount.toString(),
    shipping: o.shippingAmount.toString(),
    total: o.totalAmount.toString(),
    placedAt: o.placedAt.toISOString(),
  }));

  return stringify(rows, { header: true });
}
