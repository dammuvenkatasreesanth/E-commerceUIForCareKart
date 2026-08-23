import { z } from "zod";

export const upsertBoxSizeSchema = z.object({
  boxCount: z.number().int().positive(),
  lengthCm: z.number().int().positive(),
  widthCm: z.number().int().positive(),
  heightCm: z.number().int().positive(),
});
