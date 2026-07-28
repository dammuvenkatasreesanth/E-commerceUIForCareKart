import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { otpRequestLimiter, otpVerifyLimiter } from "../../middleware/rateLimit.middleware";
import { updateProfileSchema, phoneChangeRequestSchema, phoneChangeVerifySchema } from "./users.schema";
import * as controller from "./users.controller";
import { addressesRouter } from "../addresses/addresses.routes";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/me", asyncHandler(controller.getMe));
usersRouter.patch("/me", validate({ body: updateProfileSchema }), asyncHandler(controller.updateMe));

usersRouter.post(
  "/me/phone/request-otp",
  otpRequestLimiter,
  validate({ body: phoneChangeRequestSchema }),
  asyncHandler(controller.requestPhoneChange),
);
usersRouter.post(
  "/me/phone/verify-otp",
  otpVerifyLimiter,
  validate({ body: phoneChangeVerifySchema }),
  asyncHandler(controller.verifyPhoneChange),
);

usersRouter.use("/me/addresses", addressesRouter);
