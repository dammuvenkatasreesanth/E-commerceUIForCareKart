export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  imageUrl: string | null;
  isActive: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
}

export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface ProductSize {
  id: number;
  size: string;
  sortOrder: number;
}

export interface PackPriceTier {
  id: number;
  tierIndex: number;
  label: string;
  packQty: number;
  discountPct: string;
  tag: string | null;
}

export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  price: string;
  mrp: string;
  material: string | null;
  badge: string | null;
  videoUrl: string | null;
  features: string[] | null;
  specs: Record<string, string> | null;
  moq: number;
  inStock: boolean;
  isActive: boolean;
  ratingAvg: string;
  ratingCount: number;
  images: ProductImage[];
  sizes: ProductSize[];
  packTiers: PackPriceTier[];
  category: Category;
}

export interface ProductReview {
  id: number;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  user: { name: string | null };
}

export interface ProductDetail extends ProductSummary {
  reviews: ProductReview[];
}

export interface ProductListResponse {
  items: ProductSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Banner {
  id: number;
  badge: string | null;
  headline: string;
  subheadline: string | null;
  subtext: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryLink: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryLink: string | null;
  bgGradient: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductListQuery {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  inStock?: boolean;
  sort?: "price_asc" | "price_desc" | "popularity" | "rating" | "newest";
  page?: number;
  limit?: number;
}
