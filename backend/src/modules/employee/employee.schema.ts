import { z } from "zod";

export const addOrderNoteSchema = z.object({
  note: z.string().min(1).max(2000),
  isInternal: z.boolean().default(true),
});

export const employeeCancelOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});

export const employeeReturnOrderSchema = z.object({
  orderItemId: z.number().int().positive().optional(),
  reason: z.string().min(1).max(500),
  requestedQty: z.number().int().positive().default(1),
});
