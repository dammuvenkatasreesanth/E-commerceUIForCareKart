import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { listProductsQuerySchema, autosuggestQuerySchema } from "./catalog.schema";
import * as controller from "./catalog.controller";
import { productReviewsRouter } from "../reviews/reviews.routes";

export const catalogRouter = Router();

const pincodeParamsSchema = z.object({ pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode") });

catalogRouter.get("/categories", asyncHandler(controller.listCategories));
catalogRouter.get("/banners", asyncHandler(controller.listBanners));
catalogRouter.get("/pincode/:pincode", validate({ params: pincodeParamsSchema }), asyncHandler(controller.lookupPincode));
catalogRouter.get("/search/autosuggest", validate({ query: autosuggestQuerySchema }), asyncHandler(controller.autosuggest));
catalogRouter.get("/products", validate({ query: listProductsQuerySchema }), asyncHandler(controller.listProducts));
catalogRouter.use("/products", productReviewsRouter);
catalogRouter.get("/products/:slug", asyncHandler(controller.getProduct));
