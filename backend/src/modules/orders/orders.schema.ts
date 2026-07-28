import { z } from "zod";

export const cancelOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});

export const returnOrderSchema = z.object({
  orderItemId: z.number().int().positive().optional(),
  reason: z.string().min(1).max(500),
  requestedQty: z.number().int().positive().default(1),
});
