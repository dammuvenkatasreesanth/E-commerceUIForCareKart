import type { Request, Response } from "express";
import * as cartService from "./cart.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function getCart(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.json(await cartService.getCart(req.user.id));
}

export async function addItem(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.status(201).json(await cartService.addItem(req.user.id, req.body));
}

export async function updateItem(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "cart item id");
  res.json(await cartService.updateItemQuantity(req.user.id, id, req.body.quantity));
}

export async function removeItem(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const id = parseIdParam(req.params.id, "cart item id");
  res.json(await cartService.removeItem(req.user.id, id));
}

export async function clearCart(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  await cartService.clearCart(req.user.id);
  res.status(204).send();
}

export async function quoteCart(req: Request, res: Response) {
  res.json(await cartService.quoteCart(req.body.items));
}
