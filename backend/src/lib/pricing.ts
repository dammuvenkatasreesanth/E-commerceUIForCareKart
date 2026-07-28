import type { Prisma } from "@prisma/client";

export const DEFAULT_SHIPPING_FEE = 99;
export const FREE_SHIPPING_THRESHOLD = 999;

export function tierUnitPrice(basePrice: Prisma.Decimal | number, discountPct: Prisma.Decimal | number): number {
  const base = Number(basePrice);
  const discount = Number(discountPct);
  return Math.round(base * (1 - discount / 100));
}

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
}
