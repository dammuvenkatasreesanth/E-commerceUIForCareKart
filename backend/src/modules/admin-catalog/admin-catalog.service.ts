import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { prisma } from "../../lib/prisma";
import { slugify } from "../../lib/slugify";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import type { Prisma } from "@prisma/client";

interface PackTierInput {
  tierIndex: number;
  label: string;
  packQty: number;
  discountPct: number;
  tag?: string;
}

const DEFAULT_PACK_TIERS: PackTierInput[] = [
  { tierIndex: 0, label: "Single Unit", packQty: 1, discountPct: 0 },
  { tierIndex: 1, label: "Box · 100 units", packQty: 100, discountPct: 5 },
  { tierIndex: 2, label: "Box · 500 units", packQty: 500, discountPct: 12 },
  { tierIndex: 3, label: "Pallet · 1000+", packQty: 1000, discountPct: 20 },
];

async function uniqueSlug(name: string, excludeId?: number): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

const productInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  sizes: { orderBy: { sortOrder: "asc" as const } },
  packTiers: { orderBy: { tierIndex: "asc" as const } },
  category: true,
} satisfies Prisma.ProductInclude;

export async function listProducts(query: { q?: string; category?: string; includeInactive: boolean; page: number; limit: number }) {
  const where: Prisma.ProductWhereInput = {};
  if (!query.includeInactive) where.isActive = true;
  if (query.q) where.name = { contains: query.q };
  if (query.category) {
    const category = await prisma.category.findUnique({ where: { slug: query.category } });
    where.categoryId = category?.id ?? -1;
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProduct(id: number) {
  const product = await prisma.product.findUnique({ where: { id }, include: productInclude });
  if (!product) throw new NotFoundError("Product not found");
  return product;
}

interface ProductInput {
  name: string;
  tagline?: string;
  description: string;
  categoryId: number;
  price: number;
  mrp: number;
  material?: string;
  badge?: string;
  videoUrl?: string;
  features?: string[];
  specs?: Record<string, string>;
  moq: number;
  gstRate: number;
  hsnCode?: string;
  sizes: string[];
  packTiers?: PackTierInput[];
}

export async function createProduct(input: ProductInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new BadRequestError("Category not found");

  const slug = await uniqueSlug(input.name);
  const tiers = input.packTiers && input.packTiers.length > 0 ? input.packTiers : DEFAULT_PACK_TIERS;

  return prisma.product.create({
    data: {
      slug,
      name: input.name,
      tagline: input.tagline,
      description: input.description,
      categoryId: input.categoryId,
      price: input.price,
      mrp: input.mrp,
      material: input.material,
      badge: input.badge,
      videoUrl: input.videoUrl,
      features: input.features ?? [],
      specs: input.specs ?? {},
      moq: input.moq,
      gstRate: input.gstRate,
      hsnCode: input.hsnCode,
      sizes: { create: input.sizes.map((size, i) => ({ size, sortOrder: i })) },
      packTiers: { create: tiers.map((t) => ({ ...t, tag: t.tag ?? null })) },
    },
    include: productInclude,
  });
}

export async function updateProduct(id: number, input: Partial<ProductInput> & { isActive?: boolean; inStock?: boolean }) {
  const existing = await prisma.product.findUnique({ where: { id }, include: { sizes: true } });
  if (!existing) throw new NotFoundError("Product not found");

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) throw new BadRequestError("Category not found");
  }

  const data: Prisma.ProductUpdateInput = {
    tagline: input.tagline,
    description: input.description,
    material: input.material,
    badge: input.badge,
    videoUrl: input.videoUrl,
    features: input.features,
    specs: input.specs,
    moq: input.moq,
    gstRate: input.gstRate,
    hsnCode: input.hsnCode,
    isActive: input.isActive,
    inStock: input.inStock,
  };
  if (input.price !== undefined) data.price = input.price;
  if (input.mrp !== undefined) data.mrp = input.mrp;
  if (input.categoryId !== undefined) data.category = { connect: { id: input.categoryId } };
  if (input.name && input.name !== existing.name) {
    data.name = input.name;
    data.slug = await uniqueSlug(input.name, id);
  }

  await prisma.product.update({ where: { id }, data });

  if (input.sizes) {
    const existingLabels = new Set(existing.sizes.map((s) => s.size));
    const newLabels = new Set(input.sizes);

    const toCreate = input.sizes.filter((s) => !existingLabels.has(s));
    const toDelete = existing.sizes.filter((s) => !newLabels.has(s.size));

    await prisma.$transaction([
      ...toDelete.map((s) => prisma.productSize.delete({ where: { id: s.id } })),
      ...toCreate.map((size, i) => prisma.productSize.create({ data: { productId: id, size, sortOrder: existing.sizes.length + i } })),
    ]);
  }

  return getProduct(id);
}

