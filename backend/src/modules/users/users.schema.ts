import { z } from "zod";
import { GSTIN_REGEX } from "../../config/constants";

export const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().optional(),
    phone: z.string().max(20).optional(),
    accountType: z.enum(["RETAIL", "BUSINESS"]).optional(),
    gstin: z.string().regex(GSTIN_REGEX, "Enter a valid GSTIN").optional(),
  })
  .refine((data) => data.accountType !== "BUSINESS" || !!data.gstin, {
    message: "GSTIN is required for a business account",
    path: ["gstin"],
  });
