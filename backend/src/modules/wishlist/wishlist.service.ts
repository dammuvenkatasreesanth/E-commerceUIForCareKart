import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../lib/errors";

export async function listWishlist(userId: number) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
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
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });

  return listWishlist(userId);
}

export async function removeFromWishlist(userId: number, productId: number) {
  await prisma.wishlistItem.deleteMany({ where: { userId, productId } });
  return listWishlist(userId);
}
