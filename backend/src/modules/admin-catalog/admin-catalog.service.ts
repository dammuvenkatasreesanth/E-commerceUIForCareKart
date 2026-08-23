import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { and, asc, count, eq, inArray, like, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { categories, packPriceTiers, productImages, productSizes, products } from "../../db/schema";
import { slugify } from "../../lib/slugify";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { attachProductRelations } from "../../lib/productRelations";
import { groupBy, indexBy } from "../../lib/batchLoad";

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
    const existing = await db.query.products.findFirst({ where: eq(products.slug, slug) });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

// Drizzle's .set() writes every key present in the object, even if the value
// is undefined (unlike Prisma, which treats undefined as "leave unchanged").
// This filters those out so a partial update only touches the fields the
// caller actually supplied.
function definedEntries<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (result as Record<string, unknown>)[k] = v;
  }
  return result;
}

export async function listProducts(query: { q?: string; category?: string; includeInactive: boolean; page: number; limit: number }) {
  const conditions: SQL[] = [];
  if (!query.includeInactive) conditions.push(eq(products.isActive, true));
  if (query.q) conditions.push(like(products.name, `%${query.q}%`));
  if (query.category) {
    const category = await db.query.categories.findFirst({ where: eq(categories.slug, query.category) });
    conditions.push(eq(products.categoryId, category?.id ?? -1));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ value: total }]] = await Promise.all([
    db.query.products.findMany({
      where,
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
    }),
    db.select({ value: count() }).from(products).where(where),
  ]);
  const items = await attachProductRelations(rows);

  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getProduct(id: number) {
  const row = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!row) throw new NotFoundError("Product not found");
  const [product] = await attachProductRelations([row]);
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
  weightGrams?: number;
  sizes: string[];
  packTiers?: PackTierInput[];
}

export async function createProduct(input: ProductInput) {
  const category = await db.query.categories.findFirst({ where: eq(categories.id, input.categoryId) });
  if (!category) throw new BadRequestError("Category not found");

  const slug = await uniqueSlug(input.name);
  const tiers = input.packTiers && input.packTiers.length > 0 ? input.packTiers : DEFAULT_PACK_TIERS;

  const productId = await db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(products)
      .values({
        slug,
        name: input.name,
        tagline: input.tagline,
        description: input.description,
        categoryId: input.categoryId,
        price: String(input.price),
        mrp: String(input.mrp),
        material: input.material,
        badge: input.badge,
        videoUrl: input.videoUrl,
        features: input.features ?? [],
        specs: input.specs ?? {},
        moq: input.moq,
        gstRate: String(input.gstRate),
        hsnCode: input.hsnCode,
        weightGrams: input.weightGrams,
        updatedAt: new Date(),
      })
      .$returningId();

    await tx.insert(productSizes).values(input.sizes.map((size, i) => ({ productId: id, size, sortOrder: i })));
    await tx.insert(packPriceTiers).values(tiers.map((t) => ({ productId: id, tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: String(t.discountPct), tag: t.tag ?? null })));

    return id;
  });

  return getProduct(productId);
}

export async function updateProduct(id: number, input: Partial<ProductInput> & { isActive?: boolean; inStock?: boolean }) {
  const existingRow = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!existingRow) throw new NotFoundError("Product not found");
  const existingSizes = await db.select().from(productSizes).where(eq(productSizes.productId, id)).orderBy(asc(productSizes.sortOrder));
  const existing = { ...existingRow, sizes: existingSizes };

  if (input.categoryId) {
    const category = await db.query.categories.findFirst({ where: eq(categories.id, input.categoryId) });
    if (!category) throw new BadRequestError("Category not found");
  }

  const data: Record<string, unknown> = definedEntries({
    tagline: input.tagline,
    description: input.description,
    categoryId: input.categoryId,
    material: input.material,
    badge: input.badge,
    videoUrl: input.videoUrl,
    features: input.features,
    specs: input.specs,
    moq: input.moq,
    gstRate: input.gstRate !== undefined ? String(input.gstRate) : undefined,
    hsnCode: input.hsnCode,
    weightGrams: input.weightGrams,
    isActive: input.isActive,
    inStock: input.inStock,
    price: input.price !== undefined ? String(input.price) : undefined,
    mrp: input.mrp !== undefined ? String(input.mrp) : undefined,
  });
  if (input.name && input.name !== existing.name) {
    data.name = input.name;
    data.slug = await uniqueSlug(input.name, id);
  }
  data.updatedAt = new Date();

  await db.update(products).set(data).where(eq(products.id, id));

  if (input.sizes) {
    const existingLabels = new Set(existing.sizes.map((s) => s.size));
    const newLabels = new Set(input.sizes);

    const toCreate = input.sizes.filter((s) => !existingLabels.has(s));
    const toDelete = existing.sizes.filter((s) => !newLabels.has(s.size));

    await db.transaction(async (tx) => {
      for (const s of toDelete) {
        await tx.delete(productSizes).where(eq(productSizes.id, s.id));
      }
      if (toCreate.length > 0) {
        await tx.insert(productSizes).values(toCreate.map((size, i) => ({ productId: id, size, sortOrder: existing.sizes.length + i })));
      }
    });
  }

  return getProduct(id);
}

export async function setPackTiers(id: number, tiers: PackTierInput[]) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) throw new NotFoundError("Product not found");

  await db.transaction(async (tx) => {
    for (const t of tiers) {
      await tx
        .insert(packPriceTiers)
        .values({ productId: id, tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: String(t.discountPct), tag: t.tag ?? null })
        .onDuplicateKeyUpdate({ set: { label: t.label, packQty: t.packQty, discountPct: String(t.discountPct), tag: t.tag ?? null } });
    }
  });

  return getProduct(id);
}

