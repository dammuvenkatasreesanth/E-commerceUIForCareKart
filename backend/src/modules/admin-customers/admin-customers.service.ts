import { and, count, desc, eq, inArray, like, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { addresses, orders, users, type ACCOUNT_TYPE, type GST_STATUS, type USER_STATUS } from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { loadOrderItems } from "../../lib/orderRelations";
import { updateProfile, type UpdateProfileInput } from "../users/users.service";

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

// Every editable field except password (name, email, phone, account type,
// GSTIN) — reuses the customer's own self-service update logic exactly
// (email-changed-so-reverify, GSTIN-changed-so-back-to-PENDING, etc.) so an
// admin fixing a typo goes through the same safe transitions a customer
// would, rather than a separate, easier-to-drift-from copy of that logic.
export async function updateCustomer(id: number, input: UpdateProfileInput) {
  const existing = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!existing || existing.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  return updateProfile(id, input);
}

export async function getCustomer(id: number) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");

  const [userAddresses, recentOrders, [{ value: orderCount }]] = await Promise.all([
    db.select().from(addresses).where(eq(addresses.userId, id)),
    db.query.orders.findMany({ where: eq(orders.userId, id), orderBy: [desc(orders.createdAt)], limit: 10 }),
    db.select({ value: count() }).from(orders).where(eq(orders.userId, id)),
  ]);
  const itemsByOrder = await loadOrderItems(recentOrders.map((o) => o.id));

  return {
    ...user,
    addresses: userAddresses,
    // `orders` below is capped at the 10 most recent (matches listCustomers'
    // shape, which computes this the same way) — this page previously
    // crashed for every single customer since the frontend unconditionally
    // reads customer._count.orders in the Overview section, but this
    // endpoint never returned a _count field at all.
    _count: { orders: orderCount },
    orders: recentOrders.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] })),
  };
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
