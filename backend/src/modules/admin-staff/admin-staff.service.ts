import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { auditLogs, users, type ROLE, type USER_STATUS } from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { indexBy } from "../../lib/batchLoad";
import * as authService from "../auth/auth.service";

type Role = (typeof ROLE)[number];
type UserStatus = (typeof USER_STATUS)[number];

const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

export async function listStaff() {
  return db.query.users.findMany({
    where: inArray(users.role, STAFF_ROLES),
    columns: { id: true, name: true, email: true, role: true, status: true, claimedAt: true, lastLoginAt: true, createdAt: true },
    orderBy: [desc(users.createdAt)],
  });
}

export async function createStaff(
  issuedById: number,
  input: { email: string; name: string; role: Extract<Role, "ADMIN" | "EMPLOYEE"> },
) {
  return authService.createStaffInvite(issuedById, input);
}

export async function updateStaffRole(id: number, role: Role) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user || !STAFF_ROLES.includes(user.role)) throw new NotFoundError("Staff member not found");
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!updated) throw new NotFoundError("Staff member not found");
  return updated;
}

export async function updateStaffStatus(actorId: number, id: number, status: UserStatus) {
  if (actorId === id && status !== "ACTIVE") {
    throw new BadRequestError("You cannot block or suspend your own account");
  }
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!user || !STAFF_ROLES.includes(user.role)) throw new NotFoundError("Staff member not found");
  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, id));
  const updated = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!updated) throw new NotFoundError("Staff member not found");
  return updated;
}

export async function listAuditLog(query: { actorId?: number; entityType?: string; page: number; limit: number }) {
  const conditions = [
    query.actorId !== undefined ? eq(auditLogs.actorId, query.actorId) : undefined,
    query.entityType !== undefined ? eq(auditLogs.entityType, query.entityType) : undefined,
  ].filter((c): c is NonNullable<typeof c> => c !== undefined);
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.auditLogs.findMany({ where, orderBy: [desc(auditLogs.createdAt)], limit: query.limit, offset: (query.page - 1) * query.limit }),
    db.select({ value: count() }).from(auditLogs).where(where),
  ]);

  const actorIds = [...new Set(rows.map((r) => r.actorId).filter((id): id is number => id != null))];
  const actorRows =
    actorIds.length > 0
      ? await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).where(inArray(users.id, actorIds))
      : [];
  const actorById = indexBy(actorRows, (u) => u.id);
  const items = rows.map((r) => ({ ...r, actor: r.actorId != null ? actorById.get(r.actorId) ?? null : null }));

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}
