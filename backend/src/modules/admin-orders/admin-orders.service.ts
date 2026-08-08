import { stringify } from "csv-stringify/sync";
import { and, asc, count, desc, eq, gte, inArray, like, lte, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import {
  orderNotes,
  orderStatusHistory,
  orders,
  payments,
  refunds,
  returnRequests,
  users,
  type ORDER_STATUS,
  type PAYMENT_STATUS,
} from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";

type OrderStatus = (typeof ORDER_STATUS)[number];
type PaymentStatus = (typeof PAYMENT_STATUS)[number];

interface ListOrdersQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  q?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
}

function buildWhere(query: ListOrdersQuery): SQL | undefined {
  const conditions: SQL[] = [];
  if (query.status) conditions.push(eq(orders.status, query.status));
  if (query.paymentStatus) conditions.push(eq(orders.paymentStatus, query.paymentStatus));
  if (query.from) conditions.push(gte(orders.createdAt, query.from));
  if (query.to) conditions.push(lte(orders.createdAt, query.to));
  if (query.q) {
    const term = `%${query.q}%`;
    conditions.push(
      or(
        like(orders.orderNumber, term),
        like(orders.shipName, term),
        like(orders.shipPhone, term),
        inArray(orders.userId, db.select({ id: users.id }).from(users).where(like(users.email, term))),
      )!,
    );
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

function orderUserColumns() {
  return { id: true as const, name: true as const, phone: true as const, email: true as const };
}

export async function listOrders(query: ListOrdersQuery) {
  const where = buildWhere(query);

  const [items, [{ value: total }]] = await Promise.all([
    db.query.orders.findMany({
      where,
      with: { items: true, user: { columns: orderUserColumns() } },
      orderBy: [desc(orders.createdAt)],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(orders).where(where),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getOrder(id: number) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
      statusHistory: { orderBy: [asc(orderStatusHistory.createdAt)] },
      notes: { orderBy: [desc(orderNotes.createdAt)] },
      payments: { orderBy: [desc(payments.createdAt)] },
      refunds: { orderBy: [desc(refunds.createdAt)] },
      returns: { orderBy: [desc(returnRequests.createdAt)] },
      user: { columns: orderUserColumns() },
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
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) throw new NotFoundError("Order not found");

  return db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({
        status: input.status,
        trackingId: input.trackingId ?? order.trackingId,
        carrier: input.carrier ?? order.carrier,
        cancelledAt: input.status === "CANCELLED" ? new Date() : order.cancelledAt,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id));

    await tx.insert(orderStatusHistory).values({ orderId: id, fromStatus: order.status, toStatus: input.status, changedById: actorId, note: input.note });

    const updated = await tx.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!updated) throw new NotFoundError("Order not found");
    return updated;
  });
}

export async function initiateRefund(actorId: number, orderId: number, input: { amount: number; reason: string }) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) throw new NotFoundError("Order not found");
  if (order.paymentStatus !== "PAID" && order.paymentStatus !== "PARTIALLY_REFUNDED") {
    throw new BadRequestError("This order has not been paid, so it cannot be refunded");
  }
  if (input.amount > Number(order.totalAmount)) {
    throw new BadRequestError("Refund amount cannot exceed the order total");
  }

  const payment = await db.query.payments.findFirst({
    where: and(eq(payments.orderId, orderId), eq(payments.status, "SUCCESS")),
    orderBy: [desc(payments.createdAt)],
  });

  return db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(refunds)
      .values({
        orderId,
        paymentId: payment?.id,
        amount: String(input.amount),
        reason: input.reason,
        status: "REQUESTED",
        initiatedById: actorId,
        updatedAt: new Date(),
      })
      .$returningId();

    const fullyRefunded = input.amount >= Number(order.totalAmount);
    await tx.update(orders).set({ paymentStatus: fullyRefunded ? "REFUNDED" : "PARTIALLY_REFUNDED", updatedAt: new Date() }).where(eq(orders.id, orderId));

    const refund = await tx.query.refunds.findFirst({ where: eq(refunds.id, id) });
    if (!refund) throw new NotFoundError("Refund not found");
    return refund;
  });
}

export async function exportOrdersCsv(query: ListOrdersQuery): Promise<string> {
  const where = buildWhere(query);
  const items = await db.query.orders.findMany({
    where,
    with: { user: { columns: { name: true, phone: true, email: true } } },
    orderBy: [desc(orders.createdAt)],
  });

  const rows = items.map((o) => ({
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
