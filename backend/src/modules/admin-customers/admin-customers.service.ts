import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import type { Prisma, AccountType, GstStatus, UserStatus } from "@prisma/client";

interface ListCustomersQuery {
  q?: string;
  accountType?: AccountType;
  gstStatus?: GstStatus;
  page: number;
  limit: number;
}

export async function listCustomers(query: ListCustomersQuery) {
  const where: Prisma.UserWhereInput = { role: "CUSTOMER" };
  if (query.accountType) where.accountType = query.accountType;
  if (query.gstStatus) where.gstStatus = query.gstStatus;
  if (query.q) {
    where.OR = [
      { name: { contains: query.q } },
      { phone: { contains: query.q } },
      { email: { contains: query.q } },
      { gstin: { contains: query.q } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        accountType: true,
        gstin: true,
        gstStatus: true,
        status: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getCustomer(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { orderBy: { createdAt: "desc" }, take: 10, include: { items: true } },
    },
  });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  return user;
}

export async function decideGstApproval(id: number, decision: GstStatus) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  if (user.gstStatus !== "PENDING") throw new BadRequestError("This customer has no pending GST approval request");

  return prisma.user.update({ where: { id }, data: { gstStatus: decision } });
}

export async function setCustomerStatus(id: number, status: UserStatus) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "CUSTOMER") throw new NotFoundError("Customer not found");
  return prisma.user.update({ where: { id }, data: { status } });
}
