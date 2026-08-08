import { and, asc, count, desc, eq, gte, inArray, isNull, like, lte, or, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { banners, categories, packPriceTiers, productImages, productSizes, products, reviews } from "../../db/schema";
import { NotFoundError } from "../../lib/errors";
import type { listProductsQuerySchema } from "./catalog.schema";
import type { z } from "zod";

type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

function productWith() {
  return {
    images: { orderBy: [asc(productImages.sortOrder)] },
    sizes: { orderBy: [asc(productSizes.sortOrder)] },
    packTiers: { orderBy: [asc(packPriceTiers.tierIndex)] },
    category: true as const,
  };
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

  const [items, [{ value: total }]] = await Promise.all([
    db.query.products.findMany({
      where,
      with: productWith(),
      orderBy: [sortToOrderBy(query.sort)],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(products).where(where),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      ...productWith(),
      reviews: {
        where: eq(reviews.status, "APPROVED"),
        orderBy: [desc(reviews.createdAt)],
        limit: 10,
        with: { user: { columns: { name: true } } },
      },
    },
  });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  return product;
}

export async function listCategories() {
  return db.query.categories.findMany({ where: eq(categories.isActive, true), orderBy: [asc(categories.sortOrder)] });
}

export async function autosuggest(q: string, limit: number) {
  const rows = await db.query.products.findMany({
    where: and(eq(products.isActive, true), like(products.name, `%${q}%`)),
    columns: { id: true, name: true, slug: true },
    with: { images: { limit: 1, orderBy: [asc(productImages.sortOrder)] } },
    limit,
  });
  return rows.map((p) => ({ id: p.id, name: p.name, slug: p.slug, image: p.images[0]?.url ?? null }));
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
