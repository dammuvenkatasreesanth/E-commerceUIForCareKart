import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  orderId: z.number().int().positive().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(150).optional(),
  body: z.string().min(1).max(4000),
});

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
