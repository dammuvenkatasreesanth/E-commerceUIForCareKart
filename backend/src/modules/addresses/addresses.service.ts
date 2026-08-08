import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { addresses } from "../../db/schema";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import type { createAddressSchema, updateAddressSchema } from "./addresses.schema";
import type { z } from "zod";

type CreateAddressInput = z.infer<typeof createAddressSchema>;
type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

export async function listAddresses(userId: number) {
  return db.query.addresses.findMany({
    where: eq(addresses.userId, userId),
    orderBy: [desc(addresses.isDefault), desc(addresses.createdAt)],
  });
}

async function assertOwnedAddress(userId: number, addressId: number) {
  const address = await db.query.addresses.findFirst({ where: eq(addresses.id, addressId) });
  if (!address) throw new NotFoundError("Address not found");
  if (address.userId !== userId) throw new ForbiddenError("This address does not belong to you");
  return address;
}

export async function createAddress(userId: number, input: CreateAddressInput) {
  return db.transaction(async (tx) => {
    const existing = await tx.query.addresses.findMany({ where: eq(addresses.userId, userId), columns: { id: true } });
    const makeDefault = input.isDefault || existing.length === 0;

    if (makeDefault) {
      await tx.update(addresses).set({ isDefault: false, updatedAt: new Date() }).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
    }

    const [{ id }] = await tx.insert(addresses).values({ ...input, userId, isDefault: makeDefault, updatedAt: new Date() }).$returningId();
    const created = await tx.query.addresses.findFirst({ where: eq(addresses.id, id) });
    if (!created) throw new NotFoundError("Address not found");
    return created;
  });
}

export async function updateAddress(userId: number, addressId: number, input: UpdateAddressInput) {
  await assertOwnedAddress(userId, addressId);

  return db.transaction(async (tx) => {
    if (input.isDefault) {
      await tx.update(addresses).set({ isDefault: false, updatedAt: new Date() }).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
    }
    await tx.update(addresses).set({ ...input, updatedAt: new Date() }).where(eq(addresses.id, addressId));
    const updated = await tx.query.addresses.findFirst({ where: eq(addresses.id, addressId) });
    if (!updated) throw new NotFoundError("Address not found");
    return updated;
  });
}

export async function deleteAddress(userId: number, addressId: number) {
  const address = await assertOwnedAddress(userId, addressId);

  await db.delete(addresses).where(eq(addresses.id, addressId));

  if (address.isDefault) {
    const next = await db.query.addresses.findFirst({ where: eq(addresses.userId, userId), orderBy: [asc(addresses.createdAt)] });
    if (next) {
      await db.update(addresses).set({ isDefault: true, updatedAt: new Date() }).where(eq(addresses.id, next.id));
    }
  }
}

export async function setDefaultAddress(userId: number, addressId: number) {
  await assertOwnedAddress(userId, addressId);

  return db.transaction(async (tx) => {
    await tx.update(addresses).set({ isDefault: false, updatedAt: new Date() }).where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
    await tx.update(addresses).set({ isDefault: true, updatedAt: new Date() }).where(eq(addresses.id, addressId));
    const updated = await tx.query.addresses.findFirst({ where: eq(addresses.id, addressId) });
    if (!updated) throw new NotFoundError("Address not found");
    return updated;
  });
}
