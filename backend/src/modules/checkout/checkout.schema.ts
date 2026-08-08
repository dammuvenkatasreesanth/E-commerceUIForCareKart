import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.number().int().positive(),
  paymentMethod: z.enum(["UPI", "CARD", "NETBANKING", "PHONEPE", "COD"]),
  couponCode: z.string().optional(),
  // "Buy Now" checkout — a single ad-hoc line item bought without ever
  // touching the user's real cart, instead of the usual cart-backed order.
  buyNow: z
    .object({
      productId: z.number().int().positive(),
      sizeLabel: z.string().min(1),
      tierIndex: z.number().int().nonnegative(),
      quantity: z.number().int().positive(),
    })
    .optional(),
});
