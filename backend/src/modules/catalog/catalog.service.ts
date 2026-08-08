import { and, asc, count, desc, eq, gte, inArray, isNull, like, lte, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { banners, categories, packPriceTiers, productImages, productSizes, products, reviews, users } from "../../db/schema";
import { NotFoundError } from "../../lib/errors";
import { groupBy, indexBy } from "../../lib/batchLoad";
import type { listProductsQuerySchema } from "./catalog.schema";
import type { z } from "zod";

type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
type ProductRow = typeof products.$inferSelect;

async function attachProductRelations(rows: ProductRow[]) {
  if (rows.length === 0) return [];

  const productIds = rows.map((r) => r.id);
  const categoryIds = [...new Set(rows.map((r) => r.categoryId))];

  const [images, sizes, tiers, cats] = await Promise.all([
    db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.sortOrder)),
    db.select().from(productSizes).where(inArray(productSizes.productId, productIds)).orderBy(asc(productSizes.sortOrder)),
    db.select().from(packPriceTiers).where(inArray(packPriceTiers.productId, productIds)).orderBy(asc(packPriceTiers.tierIndex)),
    db.select().from(categories).where(inArray(categories.id, categoryIds)),
  ]);

  const imagesByProduct = groupBy(images, (i) => i.productId);
  const sizesByProduct = groupBy(sizes, (s) => s.productId);
  const tiersByProduct = groupBy(tiers, (t) => t.productId);
  const categoryById = indexBy(cats, (c) => c.id);

  return rows.map((r) => ({
    ...r,
    images: imagesByProduct.get(r.id) ?? [],
    sizes: sizesByProduct.get(r.id) ?? [],
    packTiers: tiersByProduct.get(r.id) ?? [],
    category: categoryById.get(r.categoryId)!,
  }));
}

function sortToOrderBy(sort: ListProductsQuery["sort"]) {
  switch (sort) {
    case "price_asc":
      return asc(products.price);
    case "price_desc":
      return desc(products.price);
    case "popularity":
      // No dedicated sales-count field yet; review volume is the best available proxy.
      return desc(products.ratingCount);
    case "rating":
      return desc(products.ratingAvg);
    case "newest":
    default:
      return desc(products.createdAt);
  }
}

export async function listProducts(query: ListProductsQuery) {
  const conditions: SQL[] = [eq(products.isActive, true)];

  if (query.category) {
    const category = await db.query.categories.findFirst({ where: eq(categories.slug, query.category) });
    conditions.push(eq(products.categoryId, category?.id ?? -1)); // unknown slug -> empty result set
  }
  if (query.q) {
    const term = `%${query.q}%`;
    conditions.push(or(like(products.name, term), like(products.tagline, term), like(products.description, term))!);
  }
  if (query.minPrice !== undefined) conditions.push(gte(products.price, String(query.minPrice)));
  if (query.maxPrice !== undefined) conditions.push(lte(products.price, String(query.maxPrice)));
  if (query.size) {
    conditions.push(
      inArray(
        products.id,
        db.select({ id: productSizes.productId }).from(productSizes).where(eq(productSizes.size, query.size)),
      ),
    );
  }
  if (query.inStock !== undefined) conditions.push(eq(products.inStock, query.inStock));

  const where = and(...conditions);

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(sortToOrderBy(query.sort))
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
    db.select({ value: count() }).from(products).where(where),
  ]);

  const items = await attachProductRelations(rows);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProductBySlug(slug: string) {
  const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!row || !row.isActive) throw new NotFoundError("Product not found");

  const [product] = await attachProductRelations([row]);

  const reviewRows = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, row.id), eq(reviews.status, "APPROVED")))
    .orderBy(desc(reviews.createdAt))
    .limit(10);

  const reviewUsers = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(inArray(users.id, [...new Set(reviewRows.map((r) => r.userId))]));
  const userNameById = indexBy(reviewUsers, (u) => u.id);

  return {
    ...product,
    reviews: reviewRows.map((r) => ({ ...r, user: { name: userNameById.get(r.userId)?.name ?? null } })),
  };
}

export async function listCategories() {
  return db.query.categories.findMany({ where: eq(categories.isActive, true), orderBy: [asc(categories.sortOrder)] });
}

export async function autosuggest(q: string, limit: number) {
  const rows = await db
    .select({ id: products.id, name: products.name, slug: products.slug })
    .from(products)
    .where(and(eq(products.isActive, true), like(products.name, `%${q}%`)))
    .limit(limit);

  if (rows.length === 0) return [];

  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, rows.map((r) => r.id)))
    .orderBy(asc(productImages.sortOrder));
  const firstImageByProduct = new Map<number, string>();
  for (const img of images) {
    if (!firstImageByProduct.has(img.productId)) firstImageByProduct.set(img.productId, img.url);
  }

  return rows.map((p) => ({ id: p.id, name: p.name, slug: p.slug, image: firstImageByProduct.get(p.id) ?? null }));
}

export async function listActiveBanners() {
  const now = new Date();
  return db.query.banners.findMany({
    where: and(
      eq(banners.isActive, true),
      or(isNull(banners.startsAt), lte(banners.startsAt, now)),
      or(isNull(banners.endsAt), gte(banners.endsAt, now)),
    ),
    orderBy: [asc(banners.sortOrder)],
  });
}
