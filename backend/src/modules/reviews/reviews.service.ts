import { prisma } from "../../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../../lib/errors";

interface CreateReviewInput {
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  body: string;
}

async function isVerifiedPurchase(userId: number, productId: number): Promise<boolean> {
  const deliveredItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId, status: "DELIVERED" },
    },
  });
  return !!deliveredItem;
}

export async function createReview(userId: number, input: CreateReviewInput) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  const existing = await prisma.review.findFirst({ where: { productId: input.productId, userId } });
  if (existing) throw new ConflictError("You have already reviewed this product");

  if (input.orderId) {
    const order = await prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order || order.userId !== userId) throw new BadRequestError("Invalid order reference");
  }

  const verified = await isVerifiedPurchase(userId, input.productId);

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        productId: input.productId,
        userId,
        orderId: input.orderId,
        rating: input.rating,
        title: input.title,
        body: input.body,
        isVerifiedPurchase: verified,
        status: "APPROVED",
      },
    });

    const agg = await tx.review.aggregate({
      where: { productId: input.productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: true,
    });

    await tx.product.update({
      where: { id: input.productId },
      data: {
        ratingAvg: agg._avg.rating ?? 0,
        ratingCount: agg._count,
      },
    });

    return created;
  });

  return review;
}

export async function listReviewsForProduct(productId: number, page: number, limit: number) {
  const where = { productId, status: "APPROVED" as const };
  const [items, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    items: items.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isVerifiedPurchase: r.isVerifiedPurchase,
      helpfulCount: r.helpfulCount,
      authorName: r.user.name ?? "Anonymous",
      createdAt: r.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function markHelpful(reviewId: number) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new NotFoundError("Review not found");
  return prisma.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } });
}
