import type { Request, Response } from "express";
import * as checkoutService from "./checkout.service";
import { UnauthorizedError } from "../../lib/errors";

export async function createOrder(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const order = await checkoutService.createOrder(req.user.id, req.body);
  res.status(201).json(order);
}
