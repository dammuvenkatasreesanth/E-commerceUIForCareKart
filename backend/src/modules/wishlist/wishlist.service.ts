import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { productImages, products, wishlistItems } from "../../db/schema";
import { NotFoundError } from "../../lib/errors";
import { groupBy, indexBy } from "../../lib/batchLoad";

export async function listWishlist(userId: number) {
  const items = await db.query.wishlistItems.findMany({
    where: eq(wishlistItems.userId, userId),
    orderBy: [desc(wishlistItems.createdAt)],
  });
  if (items.length === 0) return [];

  const productIds = [...new Set(items.map((i) => i.productId))];
  const [prods, images] = await Promise.all([
    db.select().from(products).where(inArray(products.id, productIds)),
    db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.sortOrder)),
  ]);
  const productById = indexBy(prods, (p) => p.id);
  const imagesByProduct = groupBy(images, (i) => i.productId);

  return items.map((item) => {
    const product = productById.get(item.productId)!;
    const productImage = imagesByProduct.get(item.productId) ?? [];
    return {
      id: item.id,
      productId: item.productId,
      name: product.name,
      slug: product.slug,
      image: productImage[0]?.url ?? null,
      price: product.price,
      mrp: product.mrp,
      inStock: product.inStock && product.isActive,
      addedAt: item.createdAt,
    };
  });
}

export async function addToWishlist(userId: number, productId: number) {
  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  const existing = await db.query.wishlistItems.findFirst({
    where: and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)),
  });
  if (!existing) {
    await db.insert(wishlistItems).values({ userId, productId });
  }

  return listWishlist(userId);
}

export async function removeFromWishlist(userId: number, productId: number) {
  await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
  return listWishlist(userId);
}
