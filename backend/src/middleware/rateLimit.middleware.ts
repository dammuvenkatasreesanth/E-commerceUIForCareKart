import rateLimit from "express-rate-limit";

// Coarse defense-in-depth for the whole API; specific auth endpoints below have tighter limits.
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `otp:${req.body?.phone ?? req.ip}`,
  message: { error: { message: "Too many OTP requests. Please try again later." } },
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `otp-verify:${req.body?.phone ?? req.ip}`,
  message: { error: { message: "Too many verification attempts. Please try again later." } },
});

export const staffLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `staff-login:${req.body?.email ?? req.ip}`,
  message: { error: { message: "Too many login attempts. Please try again later." } },
});

export const staffForgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `staff-forgot-password:${req.body?.email ?? req.ip}`,
  message: { error: { message: "Too many password reset requests. Please try again later." } },
});
