import { z } from "zod";

export const createCouponSchema = z.object({
  code: z.string().min(3).max(30),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
});

export const updateCouponSchema = createCouponSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const createBannerSchema = z.object({
  badge: z.string().optional(),
  headline: z.string().min(1),
  subheadline: z.string().optional(),
  subtext: z.string().optional(),
  ctaPrimaryText: z.string().optional(),
  ctaPrimaryLink: z.string().optional(),
  ctaSecondaryText: z.string().optional(),
  ctaSecondaryLink: z.string().optional(),
  bgGradient: z.string().optional(),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

export const updateBannerSchema = createBannerSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const createContentPageSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  bodyHtml: z.string().min(1),
});

export const updateContentPageSchema = createContentPageSchema.partial().extend({
  isPublished: z.boolean().optional(),
});

export const createCampaignSchema = z.object({
  subject: z.string().min(1).max(200),
  bodyHtml: z.string().min(1),
  segment: z
    .object({
      accountType: z.enum(["RETAIL", "BUSINESS"]).optional(),
    })
    .optional(),
  sendNow: z.boolean().default(false),
});

export const updateSettingSchema = z.object({
  value: z.unknown(),
});
