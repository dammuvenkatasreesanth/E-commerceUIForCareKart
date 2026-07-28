import { z } from "zod";

export const listCustomersQuerySchema = z.object({
  q: z.string().optional(),
  accountType: z.enum(["RETAIL", "BUSINESS"]).optional(),
  gstStatus: z.enum(["NONE", "PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const gstApprovalSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().max(500).optional(),
});

export const customerStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED", "SUSPENDED"]),
  reason: z.string().max(500).optional(),
});
