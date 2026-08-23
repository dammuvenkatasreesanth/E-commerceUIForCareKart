import { z } from "zod";

const packTierSchema = z.object({
  tierIndex: z.number().int().min(0).max(3),
  label: z.string().min(1),
  packQty: z.number().int().positive(),
  discountPct: z.number().min(0).max(100),
  tag: z.string().optional(),
});

const boxSizeSchema = z.object({
  boxCount: z.number().int().positive(),
  lengthCm: z.number().int().positive(),
  widthCm: z.number().int().positive(),
  heightCm: z.number().int().positive(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  tagline: z.string().max(200).optional(),
  description: z.string().min(1),
  categoryId: z.number().int().positive(),
  price: z.number().positive(),
  mrp: z.number().positive(),
  material: z.string().optional(),
  badge: z.string().optional(),
  videoUrl: z.string().optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.string()).optional(),
  moq: z.number().int().positive().default(1),
  gstRate: z.number().min(0).max(28).default(18),
  hsnCode: z.string().optional(),
  weightGrams: z.number().int().positive().optional(),
  sizes: z.array(z.string().min(1)).min(1),
  packTiers: z.array(packTierSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
  inStock: z.boolean().optional(),
});

export const setPackTiersSchema = z.object({
  tiers: z.array(packTierSchema).min(1).max(4),
});

export const setBoxSizesSchema = z.object({
  boxSizes: z.array(boxSizeSchema),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  parentId: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
  showOnHomepage: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const adminListProductsQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  includeInactive: z.coerce.boolean().default(true),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
