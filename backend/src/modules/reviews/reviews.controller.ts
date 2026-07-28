import type { Request, Response } from "express";
import * as reviewsService from "./reviews.service";
import { UnauthorizedError } from "../../lib/errors";
import { parseIdParam } from "../../lib/parseId";

export async function create(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  const review = await reviewsService.createReview(req.user.id, req.body);
  res.status(201).json(review);
}

export async function listForProduct(req: Request, res: Response) {
  const productId = parseIdParam(req.params.productId, "product id");
  const { page, limit } = req.query as unknown as { page: number; limit: number };
  res.json(await reviewsService.listReviewsForProduct(productId, page, limit));
}

export async function markHelpful(req: Request, res: Response) {
  const id = parseIdParam(req.params.id, "review id");
  res.json(await reviewsService.markHelpful(id));
}
