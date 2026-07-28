import { prisma } from "../../lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { tierUnitPrice, computeShipping } from "../../lib/pricing";

const cartItemInclude = {
  product: {
    include: {
      images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
      packTiers: { orderBy: { tierIndex: "asc" as const } },
    },
  },
};

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

function fetchRawCart(userId: number) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: cartItemInclude,
    orderBy: { createdAt: "asc" },
  });
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
      const product = await prisma.product.findUnique({
        where: { id: line.productId },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          sizes: true,
          packTiers: true,
        },
      });

      if (!product || !product.isActive) {
        return { ...line, valid: false as const, reason: "This product is no longer available" };
      }
      if (!product.sizes.some((s) => s.size === line.sizeLabel)) {
        return { ...line, valid: false as const, reason: "This size is no longer available" };
      }
      const tier = product.packTiers.find((t) => t.tierIndex === line.tierIndex);
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
        image: product.images[0]?.url ?? null,
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
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    include: { sizes: true, packTiers: true },
  });
  if (!product || !product.isActive) throw new NotFoundError("Product not found");
  if (!product.sizes.some((s) => s.size === input.sizeLabel)) {
    throw new BadRequestError("Selected size is not available for this product");
  }
  if (!product.packTiers.some((t) => t.tierIndex === input.tierIndex)) {
    throw new BadRequestError("Selected pack tier is not available for this product");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId_sizeLabel_tierIndex: {
        userId,
        productId: input.productId,
        sizeLabel: input.sizeLabel,
        tierIndex: input.tierIndex,
      },
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + input.quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId,
        productId: input.productId,
        sizeLabel: input.sizeLabel,
        tierIndex: input.tierIndex,
        quantity: input.quantity,
      },
    });
  }

  return getCart(userId);
}

export async function updateItemQuantity(userId: number, itemId: number, quantity: number) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError("Cart item not found");
  if (item.userId !== userId) throw new ForbiddenError("This cart item does not belong to you");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  return getCart(userId);
}

export async function removeItem(userId: number, itemId: number) {
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError("Cart item not found");
  if (item.userId !== userId) throw new ForbiddenError("This cart item does not belong to you");

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId);
}

export async function clearCart(userId: number) {
  await prisma.cartItem.deleteMany({ where: { userId } });
}
