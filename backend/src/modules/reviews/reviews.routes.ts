import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createReviewSchema, listReviewsQuerySchema } from "./reviews.schema";
import * as controller from "./reviews.controller";

export const reviewsRouter = Router();

reviewsRouter.post("/", authenticate, validate({ body: createReviewSchema }), asyncHandler(controller.create));
reviewsRouter.patch("/:id/helpful", asyncHandler(controller.markHelpful));

export const productReviewsRouter = Router();
productReviewsRouter.get(
  "/:productId/reviews",
  validate({ query: listReviewsQuerySchema }),
  asyncHandler(controller.listForProduct),
);
