export interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  category: string;
  badge: string;
  material: string;
  sizes: string[];
  images: string[];
  videoUrl: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  moq: number;
  packDiscounts: number[]; // [0, pct_100, pct_500, pct_1000]
}

export interface CartItem extends Product {
  qty: number;
  selectedSize: string;
  packSize: number;
  packPrice: number;
}

export interface Banner {
  id: string;
  active: boolean;
  badge: string;
  headline: string;
  subheadline: string;
  subtext: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  bg: string;
  imageUrl: string;
}
