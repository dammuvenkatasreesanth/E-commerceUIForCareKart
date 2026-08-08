import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { productImages, products, wishlistItems } from "../../db/schema";
import { NotFoundError } from "../../lib/errors";

export async function listWishlist(userId: number) {
  const items = await db.query.wishlistItems.findMany({
    where: eq(wishlistItems.userId, userId),
    orderBy: [desc(wishlistItems.createdAt)],
    with: {
      product: {
        with: { images: { limit: 1, orderBy: [asc(productImages.sortOrder)] } },
      },
    },
  });

  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    image: item.product.images[0]?.url ?? null,
    price: item.product.price,
    mrp: item.product.mrp,
    inStock: item.product.inStock && item.product.isActive,
    addedAt: item.createdAt,
  }));
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
