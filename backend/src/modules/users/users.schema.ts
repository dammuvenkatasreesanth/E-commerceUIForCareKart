import { z } from "zod";
import { GSTIN_REGEX, PHONE_REGEX } from "../../config/constants";

export const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    email: z.string().email().optional(),
    accountType: z.enum(["RETAIL", "BUSINESS"]).optional(),
    gstin: z.string().regex(GSTIN_REGEX, "Enter a valid GSTIN").optional(),
  })
  .refine((data) => data.accountType !== "BUSINESS" || !!data.gstin, {
    message: "GSTIN is required for a business account",
    path: ["gstin"],
  });

export const phoneChangeRequestSchema = z.object({
  newPhone: z.string().regex(PHONE_REGEX),
});

export const phoneChangeVerifySchema = z.object({
  newPhone: z.string().regex(PHONE_REGEX),
  code: z.string().length(6),
});
