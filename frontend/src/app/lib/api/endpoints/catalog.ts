import { api, buildQuery } from "../client";
import type { Category, ProductDetail, ProductListQuery, ProductListResponse, Banner } from "../../../types/catalog";

export function listCategories(): Promise<Category[]> {
  return api.get("/catalog/categories");
}

export function listBanners(): Promise<Banner[]> {
  return api.get("/catalog/banners");
}

export function listProducts(query: ProductListQuery): Promise<ProductListResponse> {
  return api.get(`/catalog/products${buildQuery(query as Record<string, string | number | boolean | undefined>)}`);
}

export function getProduct(slug: string): Promise<ProductDetail> {
  return api.get(`/catalog/products/${slug}`);
}

export function autosuggest(q: string): Promise<{ id: number; name: string; slug: string; image: string | null }[]> {
  return api.get(`/catalog/search/autosuggest${buildQuery({ q })}`);
}

export function lookupPincode(pincode: string): Promise<{ city: string; state: string } | null> {
  return api.get(`/catalog/pincode/${pincode}`);
}
