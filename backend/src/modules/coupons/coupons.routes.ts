import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { validateCouponSchema } from "./coupons.schema";
import * as controller from "./coupons.controller";

export const couponsRouter = Router();

couponsRouter.post("/validate", authenticate, validate({ body: validateCouponSchema }), asyncHandler(controller.validate));
