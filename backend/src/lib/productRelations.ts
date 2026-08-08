import { asc, inArray } from "drizzle-orm";
import { db } from "../db";
import { categories, packPriceTiers, productImages, productSizes, products } from "../db/schema";
import { groupBy, indexBy } from "./batchLoad";

type ProductRow = typeof products.$inferSelect;

// Batch-loads images/sizes/packTiers/category for a page of products —
// replaces Drizzle's relational with:{} API, which generates LEFT JOIN
// LATERAL SQL that production's MariaDB doesn't support.
export async function attachProductRelations(rows: ProductRow[]) {
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
