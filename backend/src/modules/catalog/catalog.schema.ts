import { z } from "zod";

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  size: z.string().optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(["price_asc", "price_desc", "popularity", "rating", "newest"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const autosuggestQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().max(20).default(8),
});
