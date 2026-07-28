// Guest (logged-out) cart — lives entirely in the browser. Denormalized at
// add-to-cart time from whatever product data is already in hand, so the cart
// badge and basic rendering work instantly without a network round trip.
// Pricing for display is always re-derived server-side via POST /cart/quote
// (see hooks/useCart.ts) — this file never computes or trusts a price.
export interface LocalCartItem {
  productId: number;
  slug: string;
  name: string;
  image: string | null;
  sizeLabel: string;
  tierIndex: number;
  quantity: number;
}

const STORAGE_KEY = "carekart_guest_cart_v1";

function readFromStorage(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Cached so repeated getLocalCart() calls between writes return the same
// array reference — required by useSyncExternalStore, whose getSnapshot must
// be reference-stable when nothing changed, or React re-renders forever.
let cache: LocalCartItem[] | null = null;

function writeRaw(items: LocalCartItem[]): void {
  cache = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

const listeners = new Set<() => void>();

export function subscribeLocalCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getLocalCart(): LocalCartItem[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

function sameLine(a: LocalCartItem, b: Pick<LocalCartItem, "productId" | "sizeLabel" | "tierIndex">): boolean {
  return a.productId === b.productId && a.sizeLabel === b.sizeLabel && a.tierIndex === b.tierIndex;
}

export function addLocalCartItem(item: Omit<LocalCartItem, "quantity"> & { quantity?: number }): void {
  const items = getLocalCart();
  const qty = item.quantity ?? 1;
  const existingIdx = items.findIndex((i) => sameLine(i, item));
  const next = existingIdx >= 0 ? items.map((i, idx) => (idx === existingIdx ? { ...i, quantity: i.quantity + qty } : i)) : [...items, { ...item, quantity: qty }];
  writeRaw(next);
}

export function updateLocalCartItemQuantity(line: Pick<LocalCartItem, "productId" | "sizeLabel" | "tierIndex">, quantity: number): void {
  const items = getLocalCart();
  const next = quantity <= 0 ? items.filter((i) => !sameLine(i, line)) : items.map((i) => (sameLine(i, line) ? { ...i, quantity } : i));
  writeRaw(next);
}

export function removeLocalCartItem(line: Pick<LocalCartItem, "productId" | "sizeLabel" | "tierIndex">): void {
  writeRaw(getLocalCart().filter((i) => !sameLine(i, line)));
}

export function clearLocalCart(): void {
  writeRaw([]);
}
