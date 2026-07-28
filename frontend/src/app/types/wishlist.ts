export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image: string | null;
  price: string;
  mrp: string;
  inStock: boolean;
  addedAt: string;
}
