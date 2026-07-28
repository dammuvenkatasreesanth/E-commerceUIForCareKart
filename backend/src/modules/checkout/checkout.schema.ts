import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.number().int().positive(),
  paymentMethod: z.enum(["UPI", "CARD", "NETBANKING", "PHONEPE", "COD"]),
  couponCode: z.string().optional(),
});
