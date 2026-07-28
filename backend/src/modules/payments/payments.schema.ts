import { z } from "zod";

export const initiatePaymentSchema = z.object({
  orderId: z.number().int().positive(),
});
