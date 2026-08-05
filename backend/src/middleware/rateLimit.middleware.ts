import rateLimit from "express-rate-limit";

// Coarse defense-in-depth for the whole API; specific auth endpoints below have tighter limits.
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authSignupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `auth-signup:${req.body?.email ?? req.ip}`,
  message: { error: { message: "Too many signup attempts. Please try again later." } },
});

export const customerLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `customer-login:${req.body?.email ?? req.ip}`,
  message: { error: { message: "Too many login attempts. Please try again later." } },
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

export const reviewHelpfulLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `review-helpful:${req.ip}`,
  message: { error: { message: "Too many requests. Please try again later." } },
});
