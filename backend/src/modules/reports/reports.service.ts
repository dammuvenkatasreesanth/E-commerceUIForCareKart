import { stringify } from "csv-stringify/sync";
import { and, asc, count, desc, eq, gte, inArray, lt, ne, sum, sql } from "drizzle-orm";
import { db } from "../../db";
import { coupons, orders, users } from "../../db/schema";

const REVENUE_STATUSES = ["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

export async function getDashboardKpis() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    [revenueAgg],
    [{ value: orderCount }],
    [{ value: customerCount }],
    [thisMonthAgg],
    [lastMonthAgg],
    [{ value: todayOrders }],
    [{ value: pendingOrders }],
  ] = await Promise.all([
    db.select({ sum: sum(orders.totalAmount) }).from(orders).where(inArray(orders.status, REVENUE_STATUSES)),
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(users).where(eq(users.role, "CUSTOMER")),
    db
      .select({ sum: sum(orders.totalAmount), value: count() })
      .from(orders)
      .where(and(inArray(orders.status, REVENUE_STATUSES), gte(orders.createdAt, startOfThisMonth))),
    db
      .select({ sum: sum(orders.totalAmount) })
      .from(orders)
      .where(and(inArray(orders.status, REVENUE_STATUSES), gte(orders.createdAt, startOfLastMonth), lt(orders.createdAt, startOfThisMonth))),
    db.select({ value: count() }).from(orders).where(gte(orders.createdAt, startOfToday)),
    db.select({ value: count() }).from(orders).where(eq(orders.status, "PENDING")),
  ]);

  const totalRevenue = Number(revenueAgg.sum ?? 0);
  const thisMonthRevenue = Number(thisMonthAgg.sum ?? 0);
  const lastMonthRevenue = Number(lastMonthAgg.sum ?? 0);
  const revenueGrowthPct = lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000) / 10 : null;

  return {
    totalRevenue,
    totalOrders: orderCount,
    totalCustomers: customerCount,
    averageOrderValue: orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0,
    thisMonthRevenue,
    thisMonthOrders: thisMonthAgg.value,
    revenueGrowthPct,
    ordersToday: todayOrders,
    pendingOrders,
  };
}

export async function getSalesTrend(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const dayExpr = sql<unknown>`DATE(${orders.placedAt})`;

  const rows = await db
    .select({ day: dayExpr, orderCount: count(), revenue: sum(orders.totalAmount) })
    .from(orders)
    .where(and(gte(orders.placedAt, since), ne(orders.status, "CANCELLED")))
    .groupBy(dayExpr)
    .orderBy(asc(dayExpr));

  return rows.map((r) => ({
    date: r.day instanceof Date ? (r.day as Date).toISOString().slice(0, 10) : String(r.day).slice(0, 10),
    orders: r.orderCount,
    revenue: Number(r.revenue ?? 0),
  }));
}

export async function getPendingOrderAlerts() {
  return db.query.orders.findMany({
    where: eq(orders.status, "PENDING"),
    columns: { id: true, orderNumber: true, createdAt: true, totalAmount: true },
    with: { user: { columns: { name: true, phone: true } } },
    orderBy: [asc(orders.createdAt)],
    limit: 50,
  });
}

export async function exportSalesCsv() {
  const items = await db.query.orders.findMany({
    where: inArray(orders.status, REVENUE_STATUSES),
    with: { user: { columns: { name: true, email: true } } },
    orderBy: [desc(orders.placedAt)],
  });
  return stringify(
    items.map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.user.name ?? "",
      email: o.user.email ?? "",
      status: o.status,
      total: o.totalAmount.toString(),
      placedAt: o.placedAt.toISOString(),
    })),
    { header: true },
  );
}

export async function exportCustomersCsv() {
  const customers = await db.query.users.findMany({
    where: eq(users.role, "CUSTOMER"),
    columns: { id: true, name: true, phone: true, email: true, accountType: true, gstin: true, gstStatus: true, createdAt: true },
  });

  const userIds = customers.map((c) => c.id);
  const orderCounts =
    userIds.length > 0
      ? await db.select({ userId: orders.userId, value: count() }).from(orders).where(inArray(orders.userId, userIds)).groupBy(orders.userId)
      : [];
  const countByUserId = new Map(orderCounts.map((c) => [c.userId, c.value]));

  return stringify(
    customers.map((c) => ({
      name: c.name ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      accountType: c.accountType,
      gstin: c.gstin ?? "",
      gstStatus: c.gstStatus,
      orders: countByUserId.get(c.id) ?? 0,
      joinedAt: c.createdAt.toISOString(),
    })),
    { header: true },
  );
}

export async function exportCouponsCsv() {
  const items = await db.query.coupons.findMany({ orderBy: [desc(coupons.createdAt)] });
  return stringify(
    items.map((c) => ({
      code: c.code,
      type: c.type,
      value: c.value.toString(),
      minOrderAmount: c.minOrderAmount.toString(),
      maxUses: c.maxUses ?? "",
      usedCount: c.usedCount,
      isActive: c.isActive,
      expiresAt: c.expiresAt?.toISOString() ?? "",
    })),
    { header: true },
  );
}
