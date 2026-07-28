import { prisma } from "../../lib/prisma";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import type { Prisma } from "@prisma/client";

export async function listAddresses(userId: number) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

async function assertOwnedAddress(userId: number, addressId: number) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address) throw new NotFoundError("Address not found");
  if (address.userId !== userId) throw new ForbiddenError("This address does not belong to you");
  return address;
}

export async function createAddress(userId: number, input: Prisma.AddressUncheckedCreateInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { userId } });
    const makeDefault = input.isDefault || count === 0;

    if (makeDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    return tx.address.create({
      data: { ...input, userId, isDefault: makeDefault },
    });
  });
}

export async function updateAddress(userId: number, addressId: number, input: Partial<Prisma.AddressUncheckedCreateInput>) {
  await assertOwnedAddress(userId, addressId);

  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }
    return tx.address.update({ where: { id: addressId }, data: input });
  });
}

export async function deleteAddress(userId: number, addressId: number) {
  const address = await assertOwnedAddress(userId, addressId);

  await prisma.address.delete({ where: { id: addressId } });

  if (address.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }
}

export async function setDefaultAddress(userId: number, addressId: number) {
  await assertOwnedAddress(userId, addressId);

  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    return tx.address.update({ where: { id: addressId }, data: { isDefault: true } });
  });
}
