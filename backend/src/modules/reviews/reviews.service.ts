import { and, avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { orderItems, orders, products, reviews, users } from "../../db/schema";
import { BadRequestError, ConflictError, NotFoundError } from "../../lib/errors";

interface CreateReviewInput {
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  body: string;
}

async function isVerifiedPurchase(userId: number, productId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(and(eq(orderItems.productId, productId), eq(orders.userId, userId), eq(orders.status, "DELIVERED")))
    .limit(1);
  return !!row;
}

export async function createReview(userId: number, input: CreateReviewInput) {
  const product = await db.query.products.findFirst({ where: eq(products.id, input.productId) });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  const existing = await db.query.reviews.findFirst({ where: and(eq(reviews.productId, input.productId), eq(reviews.userId, userId)) });
  if (existing) throw new ConflictError("You have already reviewed this product");

  if (input.orderId) {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, input.orderId) });
    if (!order || order.userId !== userId) throw new BadRequestError("Invalid order reference");
  }

  const verified = await isVerifiedPurchase(userId, input.productId);

  const reviewId = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(reviews)
      .values({
        productId: input.productId,
        userId,
        orderId: input.orderId,
        rating: input.rating,
        title: input.title,
        body: input.body,
        isVerifiedPurchase: verified,
        status: "APPROVED",
      })
      .$returningId();

    const [agg] = await tx
      .select({ avgRating: avg(reviews.rating), count: count() })
      .from(reviews)
      .where(and(eq(reviews.productId, input.productId), eq(reviews.status, "APPROVED")));

    await tx
      .update(products)
      .set({ ratingAvg: agg.avgRating ?? "0", ratingCount: agg.count, updatedAt: new Date() })
      .where(eq(products.id, input.productId));

    return id;
  });

  const created = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) });
  if (!created) throw new NotFoundError("Review not found");
  return created;
}

export async function listReviewsForProduct(productId: number, page: number, limit: number) {
  const where = and(eq(reviews.productId, productId), eq(reviews.status, "APPROVED"));

  // A plain LEFT JOIN (not Drizzle's relational with: API, which generates
  // LEFT JOIN LATERAL — unsupported on production's MariaDB) is fine here
  // since it's a single flat "one" lookup, not a nested "many" collection.
  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        isVerifiedPurchase: reviews.isVerifiedPurchase,
        helpfulCount: reviews.helpfulCount,
        createdAt: reviews.createdAt,
        authorName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(where)
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ value: count() }).from(reviews).where(where),
  ]);

  return {
    items: rows.map((r) => ({ ...r, authorName: r.authorName ?? "Anonymous" })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function markHelpful(reviewId: number) {
  const review = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) });
  if (!review) throw new NotFoundError("Review not found");
  await db.update(reviews).set({ helpfulCount: sql`${reviews.helpfulCount} + 1` }).where(eq(reviews.id, reviewId));
  const updated = await db.query.reviews.findFirst({ where: eq(reviews.id, reviewId) });
  if (!updated) throw new NotFoundError("Review not found");
  return updated;
}
