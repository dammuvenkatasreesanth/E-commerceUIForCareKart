import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { validate } from "../../middleware/validate.middleware";
import { authenticate } from "../../middleware/auth.middleware";
import {
  authSignupLimiter,
  customerLoginLimiter,
  staffLoginLimiter,
  staffForgotPasswordLimiter,
} from "../../middleware/rateLimit.middleware";
import {
  customerSignupSchema,
  customerLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  googleLoginSchema,
  facebookLoginSchema,
  staffLoginSchema,
  staffAcceptInviteSchema,
  staffForgotPasswordSchema,
  staffResetPasswordSchema,
} from "./auth.schema";
import * as controller from "./auth.controller";

export const authRouter = Router();

// Customer: email + password
authRouter.post("/signup", authSignupLimiter, validate({ body: customerSignupSchema }), asyncHandler(controller.customerSignupHandler));
authRouter.post("/login", customerLoginLimiter, validate({ body: customerLoginSchema }), asyncHandler(controller.customerLoginHandler));
authRouter.post("/verify-email", validate({ body: verifyEmailSchema }), asyncHandler(controller.verifyEmailHandler));
authRouter.post("/resend-verification", authSignupLimiter, validate({ body: resendVerificationSchema }), asyncHandler(controller.resendVerificationHandler));
authRouter.post("/forgot-password", staffForgotPasswordLimiter, validate({ body: forgotPasswordSchema }), asyncHandler(controller.forgotPasswordHandler));
authRouter.post("/reset-password", validate({ body: resetPasswordSchema }), asyncHandler(controller.resetPasswordHandler));

// Customer: OAuth
authRouter.post("/google", validate({ body: googleLoginSchema }), asyncHandler(controller.googleLoginHandler));
authRouter.post("/facebook", validate({ body: facebookLoginSchema }), asyncHandler(controller.facebookLoginHandler));

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
