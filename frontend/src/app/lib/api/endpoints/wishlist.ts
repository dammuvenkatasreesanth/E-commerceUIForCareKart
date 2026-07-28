import { api } from "../client";
import type { WishlistItem } from "../../../types/wishlist";

export function getWishlist(): Promise<WishlistItem[]> {
  return api.get("/wishlist");
}

export function addToWishlist(productId: number): Promise<WishlistItem[]> {
  return api.post(`/wishlist/${productId}`);
}

export function removeFromWishlist(productId: number): Promise<WishlistItem[]> {
  return api.delete(`/wishlist/${productId}`);
}
