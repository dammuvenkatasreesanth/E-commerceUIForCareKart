import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import { otpRequestLimiter, otpVerifyLimiter, staffLoginLimiter, staffForgotPasswordLimiter } from "../../middleware/rateLimit.middleware";
import {
  otpRequestSchema,
  otpVerifySchema,
  staffLoginSchema,
  staffAcceptInviteSchema,
  staffForgotPasswordSchema,
  staffResetPasswordSchema,
} from "./auth.schema";
import * as controller from "./auth.controller";

export const authRouter = Router();

// Customer: phone + OTP
authRouter.post("/otp/request", otpRequestLimiter, validate({ body: otpRequestSchema }), asyncHandler(controller.requestOtp));
authRouter.post("/otp/verify", otpVerifyLimiter, validate({ body: otpVerifySchema }), asyncHandler(controller.verifyOtp));

// Staff: email + password
authRouter.post("/staff/login", staffLoginLimiter, validate({ body: staffLoginSchema }), asyncHandler(controller.staffLoginHandler));
authRouter.post("/staff/accept-invite", validate({ body: staffAcceptInviteSchema }), asyncHandler(controller.staffAcceptInviteHandler));
authRouter.post("/staff/forgot-password", staffForgotPasswordLimiter, validate({ body: staffForgotPasswordSchema }), asyncHandler(controller.staffForgotPasswordHandler));
authRouter.post("/staff/reset-password", validate({ body: staffResetPasswordSchema }), asyncHandler(controller.staffResetPasswordHandler));

// Shared session management — refresh/logout read the refresh token from the
// httpOnly cookie set by the login endpoints above, not from the request body.
authRouter.post("/refresh", asyncHandler(controller.refresh));
authRouter.post("/logout", asyncHandler(controller.logoutHandler));
authRouter.post("/logout-all", authenticate, asyncHandler(controller.logoutAllHandler));
