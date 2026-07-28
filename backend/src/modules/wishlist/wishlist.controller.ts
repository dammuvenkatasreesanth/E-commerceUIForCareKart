import type { Request, Response } from "express";
import * as wishlistService from "./wishlist.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function list(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  res.json(await wishlistService.listWishlist(req.user.id));
}

export async function add(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const productId = parseIdParam(req.params.productId, "product id");
  res.status(201).json(await wishlistService.addToWishlist(req.user.id, productId));
}

export async function remove(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const productId = parseIdParam(req.params.productId, "product id");
  res.json(await wishlistService.removeFromWishlist(req.user.id, productId));
}
