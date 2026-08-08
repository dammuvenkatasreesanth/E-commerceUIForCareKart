import type { Request, Response } from "express";
import * as authService from "./auth.service";
import { UnauthorizedError } from "../../lib/errors";
import { env } from "../../config/env";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = `${env.API_BASE_PATH}/auth`;

function sessionMeta(req: Request) {
  return { userAgent: req.headers["user-agent"], ip: req.ip };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}

function serializeUser(user: { id: number; role: string; name: string | null; phone: string | null; email: string | null; accountType: string; gstin: string | null; gstStatus: string; avatarUrl: string | null }) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    phone: user.phone,
    email: user.email,
    accountType: user.accountType,
    gstin: user.gstin,
    gstStatus: user.gstStatus,
    avatarUrl: user.avatarUrl,
  };
}

// ── Customer: email + password ──────────────────────────────────────────

export async function customerSignupHandler(req: Request, res: Response) {
  await authService.customerSignup(req.body);
  res.status(201).json({ message: "Account created. Please check your email to verify your address before logging in." });
}

export async function customerLoginHandler(req: Request, res: Response) {
  const result = await authService.customerLogin(req.body.email, req.body.password, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({ accessToken: result.accessToken, user: serializeUser(result.user) });
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const result = await authService.verifyEmail(req.body.token, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    isNewUser: result.isNewUser,
    user: serializeUser(result.user),
  });
}

export async function resendVerificationHandler(req: Request, res: Response) {
  await authService.resendVerificationEmail(req.body.email);
  res.status(200).json({ message: "If that email exists and isn't verified yet, a new link has been sent." });
}

export async function verificationStatusHandler(req: Request, res: Response) {
  const result = await authService.checkVerificationStatus(req.query.email as string);
  res.status(200).json(result);
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  await authService.forgotPassword(req.body.email, "/reset-password");
  res.status(200).json({ message: "If that email exists, a reset link has been sent." });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json({ message: "Password updated. You can now log in." });
}

// ── Customer: OAuth ──────────────────────────────────────────────────────

export async function googleLoginHandler(req: Request, res: Response) {
  const result = await authService.googleLogin(req.body.idToken, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    isNewUser: result.isNewUser,
    user: serializeUser(result.user),
  });
}

export async function facebookLoginHandler(req: Request, res: Response) {
  const result = await authService.facebookLogin(req.body.accessToken, req.body.userId, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    isNewUser: result.isNewUser,
    user: serializeUser(result.user),
  });
}

// ── Shared session management ────────────────────────────────────────────

export async function refresh(req: Request, res: Response) {
  const cookieToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!cookieToken) throw new UnauthorizedError("No session found.");

  const tokens = await authService.rotateRefreshToken(cookieToken, sessionMeta(req));
  setRefreshCookie(res, tokens.refreshToken);
  res.status(200).json({ accessToken: tokens.accessToken });
}

export async function logoutHandler(req: Request, res: Response) {
  const cookieToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (cookieToken) {
    await authService.logout(cookieToken);
  }
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function logoutAllHandler(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  await authService.logoutAll(req.user.id);
  clearRefreshCookie(res);
  res.status(204).send();
}

// ── Staff: email + password ──────────────────────────────────────────────

export async function staffLoginHandler(req: Request, res: Response) {
  const result = await authService.staffLogin(req.body.email, req.body.password, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    user: serializeUser(result.user),
  });
}

export async function staffAcceptInviteHandler(req: Request, res: Response) {
  const result = await authService.acceptStaffInvite(req.body.token, req.body.password, sessionMeta(req));
  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    user: serializeUser(result.user),
  });
}

export async function staffForgotPasswordHandler(req: Request, res: Response) {
  await authService.forgotPassword(req.body.email, "/staff/reset-password");
  res.status(200).json({ message: "If that email exists, a reset link has been sent." });
}

export async function staffResetPasswordHandler(req: Request, res: Response) {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(200).json({ message: "Password updated. You can now log in." });
}