export async function addProductImage(id: number, url: string) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) throw new NotFoundError("Product not found");
  const [{ value: imageCount }] = await db.select({ value: count() }).from(productImages).where(eq(productImages.productId, id));
  const [{ id: imageId }] = await db.insert(productImages).values({ productId: id, url, sortOrder: imageCount }).$returningId();
  const created = await db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
  if (!created) throw new NotFoundError("Image not found");
  return created;
}

export async function removeProductImage(id: number, imageId: number) {
  const image = await db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
  if (!image || image.productId !== id) throw new NotFoundError("Image not found");
  await db.delete(productImages).where(eq(productImages.id, imageId));
}

// ── Categories ─────────────────────────────────────────────────────────

export async function listCategoriesAdmin() {
  return db.query.categories.findMany({ orderBy: [asc(categories.sortOrder)] });
}

export async function createCategory(input: { name: string; parentId?: number; imageUrl?: string; showOnHomepage: boolean; sortOrder: number }) {
  const slug = await (async () => {
    const base = slugify(input.name);
    let s = base;
    let i = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await db.query.categories.findFirst({ where: eq(categories.slug, s) });
      if (!existing) return s;
      s = `${base}-${i}`;
      i += 1;
    }
  })();

  const [{ id }] = await db
    .insert(categories)
    .values({ name: input.name, slug, parentId: input.parentId, imageUrl: input.imageUrl, showOnHomepage: input.showOnHomepage, sortOrder: input.sortOrder, updatedAt: new Date() })
    .$returningId();
  const created = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!created) throw new NotFoundError("Category not found");
  return created;
}

export async function updateCategory(id: number, input: Partial<{ name: string; parentId: number; imageUrl: string; showOnHomepage: boolean; sortOrder: number; isActive: boolean }>) {
  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) throw new NotFoundError("Category not found");
  await db.update(categories).set({ ...definedEntries(input), updatedAt: new Date() }).where(eq(categories.id, id));
  const updated = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!updated) throw new NotFoundError("Category not found");
  return updated;
}

export async function deleteCategory(id: number) {
  const [{ value: productCount }] = await db.select({ value: count() }).from(products).where(eq(products.categoryId, id));
  if (productCount > 0) throw new BadRequestError("Cannot delete a category that still has products. Reassign them first.");
  await db.delete(categories).where(eq(categories.id, id));
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
  weightGrams?: string;
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
      let category = await db.query.categories.findFirst({ where: eq(categories.slug, categorySlug) });
      if (!category) {
        const [{ id }] = await db.insert(categories).values({ name: row.category, slug: categorySlug, updatedAt: new Date() }).$returningId();
        category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
      }
      if (!category) throw new Error("Failed to resolve category");

      const sizes = row.sizes ? row.sizes.split(";").map((s) => s.trim()).filter(Boolean) : ["Universal"];
      const features = row.features ? row.features.split(";").map((s) => s.trim()).filter(Boolean) : [];

      const existing = await db.query.products.findFirst({ where: and(eq(products.name, row.name), eq(products.categoryId, category.id)) });

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
          weightGrams: row.weightGrams ? Number(row.weightGrams) : undefined,
          sizes,
          inStock: row.inStock ? row.inStock.toLowerCase() === "true" : undefined,
        });
        updated += 1;
      } else {
        const slug = await uniqueSlug(row.name);
        await db.transaction(async (tx) => {
          const [{ id }] = await tx
            .insert(products)
            .values({
              slug,
              name: row.name,
              tagline: row.tagline,
              description: row.description ?? row.name,
              categoryId: category!.id,
              price: String(Number(row.price)),
              mrp: String(Number(row.mrp)),
              material: row.material,
              badge: row.badge,
              moq: row.moq ? Number(row.moq) : 1,
              gstRate: row.gstRate ? String(Number(row.gstRate)) : "18.00",
              hsnCode: row.hsnCode,
              weightGrams: row.weightGrams ? Number(row.weightGrams) : undefined,
              features,
              inStock: row.inStock ? row.inStock.toLowerCase() === "true" : true,
              updatedAt: new Date(),
            })
            .$returningId();

          await tx.insert(productSizes).values(sizes.map((size, i) => ({ productId: id, size, sortOrder: i })));
          await tx.insert(packPriceTiers).values(DEFAULT_PACK_TIERS.map((t) => ({ productId: id, tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: String(t.discountPct), tag: t.tag ?? null })));
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
  const rows = await db.query.products.findMany({ orderBy: [asc(products.id)] });
  if (rows.length === 0) return stringify([], { header: true });

  const productIds = rows.map((p) => p.id);
  const categoryIds = [...new Set(rows.map((p) => p.categoryId))];
  const [sizes, cats] = await Promise.all([
    db.select().from(productSizes).where(inArray(productSizes.productId, productIds)).orderBy(asc(productSizes.sortOrder)),
    db.select().from(categories).where(inArray(categories.id, categoryIds)),
  ]);
  const sizesByProduct = groupBy(sizes, (s) => s.productId);
  const categoryById = indexBy(cats, (c) => c.id);
  const items = rows.map((p) => ({ ...p, category: categoryById.get(p.categoryId)!, sizes: sizesByProduct.get(p.id) ?? [] }));

  const csvRows = items.map((p) => ({
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
    weightGrams: p.weightGrams ?? "",
    sizes: p.sizes.map((s) => s.size).join(";"),
    inStock: p.inStock,
    isActive: p.isActive,
  }));

  return stringify(csvRows, { header: true });
}
