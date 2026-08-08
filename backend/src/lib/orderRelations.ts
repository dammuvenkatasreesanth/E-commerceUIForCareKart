import { asc, desc, inArray } from "drizzle-orm";
import { db } from "../db";
import { orderItems, orderNotes, orderStatusHistory, payments, refunds, returnRequests } from "../db/schema";
import { groupBy } from "./batchLoad";

// Batch-loaders for Order's "many" relations, keyed by orderId — replaces
// Drizzle's relational with:{} API, which generates LEFT JOIN LATERAL SQL that
// production's MariaDB doesn't support.
export async function loadOrderItems(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof orderItems.$inferSelect)[]>();
  const rows = await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds));
  return groupBy(rows, (r) => r.orderId);
}

export async function loadOrderStatusHistory(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof orderStatusHistory.$inferSelect)[]>();
  const rows = await db.select().from(orderStatusHistory).where(inArray(orderStatusHistory.orderId, orderIds)).orderBy(asc(orderStatusHistory.createdAt));
  return groupBy(rows, (r) => r.orderId);
}

export async function loadOrderNotes(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof orderNotes.$inferSelect)[]>();
  const rows = await db.select().from(orderNotes).where(inArray(orderNotes.orderId, orderIds)).orderBy(desc(orderNotes.createdAt));
  return groupBy(rows, (r) => r.orderId);
}

export async function loadOrderPayments(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof payments.$inferSelect)[]>();
  const rows = await db.select().from(payments).where(inArray(payments.orderId, orderIds)).orderBy(desc(payments.createdAt));
  return groupBy(rows, (r) => r.orderId);
}

export async function loadOrderRefunds(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof refunds.$inferSelect)[]>();
  const rows = await db.select().from(refunds).where(inArray(refunds.orderId, orderIds)).orderBy(desc(refunds.createdAt));
  return groupBy(rows, (r) => r.orderId);
}

export async function loadOrderReturns(orderIds: number[]) {
  if (orderIds.length === 0) return new Map<number, (typeof returnRequests.$inferSelect)[]>();
  const rows = await db.select().from(returnRequests).where(inArray(returnRequests.orderId, orderIds)).orderBy(desc(returnRequests.createdAt));
  return groupBy(rows, (r) => r.orderId);
}