export async function setPackTiers(id: number, tiers: PackTierInput[]) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError("Product not found");

  await prisma.$transaction(
    tiers.map((t) =>
      prisma.packPriceTier.upsert({
        where: { productId_tierIndex: { productId: id, tierIndex: t.tierIndex } },
        update: { label: t.label, packQty: t.packQty, discountPct: t.discountPct, tag: t.tag ?? null },
        create: { productId: id, tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: t.discountPct, tag: t.tag ?? null },
      }),
    ),
  );

  return getProduct(id);
}

export async function addProductImage(id: number, url: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new NotFoundError("Product not found");
  const count = await prisma.productImage.count({ where: { productId: id } });
  return prisma.productImage.create({ data: { productId: id, url, sortOrder: count } });
}

export async function removeProductImage(id: number, imageId: number) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image || image.productId !== id) throw new NotFoundError("Image not found");
  await prisma.productImage.delete({ where: { id: imageId } });
}

// ── Categories ─────────────────────────────────────────────────────────

export async function listCategoriesAdmin() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createCategory(input: { name: string; parentId?: number; imageUrl?: string; showOnHomepage: boolean; sortOrder: number }) {
  const slug = await (async () => {
    const base = slugify(input.name);
    let s = base;
    let i = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await prisma.category.findUnique({ where: { slug: s } });
      if (!existing) return s;
      s = `${base}-${i}`;
      i += 1;
    }
  })();

  return prisma.category.create({
    data: { name: input.name, slug, parentId: input.parentId, imageUrl: input.imageUrl, showOnHomepage: input.showOnHomepage, sortOrder: input.sortOrder },
  });
}

export async function updateCategory(id: number, input: Partial<{ name: string; parentId: number; imageUrl: string; showOnHomepage: boolean; sortOrder: number; isActive: boolean }>) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new NotFoundError("Category not found");
  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteCategory(id: number) {
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) throw new BadRequestError("Cannot delete a category that still has products. Reassign them first.");
  await prisma.category.delete({ where: { id } });
}

// ── CSV import/export ────────────────────────────────────────────────────

interface CsvRow {
  name: string;
  category: string;
  price: string;
  mrp: string;
  description?: string;
  tagline?: string;
  material?: string;
  badge?: string;
  moq?: string;
  gstRate?: string;
  hsnCode?: string;
  sizes?: string;
  features?: string;
  inStock?: string;
}

export async function importProductsCsv(fileBuffer: Buffer): Promise<{ created: number; updated: number; errors: string[] }> {
  const rows = parse(fileBuffer, { columns: true, skip_empty_lines: true, trim: true }) as CsvRow[];

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const [index, row] of rows.entries()) {
    try {
      if (!row.name || !row.category || !row.price || !row.mrp) {
        throw new Error("Missing required column (name, category, price, mrp)");
      }

      const categorySlug = slugify(row.category);
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: row.category, slug: categorySlug },
      });

      const sizes = row.sizes ? row.sizes.split(";").map((s) => s.trim()).filter(Boolean) : ["Universal"];
      const features = row.features ? row.features.split(";").map((s) => s.trim()).filter(Boolean) : [];
      const slug = await uniqueSlug(row.name);

      const existing = await prisma.product.findFirst({ where: { name: row.name, categoryId: category.id } });

      if (existing) {
        await updateProduct(existing.id, {
          price: Number(row.price),
          mrp: Number(row.mrp),
          description: row.description ?? existing.description,
          tagline: row.tagline,
          material: row.material,
          badge: row.badge,
          moq: row.moq ? Number(row.moq) : undefined,
          gstRate: row.gstRate ? Number(row.gstRate) : undefined,
          hsnCode: row.hsnCode,
          sizes,
          inStock: row.inStock ? row.inStock.toLowerCase() === "true" : undefined,
        });
        updated += 1;
      } else {
        await prisma.product.create({
          data: {
            slug,
            name: row.name,
            tagline: row.tagline,
            description: row.description ?? row.name,
            categoryId: category.id,
            price: Number(row.price),
            mrp: Number(row.mrp),
            material: row.material,
            badge: row.badge,
            moq: row.moq ? Number(row.moq) : 1,
            gstRate: row.gstRate ? Number(row.gstRate) : 18,
            hsnCode: row.hsnCode,
            features,
            inStock: row.inStock ? row.inStock.toLowerCase() === "true" : true,
            sizes: { create: sizes.map((size, i) => ({ size, sortOrder: i })) },
            packTiers: { create: DEFAULT_PACK_TIERS },
          },
        });
        created += 1;
      }
    } catch (err) {
      errors.push(`Row ${index + 2}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return { created, updated, errors };
}

export async function exportProductsCsv(): Promise<string> {
  const products = await prisma.product.findMany({
    include: { category: true, sizes: true },
    orderBy: { id: "asc" },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category.name,
    price: p.price.toString(),
    mrp: p.mrp.toString(),
    description: p.description,
    tagline: p.tagline ?? "",
    material: p.material ?? "",
    badge: p.badge ?? "",
    moq: p.moq,
    gstRate: p.gstRate.toString(),
    hsnCode: p.hsnCode ?? "",
    sizes: p.sizes.map((s) => s.size).join(";"),
    inStock: p.inStock,
    isActive: p.isActive,
  }));

  return stringify(rows, { header: true });
}
