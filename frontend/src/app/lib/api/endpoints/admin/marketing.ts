import { api } from "../../client";
import { uploadFormData } from "../../uploadWithProgress";
import type { AdminCoupon, AdminBanner, ContentPage, Campaign, AdminSetting } from "../../../../types/admin";

// ─── Coupons ──────────────────────────────────────────────────────────────
export interface CouponInput {
  code: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  expiresAt?: string;
}

export function listCoupons(): Promise<AdminCoupon[]> {
  return api.get("/admin/coupons");
}

export function createCoupon(input: CouponInput): Promise<AdminCoupon> {
  return api.post("/admin/coupons", input);
}

export function updateCoupon(id: number, input: Partial<CouponInput> & { isActive?: boolean }): Promise<AdminCoupon> {
  return api.patch(`/admin/coupons/${id}`, input);
}

export function deleteCoupon(id: number): Promise<void> {
  return api.delete(`/admin/coupons/${id}`);
}

// ─── Banners ──────────────────────────────────────────────────────────────
export interface BannerInput {
  badge?: string;
  headline: string;
  subheadline?: string;
  subtext?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  bgGradient?: string;
  imageUrl?: string;
  sortOrder?: number;
  startsAt?: string;
  endsAt?: string;
}

export function listAdminBanners(): Promise<AdminBanner[]> {
  return api.get("/admin/banners");
}

export function createBanner(input: BannerInput): Promise<AdminBanner> {
  return api.post("/admin/banners", input);
}

export function updateBanner(id: number, input: Partial<BannerInput> & { isActive?: boolean }): Promise<AdminBanner> {
  return api.patch(`/admin/banners/${id}`, input);
}

export function deleteBanner(id: number): Promise<void> {
  return api.delete(`/admin/banners/${id}`);
}

export function uploadBannerImage(file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> {
  const form = new FormData();
  form.append("image", file);
  return uploadFormData("/admin/banners/upload-image", form, onProgress);
}

// ─── Content pages ────────────────────────────────────────────────────────
export interface ContentPageInput {
  slug: string;
  title: string;
  bodyHtml: string;
}

export function listContentPages(): Promise<ContentPage[]> {
  return api.get("/admin/content-pages");
}

export function createContentPage(input: ContentPageInput): Promise<ContentPage> {
  return api.post("/admin/content-pages", input);
}

export function updateContentPage(id: number, input: Partial<ContentPageInput> & { isPublished?: boolean }): Promise<ContentPage> {
  return api.patch(`/admin/content-pages/${id}`, input);
}

export function deleteContentPage(id: number): Promise<void> {
  return api.delete(`/admin/content-pages/${id}`);
}

// ─── Campaigns ────────────────────────────────────────────────────────────
export interface CampaignInput {
  subject: string;
  bodyHtml: string;
  segment?: { accountType?: "RETAIL" | "BUSINESS" };
  sendNow?: boolean;
}

export function listCampaigns(): Promise<Campaign[]> {
  return api.get("/admin/campaigns");
}

export function createCampaign(input: CampaignInput): Promise<Campaign> {
  return api.post("/admin/campaigns", input);
}

// ─── Settings ─────────────────────────────────────────────────────────────
// Backend returns a plain `{ [key]: value }` map (see marketing.service.ts
// getSettings — Object.fromEntries over StoreSetting rows), not an array of
// {key,value}. Normalize here so callers can keep using AdminSetting[].
export async function getSettings(): Promise<AdminSetting[]> {
  const data = await api.get<Record<string, unknown>>("/admin/settings");
  return Object.entries(data).map(([key, value]) => ({ key, value }));
}

export function updateSetting(key: string, value: unknown): Promise<AdminSetting> {
  return api.patch(`/admin/settings/${key}`, { value });
}
