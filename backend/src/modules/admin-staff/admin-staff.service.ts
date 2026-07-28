import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import * as authService from "../auth/auth.service";
import type { Role, UserStatus } from "@prisma/client";

const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

export async function listStaff() {
  return prisma.user.findMany({
    where: { role: { in: STAFF_ROLES } },
    select: { id: true, name: true, email: true, role: true, status: true, claimedAt: true, lastLoginAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createStaff(
  issuedById: number,
  input: { email: string; name: string; role: Extract<Role, "ADMIN" | "EMPLOYEE"> },
) {
  return authService.createStaffInvite(issuedById, input);
}

export async function updateStaffRole(id: number, role: Role) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !STAFF_ROLES.includes(user.role)) throw new NotFoundError("Staff member not found");
  return prisma.user.update({ where: { id }, data: { role } });
}

export async function updateStaffStatus(actorId: number, id: number, status: UserStatus) {
  if (actorId === id && status !== "ACTIVE") {
    throw new BadRequestError("You cannot block or suspend your own account");
  }
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !STAFF_ROLES.includes(user.role)) throw new NotFoundError("Staff member not found");
  return prisma.user.update({ where: { id }, data: { status } });
}

export async function listAuditLog(query: { actorId?: number; entityType?: string; page: number; limit: number }) {
  const where = {
    ...(query.actorId ? { actorId: query.actorId } : {}),
    ...(query.entityType ? { entityType: query.entityType } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      include: { actor: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}
