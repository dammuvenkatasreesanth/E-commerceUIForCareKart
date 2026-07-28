import { stringify } from "csv-stringify/sync";
import { prisma } from "../../lib/prisma";

const REVENUE_STATUSES = ["CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

export async function getDashboardKpis() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [revenueAgg, orderCount, customerCount, thisMonthAgg, lastMonthAgg, todayOrders, pendingOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: { in: [...REVENUE_STATUSES] } }, _sum: { totalAmount: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: startOfThisMonth } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { status: { in: [...REVENUE_STATUSES] }, createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);
  const thisMonthRevenue = Number(thisMonthAgg._sum.totalAmount ?? 0);
  const lastMonthRevenue = Number(lastMonthAgg._sum.totalAmount ?? 0);
  const revenueGrowthPct = lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 1000) / 10 : null;

  return {
    totalRevenue,
    totalOrders: orderCount,
    totalCustomers: customerCount,
    averageOrderValue: orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0,
    thisMonthRevenue,
    thisMonthOrders: thisMonthAgg._count,
    revenueGrowthPct,
    ordersToday: todayOrders,
    pendingOrders,
  };
}

export async function getSalesTrend(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const rows = await prisma.$queryRaw<{ day: Date; orderCount: bigint; revenue: string }[]>`
    SELECT DATE(placedAt) as day, COUNT(*) as orderCount, COALESCE(SUM(totalAmount), 0) as revenue
    FROM \`Order\`
    WHERE placedAt >= ${since} AND status != 'CANCELLED'
    GROUP BY DATE(placedAt)
    ORDER BY day ASC
  `;

  return rows.map((r) => ({
    date: r.day.toISOString().slice(0, 10),
    orders: Number(r.orderCount),
    revenue: Number(r.revenue),
  }));
}

export async function getPendingOrderAlerts() {
  return prisma.order.findMany({
    where: { status: "PENDING" },
    select: { id: true, orderNumber: true, createdAt: true, totalAmount: true, user: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
}

export async function exportSalesCsv() {
  const orders = await prisma.order.findMany({
    where: { status: { in: [...REVENUE_STATUSES] } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { placedAt: "desc" },
  });
  return stringify(
    orders.map((o) => ({
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
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { name: true, phone: true, email: true, accountType: true, gstin: true, gstStatus: true, createdAt: true, _count: { select: { orders: true } } },
  });
  return stringify(
    customers.map((c) => ({
      name: c.name ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      accountType: c.accountType,
      gstin: c.gstin ?? "",
      gstStatus: c.gstStatus,
      orders: c._count.orders,
      joinedAt: c.createdAt.toISOString(),
    })),
    { header: true },
  );
}

export async function exportCouponsCsv() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return stringify(
    coupons.map((c) => ({
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
