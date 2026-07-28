import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  sizeLabel: z.string().min(1),
  tierIndex: z.number().int().min(0).max(3).default(0),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int(),
});

export const quoteCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        sizeLabel: z.string().min(1),
        tierIndex: z.number().int().min(0).max(3),
        quantity: z.number().int().positive(),
      }),
    )
    .max(100), // DoS guard — this endpoint is public/no-auth and does a DB lookup per line
});
