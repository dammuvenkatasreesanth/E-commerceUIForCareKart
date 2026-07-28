import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { initiatePaymentSchema } from "./payments.schema";
import * as controller from "./payments.controller";

export const paymentsRouter = Router();

paymentsRouter.post("/phonepe/initiate", authenticate, validate({ body: initiatePaymentSchema }), asyncHandler(controller.initiate));
// PhonePe calls these directly — no user auth, integrity comes from the X-VERIFY checksum instead.
paymentsRouter.post("/phonepe/callback", asyncHandler(controller.callback));
paymentsRouter.get("/phonepe/redirect", asyncHandler(controller.redirect));

paymentsRouter.get("/:orderId/status", authenticate, asyncHandler(controller.getStatus));
