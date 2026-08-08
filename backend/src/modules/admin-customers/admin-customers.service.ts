import { and, count, desc, eq, inArray, like, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { orders, users, type ACCOUNT_TYPE, type GST_STATUS, type USER_STATUS } from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";

type AccountType = (typeof ACCOUNT_TYPE)[number];
type GstStatus = (typeof GST_STATUS)[number];
type UserStatus = (typeof USER_STATUS)[number];

interface ListCustomersQuery {
  q?: string;
  accountType?: AccountType;
  gstStatus?: GstStatus;
  page: number;
  limit: number;
}

export async function listCustomers(query: ListCustomersQuery) {
  const conditions: SQL[] = [eq(users.role, "CUSTOMER")];
  if (query.accountType) conditions.push(eq(users.accountType, query.accountType));
  if (query.gstStatus) conditions.push(eq(users.gstStatus, query.gstStatus));
  if (query.q) {
    const term = `%${query.q}%`;
    conditions.push(or(like(users.name, term), like(users.phone, term), like(users.email, term), like(users.gstin, term))!);
  }
  const where = and(...conditions);

  const [items, [{ value: total }]] = await Promise.all([
    db.query.users.findMany({
      where,
      columns: { id: true, name: true, phone: true, email: true, accountType: true, gstin: true, gstStatus: true, status: true, createdAt: true },
      orderBy: [desc(users.createdAt)],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(users).where(where),
  ]);

  const userIds = items.map((u) => u.id);
  const orderCounts =
    userIds.length > 0
      ? await db.select({ userId: orders.userId, value: count() }).from(orders).where(inArray(orders.userId, userIds)).groupBy(orders.userId)
      : [];
  const countByUserId = new Map(orderCounts.map((c) => [c.userId, c.value]));

  return {
    items: items.map((u) => ({ ...u, _count: { orders: countByUserId.get(u.id) ?? 0 } })),
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
}

export async function getCustomer(id: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      addresses: true,
      orders: { orderBy: [desc(orders.createdAt)], limit: 10, with: { items: true } },
    },
  });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  return user;
}

export async function decideGstApproval(id: number, decision: GstStatus) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  if (user.gstStatus !== "PENDING") throw new BadRequestError("This customer has no pending GST approval request");

  await db.update(users).set({ gstStatus: decision, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!updated) throw new NotFoundError("Customer not found");
  return updated;
}

export async function setCustomerStatus(id: number, status: UserStatus) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!updated) throw new NotFoundError("Customer not found");
  return updated;
}
