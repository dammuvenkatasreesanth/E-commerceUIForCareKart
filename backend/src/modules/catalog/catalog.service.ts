import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../lib/errors";
import type { Prisma } from "@prisma/client";
import type { listProductsQuerySchema } from "./catalog.schema";
import type { z } from "zod";

type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

const productListInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  sizes: { orderBy: { sortOrder: "asc" as const } },
  packTiers: { orderBy: { tierIndex: "asc" as const } },
  category: true,
} satisfies Prisma.ProductInclude;

function sortToOrderBy(sort: ListProductsQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "popularity":
      // No dedicated sales-count field yet; review volume is the best available proxy.
      return { ratingCount: "desc" };
    case "rating":
      return { ratingAvg: "desc" };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

export async function listProducts(query: ListProductsQuery) {
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (query.category) {
    const category = await prisma.category.findUnique({ where: { slug: query.category } });
    if (category) where.categoryId = category.id;
    else where.categoryId = -1; // unknown category slug -> empty result set
  }
  if (query.q) {
    where.OR = [
      { name: { contains: query.q } },
      { tagline: { contains: query.q } },
      { description: { contains: query.q } },
    ];
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {
      ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
    };
  }
  if (query.size) {
    where.sizes = { some: { size: query.size } };
  }
  if (query.inStock !== undefined) {
    where.inStock = query.inStock;
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy: sortToOrderBy(query.sort),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productListInclude,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
    },
  });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  return product;
}

export async function listCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function autosuggest(q: string, limit: number) {
  const products = await prisma.product.findMany({
    where: { isActive: true, name: { contains: q } },
    select: { id: true, name: true, slug: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    take: limit,
  });
  return products.map((p) => ({ id: p.id, name: p.name, slug: p.slug, image: p.images[0]?.url ?? null }));
}

export async function listActiveBanners() {
  const now = new Date();
  return prisma.banner.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { sortOrder: "asc" },
  });
}
