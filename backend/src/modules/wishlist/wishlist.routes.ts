import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import * as controller from "./wishlist.controller";

export const wishlistRouter = Router();

wishlistRouter.use(authenticate);

wishlistRouter.get("/", asyncHandler(controller.list));
wishlistRouter.post("/:productId", asyncHandler(controller.add));
wishlistRouter.delete("/:productId", asyncHandler(controller.remove));
