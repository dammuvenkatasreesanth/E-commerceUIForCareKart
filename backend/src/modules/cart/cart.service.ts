import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { cartItems, productImages, productSizes, packPriceTiers, products } from "../../db/schema";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { tierUnitPrice, computeShipping } from "../../lib/pricing";
import { groupBy, indexBy } from "../../lib/batchLoad";

function serializeCart(items: Awaited<ReturnType<typeof fetchRawCart>>) {
  const serializedItems = items.map((item) => {
    const tier = item.product.packTiers.find((t) => t.tierIndex === item.tierIndex);
    const packQty = tier?.packQty ?? 1;
    const discountPct = tier?.discountPct ?? 0;
    const unitPrice = tierUnitPrice(item.product.price, discountPct);
    const lineTotal = unitPrice * packQty * item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.images[0]?.url ?? null,
      sizeLabel: item.sizeLabel,
      tierIndex: item.tierIndex,
      tierLabel: tier?.label ?? "Single Unit",
      packQty,
      quantity: item.quantity,
      unitPrice,
      totalUnits: packQty * item.quantity,
      lineTotal,
      inStock: item.product.inStock && item.product.isActive,
    };
  });

  const subtotal = serializedItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = serializedItems.length > 0 ? computeShipping(subtotal) : 0;

  return {
    items: serializedItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

// MariaDB (Hostinger's production MySQL) doesn't support the LEFT JOIN LATERAL
// SQL that Drizzle's relational `with:` API generates, so product + images +
// packTiers are batch-loaded with plain WHERE IN queries and attached in JS.
async function fetchRawCart(userId: number) {
  const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId)).orderBy(asc(cartItems.createdAt));
  if (items.length === 0) return [];

  const productIds = [...new Set(items.map((i) => i.productId))];
  const [prods, images, tiers] = await Promise.all([
    db.select().from(products).where(inArray(products.id, productIds)),
    db.select().from(productImages).where(inArray(productImages.productId, productIds)).orderBy(asc(productImages.sortOrder)),
    db.select().from(packPriceTiers).where(inArray(packPriceTiers.productId, productIds)).orderBy(asc(packPriceTiers.tierIndex)),
  ]);

  const productById = indexBy(prods, (p) => p.id);
  const imagesByProduct = groupBy(images, (i) => i.productId);
  const tiersByProduct = groupBy(tiers, (t) => t.productId);

  return items.map((item) => ({
    ...item,
    product: {
      ...productById.get(item.productId)!,
      images: imagesByProduct.get(item.productId) ?? [],
      packTiers: tiersByProduct.get(item.productId) ?? [],
    },
  }));
}

export const getRawCartItems = fetchRawCart;

export async function getCart(userId: number) {
  const items = await fetchRawCart(userId);
  return serializeCart(items);
}

interface QuoteLineInput {
  productId: number;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
}

// Public, no-auth pricing for a guest's client-side (localStorage) cart — never
// trust a client-computed total, so re-derive it server-side the same way
// serializeCart() does for a real authenticated CartItem-backed cart. Stale/
// invalid lines (deleted product, retired size/tier) are flagged rather than
// thrown, matching the reorder()/addItem() "skip and report" UX pattern.
export async function quoteCart(items: QuoteLineInput[]) {
  const results = await Promise.all(
    items.map(async (line) => {
      const [product] = await db.select().from(products).where(eq(products.id, line.productId)).limit(1);

      if (!product || !product.isActive) {
        return { ...line, valid: false as const, reason: "This product is no longer available" };
      }

      const [images, sizes, tiers] = await Promise.all([
        db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(asc(productImages.sortOrder)),
        db.select().from(productSizes).where(eq(productSizes.productId, product.id)),
        db.select().from(packPriceTiers).where(eq(packPriceTiers.productId, product.id)),
      ]);

      if (!sizes.some((s) => s.size === line.sizeLabel)) {
        return { ...line, valid: false as const, reason: "This size is no longer available" };
      }
      const tier = tiers.find((t) => t.tierIndex === line.tierIndex);
      if (!tier) {
        return { ...line, valid: false as const, reason: "This pack option is no longer available" };
      }
      if (!product.inStock) {
        return { ...line, valid: false as const, reason: "Out of stock" };
      }

      const unitPrice = tierUnitPrice(product.price, tier.discountPct);
      const lineTotal = unitPrice * tier.packQty * line.quantity;

      return {
        valid: true as const,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: images[0]?.url ?? null,
        sizeLabel: line.sizeLabel,
        tierIndex: line.tierIndex,
        tierLabel: tier.label,
        packQty: tier.packQty,
        quantity: line.quantity,
        unitPrice,
        totalUnits: tier.packQty * line.quantity,
        lineTotal,
        inStock: true,
      };
    }),
  );

  const validItems = results.filter((r): r is Extract<typeof r, { valid: true }> => r.valid);
  const invalidItems = results.filter((r) => !r.valid);
  const subtotal = validItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = validItems.length > 0 ? computeShipping(subtotal) : 0;

  return {
    items: validItems.map((i, idx) => ({ id: -(idx + 1), ...i })),
    invalidItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

interface AddItemInput {
  productId: number;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
}

export async function addItem(userId: number, input: AddItemInput) {
  const [product] = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
  if (!product || !product.isActive) throw new NotFoundError("Product not found");

  const [sizes, tiers] = await Promise.all([
    db.select().from(productSizes).where(eq(productSizes.productId, input.productId)),
    db.select().from(packPriceTiers).where(eq(packPriceTiers.productId, input.productId)),
  ]);
  if (!sizes.some((s) => s.size === input.sizeLabel)) {
    throw new BadRequestError("Selected size is not available for this product");
  }
  if (!tiers.some((t) => t.tierIndex === input.tierIndex)) {
    throw new BadRequestError("Selected pack tier is not available for this product");
  }

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.userId, userId),
      eq(cartItems.productId, input.productId),
      eq(cartItems.sizeLabel, input.sizeLabel),
      eq(cartItems.tierIndex, input.tierIndex),
    ),
  });

  if (existing) {
    await db.update(cartItems).set({ quantity: existing.quantity + input.quantity, updatedAt: new Date() }).where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      userId,
      productId: input.productId,
      sizeLabel: input.sizeLabel,
      tierIndex: input.tierIndex,
      quantity: input.quantity,
      updatedAt: new Date(),
    });
  }

  return getCart(userId);
}

export async function updateItemQuantity(userId: number, itemId: number, quantity: number) {
  const item = await db.query.cartItems.findFirst({ where: eq(cartItems.id, itemId) });
  if (!item) throw new NotFoundError("Cart item not found");
  if (item.userId !== userId) throw new ForbiddenError("This cart item does not belong to you");

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(eq(cartItems.id, itemId));
  }

  return getCart(userId);
}

export async function removeItem(userId: number, itemId: number) {
  const item = await db.query.cartItems.findFirst({ where: eq(cartItems.id, itemId) });
  if (!item) throw new NotFoundError("Cart item not found");
  if (item.userId !== userId) throw new ForbiddenError("This cart item does not belong to you");

  await db.delete(cartItems).where(eq(cartItems.id, itemId));
  return getCart(userId);
}

export async function clearCart(userId: number) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}
