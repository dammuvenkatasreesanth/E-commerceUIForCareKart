import { api, apiFetchBlob, buildQuery } from "../../client";
import { uploadFormData } from "../../uploadWithProgress";
import type { AdminProduct, AdminProductInput, AdminCategory, Paginated } from "../../../../types/admin";

export interface AdminProductListQuery {
  q?: string;
  category?: string;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

export function listAdminProducts(query: AdminProductListQuery = {}): Promise<Paginated<AdminProduct>> {
  return api.get(`/admin/products${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}

export function getAdminProduct(id: number): Promise<AdminProduct> {
  return api.get(`/admin/products/${id}`);
}

export function createAdminProduct(input: AdminProductInput): Promise<AdminProduct> {
  return api.post("/admin/products", input);
}

export function updateAdminProduct(id: number, input: Partial<AdminProductInput>): Promise<AdminProduct> {
  return api.patch(`/admin/products/${id}`, input);
}

export function deleteAdminProduct(id: number): Promise<void> {
  return api.delete(`/admin/products/${id}`);
}

export function setPackTiers(id: number, tiers: NonNullable<AdminProductInput["packTiers"]>): Promise<AdminProduct> {
  return api.put(`/admin/products/${id}/pack-tiers`, { tiers });
}

export function setBoxSizes(id: number, boxSizes: NonNullable<AdminProductInput["boxSizes"]>): Promise<AdminProduct> {
  return api.put(`/admin/products/${id}/box-sizes`, { boxSizes });
}

export function addProductImage(id: number, file: File, onProgress?: (percent: number) => void): Promise<{ id: number; url: string; sortOrder: number }> {
  const form = new FormData();
  form.append("image", file);
  return uploadFormData(`/admin/products/${id}/images`, form, onProgress);
}

export function removeProductImage(id: number, imageId: number): Promise<void> {
  return api.delete(`/admin/products/${id}/images/${imageId}`);
}

// Uploads only — the caller PATCHes the returned url onto the product's
// videoUrl separately (mirrors the banner/category image upload flow).
export function uploadProductVideo(id: number, file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> {
  const form = new FormData();
  form.append("video", file);
  return uploadFormData(`/admin/products/${id}/video`, form, onProgress);
}

export function importProductsCsv(file: File): Promise<{ created: number; updated: number; errors: string[] }> {
  const form = new FormData();
  form.append("file", file);
  return api.postForm("/admin/products/import", form);
}

export async function exportProductsCsv(): Promise<Blob> {
  return apiFetchBlob("/admin/products/export");
}

export function listAdminCategories(): Promise<AdminCategory[]> {
  return api.get("/admin/categories");
}

export function createCategory(input: { name: string; parentId?: number; imageUrl?: string; showOnHomepage?: boolean; sortOrder?: number }): Promise<AdminCategory> {
  return api.post("/admin/categories", input);
}

export function updateCategory(id: number, input: Partial<{ name: string; parentId: number; imageUrl: string; showOnHomepage: boolean; sortOrder: number; isActive: boolean }>): Promise<AdminCategory> {
  return api.patch(`/admin/categories/${id}`, input);
}

export function deleteCategory(id: number): Promise<void> {
  return api.delete(`/admin/categories/${id}`);
}

export function uploadCategoryImage(file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> {
  const form = new FormData();
  form.append("image", file);
  return uploadFormData("/admin/categories/upload-image", form, onProgress);
}
