import { stringify } from "csv-stringify/sync";
import { and, count, desc, eq, gte, inArray, like, lte, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { orderStatusHistory, orders, payments, refunds, users, type ORDER_STATUS, type PAYMENT_STATUS } from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { indexBy } from "../../lib/batchLoad";
import { loadOrderItems, loadOrderNotes, loadOrderPayments, loadOrderRefunds, loadOrderReturns, loadOrderStatusHistory } from "../../lib/orderRelations";
import { refreshTrackingNow } from "../shipping/shipping.service";

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

async function loadOrderUsers(orderRows: (typeof orders.$inferSelect)[]) {
  const userIds = [...new Set(orderRows.map((o) => o.userId))];
  const userRows =
    userIds.length > 0
      ? await db.select({ id: users.id, name: users.name, phone: users.phone, email: users.email }).from(users).where(inArray(users.id, userIds))
      : [];
  return indexBy(userRows, (u) => u.id);
}

export async function listOrders(query: ListOrdersQuery) {
  const where = buildWhere(query);

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.orders.findMany({ where, orderBy: [desc(orders.createdAt)], limit: query.limit, offset: (query.page - 1) * query.limit }),
    db.select({ value: count() }).from(orders).where(where),
  ]);

  const [itemsByOrder, userById] = await Promise.all([loadOrderItems(rows.map((o) => o.id)), loadOrderUsers(rows)]);
  const items = rows.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [], user: userById.get(o.userId)! }));

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getOrder(id: number) {
  const row = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!row) throw new NotFoundError("Order not found");

  const [itemsByOrder, statusHistoryByOrder, notesByOrder, paymentsByOrder, refundsByOrder, returnsByOrder, userById] = await Promise.all([
    loadOrderItems([id]),
    loadOrderStatusHistory([id]),
    loadOrderNotes([id]),
    loadOrderPayments([id]),
    loadOrderRefunds([id]),
    loadOrderReturns([id]),
    loadOrderUsers([row]),
  ]);

  return {
    ...row,
    items: itemsByOrder.get(id) ?? [],
    statusHistory: statusHistoryByOrder.get(id) ?? [],
    notes: notesByOrder.get(id) ?? [],
    payments: paymentsByOrder.get(id) ?? [],
    refunds: refundsByOrder.get(id) ?? [],
    returns: returnsByOrder.get(id) ?? [],
    user: userById.get(row.userId)!,
  };
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

export async function refreshShipmentTracking(orderId: number) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order) throw new NotFoundError("Order not found");
  if (!order.trackingId) throw new BadRequestError("This order has no Delhivery tracking ID yet");
  return refreshTrackingNow(orderId);
}

export async function exportOrdersCsv(query: ListOrdersQuery): Promise<string> {
  const where = buildWhere(query);
  const orderRows = await db.query.orders.findMany({ where, orderBy: [desc(orders.createdAt)] });
  const userById = await loadOrderUsers(orderRows);
  const items = orderRows.map((o) => ({ ...o, user: userById.get(o.userId)! }));

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
