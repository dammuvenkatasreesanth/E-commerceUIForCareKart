import { asc, eq } from "drizzle-orm";
import { db } from "../../db";
import { shippingBoxSizes } from "../../db/schema";
import { ConflictError, NotFoundError } from "../../lib/errors";

interface BoxSizeInput {
  boxCount: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export async function listBoxSizes() {
  return db.select().from(shippingBoxSizes).orderBy(asc(shippingBoxSizes.boxCount));
}

async function assertUniqueBoxCount(boxCount: number, excludeId?: number) {
  const existing = await db.query.shippingBoxSizes.findFirst({ where: eq(shippingBoxSizes.boxCount, boxCount) });
  if (existing && existing.id !== excludeId) throw new ConflictError(`A box size for ${boxCount} boxes already exists`);
}

export async function createBoxSize(input: BoxSizeInput) {
  await assertUniqueBoxCount(input.boxCount);
  const [{ id }] = await db.insert(shippingBoxSizes).values({ ...input, updatedAt: new Date() }).$returningId();
  const created = await db.query.shippingBoxSizes.findFirst({ where: eq(shippingBoxSizes.id, id) });
  if (!created) throw new NotFoundError("Box size not found");
  return created;
}

export async function updateBoxSize(id: number, input: BoxSizeInput) {
  const existing = await db.query.shippingBoxSizes.findFirst({ where: eq(shippingBoxSizes.id, id) });
  if (!existing) throw new NotFoundError("Box size not found");
  await assertUniqueBoxCount(input.boxCount, id);

  await db.update(shippingBoxSizes).set({ ...input, updatedAt: new Date() }).where(eq(shippingBoxSizes.id, id));
  const updated = await db.query.shippingBoxSizes.findFirst({ where: eq(shippingBoxSizes.id, id) });
  if (!updated) throw new NotFoundError("Box size not found");
  return updated;
}

export async function deleteBoxSize(id: number) {
  const existing = await db.query.shippingBoxSizes.findFirst({ where: eq(shippingBoxSizes.id, id) });
  if (!existing) throw new NotFoundError("Box size not found");
  await db.delete(shippingBoxSizes).where(eq(shippingBoxSizes.id, id));
}
