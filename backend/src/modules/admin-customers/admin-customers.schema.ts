import { z } from "zod";
import { GSTIN_REGEX, PHONE_REGEX } from "../../config/constants";

// Every editable field except password — mirrors the customer's own
// self-service updateProfileSchema (users.schema.ts) so the same GSTIN/
// email validation rules apply regardless of who's making the change.
export const updateCustomerSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(PHONE_REGEX).optional(),
    accountType: z.enum(["RETAIL", "BUSINESS"]).optional(),
    gstin: z.string().regex(GSTIN_REGEX, "Enter a valid GSTIN").optional(),
  })
  .refine((data) => data.accountType !== "BUSINESS" || !!data.gstin, {
    message: "GSTIN is required for a business account",
    path: ["gstin"],
  });

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
