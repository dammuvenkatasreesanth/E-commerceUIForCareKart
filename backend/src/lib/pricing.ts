export const DEFAULT_SHIPPING_FEE = 99;
export const FREE_SHIPPING_THRESHOLD = 999;

// Drizzle returns MySQL DECIMAL columns as strings (avoids float precision
// loss); accept that alongside plain numbers so callers don't need to
// convert at every call site.
export function tierUnitPrice(basePrice: string | number, discountPct: string | number): number {
  const base = Number(basePrice);
  const discount = Number(discountPct);
  return Math.round(base * (1 - discount / 100));
}

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
}
