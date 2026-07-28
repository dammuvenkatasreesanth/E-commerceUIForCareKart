import type { Request, Response } from "express";
import * as couponsService from "./coupons.service";

export async function validate(req: Request, res: Response) {
  const { code, subtotal } = req.body;
  res.json(await couponsService.validateCoupon(code, subtotal));
}
