import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upsertBoxSizeSchema } from "./admin-shipping.schema";
import * as controller from "./admin-shipping.controller";

export const adminShippingRouter = Router();

adminShippingRouter.use(authenticate, requireRole("ADMIN"));

adminShippingRouter.get("/box-sizes", asyncHandler(controller.list));
adminShippingRouter.post("/box-sizes", validate({ body: upsertBoxSizeSchema }), asyncHandler(controller.create));
adminShippingRouter.put("/box-sizes/:id", validate({ body: upsertBoxSizeSchema }), asyncHandler(controller.update));
adminShippingRouter.delete("/box-sizes/:id", asyncHandler(controller.remove));
