import { z } from "zod";
import { PHONE_REGEX } from "../../config/constants";

export const createAddressSchema = z.object({
  label: z.string().max(40).optional(),
  name: z.string().min(1).max(120),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  phone: z.string().regex(PHONE_REGEX),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
