import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createOrderSchema } from "./checkout.schema";
import * as controller from "./checkout.controller";

export const checkoutRouter = Router();

checkoutRouter.post("/orders", authenticate, validate({ body: createOrderSchema }), asyncHandler(controller.createOrder));
