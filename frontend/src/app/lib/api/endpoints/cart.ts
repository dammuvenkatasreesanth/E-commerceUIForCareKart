import { api } from "../client";
import type { CartResponse, CartQuoteLineItem } from "../../../types/cart";

export function getCart(): Promise<CartResponse> {
  return api.get("/cart");
}

export function addCartItem(input: { productId: number; sizeLabel: string; tierIndex: number; quantity: number }): Promise<CartResponse> {
  return api.post("/cart/items", input);
}

export function updateCartItem(id: number, quantity: number): Promise<CartResponse> {
  return api.patch(`/cart/items/${id}`, { quantity });
}

export function removeCartItem(id: number): Promise<CartResponse> {
  return api.delete(`/cart/items/${id}`);
}

export function clearCart(): Promise<void> {
  return api.delete("/cart");
}

export function quoteCart(items: CartQuoteLineItem[]): Promise<CartResponse> {
  return api.post("/cart/quote", { items });
}
