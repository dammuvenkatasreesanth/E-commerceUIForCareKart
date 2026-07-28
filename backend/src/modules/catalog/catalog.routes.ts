import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { listProductsQuerySchema, autosuggestQuerySchema } from "./catalog.schema";
import * as controller from "./catalog.controller";
import { productReviewsRouter } from "../reviews/reviews.routes";

export const catalogRouter = Router();

catalogRouter.get("/categories", asyncHandler(controller.listCategories));
catalogRouter.get("/banners", asyncHandler(controller.listBanners));
catalogRouter.get("/search/autosuggest", validate({ query: autosuggestQuerySchema }), asyncHandler(controller.autosuggest));
catalogRouter.get("/products", validate({ query: listProductsQuerySchema }), asyncHandler(controller.listProducts));
catalogRouter.use("/products", productReviewsRouter);
catalogRouter.get("/products/:slug", asyncHandler(controller.getProduct));
