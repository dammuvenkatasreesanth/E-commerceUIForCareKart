import bcrypt from "bcryptjs";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../lib/prisma";
import {
  signAccessToken,
  generateRefreshTokenValue,
  hashToken,
  refreshTokenExpiry,
} from "../../lib/jwt";
import { BadRequestError, ConflictError, ForbiddenError, UnauthorizedError } from "../../lib/errors";
import { sendMail } from "../../providers/email/mailer";
import { passwordResetEmail, staffInviteEmail } from "../../providers/email/templates/staffAuth";
import { verifyEmailEmail, customerPasswordResetEmail } from "../../providers/email/templates/customerAuth";
import { env } from "../../config/env";
import {
  PASSWORD_RESET_TTL_HOURS,
  STAFF_INVITE_TTL_HOURS,
  EMAIL_VERIFICATION_TTL_HOURS,
} from "../../config/constants";
import type { Role, User } from "@prisma/client";

interface SessionMeta {
  userAgent?: string;
  ip?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

async function issueSession(userId: number, role: Role, meta: SessionMeta): Promise<TokenPair> {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = generateRefreshTokenValue();

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      userAgent: meta.userAgent,
      createdByIp: meta.ip,
      expiresAt: refreshTokenExpiry(),
    },
  });

  return { accessToken, refreshToken };
}

// ── Customer: email + password ────────────────────────────────────────────

export async function sendVerificationEmail(userId: number, email: string, name: string): Promise<void> {
  const token = generateRefreshTokenValue();
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_HOURS * 60 * 60 * 1000),
    },
  });

  const verifyUrl = `${env.STAFF_APP_URL}/verify-email?token=${token}`;
  const { subject, html } = verifyEmailEmail(name, verifyUrl);
  await sendMail({ to: email, subject, html });
}

export async function customerSignup(input: { name: string; email: string; password: string }): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError("An account with this email already exists.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { email: input.email, name: input.name, passwordHash, role: "CUSTOMER", status: "ACTIVE", emailVerified: false },
  });

  await sendVerificationEmail(user.id, user.email!, user.name ?? "");
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) return; // don't leak existence; no-op if already verified
  await sendVerificationEmail(user.id, email, user.name ?? "");
}

export async function verifyEmail(
  token: string,
  meta: SessionMeta,
): Promise<TokenPair & { user: User; isNewUser: boolean }> {
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record) throw new BadRequestError("Invalid or expired verification link.");
  if (record.consumedAt) throw new BadRequestError("This verification link has already been used.");
  if (record.expiresAt < new Date()) throw new BadRequestError("This verification link has expired.");

  const user = await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
    return tx.user.update({
      where: { id: record.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date(), lastLoginAt: new Date() },
    });
  });

  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, user, isNewUser: true }; // verify-email is inherently the account's first session
}

export async function customerLogin(email: string, password: string, meta: SessionMeta): Promise<TokenPair & { user: User }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new UnauthorizedError("Invalid email or password.");
  if (user.status === "BLOCKED" || user.status === "SUSPENDED") {
    throw new ForbiddenError("This account has been blocked or suspended.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError("Invalid email or password.");

  if (!user.emailVerified) {
    throw new ForbiddenError("Please verify your email before logging in. Check your inbox for the verification link.");
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, user };
}

// ── Customer: OAuth ─────────────────────────────────────────────────────

interface OAuthProfile {
  provider: "google" | "facebook";
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

// Auto-links on a provider-verified email match (existing password account,
// or an account already linked to the *other* OAuth provider). This is safe
// because Google/Facebook only expose emails they've themselves verified —
// a matching email is at least as strong a proof of ownership as our own
// email-verification link. Callers must reject unverified provider emails
// before reaching this function.
async function linkOrCreateOAuthUser(profile: OAuthProfile, meta: SessionMeta): Promise<TokenPair & { user: User; isNewUser: boolean }> {
  const idField = profile.provider === "google" ? "googleId" : "facebookId";

  let user = await prisma.user.findUnique({ where: { [idField]: profile.providerId } as never });
  let isNewUser = false;

  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email: profile.email } });
    if (existingByEmail) {
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          [idField]: profile.providerId,
          emailVerified: true,
          emailVerifiedAt: existingByEmail.emailVerifiedAt ?? new Date(),
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          role: "CUSTOMER",
          status: "ACTIVE",
          emailVerified: true,
          emailVerifiedAt: new Date(),
          [idField]: profile.providerId,
        },
      });
      isNewUser = true;
    }
  }

  if (user.status === "BLOCKED" || user.status === "SUSPENDED") {
    throw new ForbiddenError("This account has been blocked or suspended.");
  }

  // Keeps the profile photo in sync with the provider on every login, not just
  // on first sign-up — matches whatever the user currently has set there.
  user = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), avatarUrl: profile.avatarUrl ?? user.avatarUrl },
  });
  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, user, isNewUser };
}

export async function googleLogin(idToken: string, meta: SessionMeta): Promise<TokenPair & { user: User; isNewUser: boolean }> {
  const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.email_verified) {
    throw new BadRequestError("Google account has no verified email.");
  }
  return linkOrCreateOAuthUser(
    { provider: "google", providerId: payload.sub, email: payload.email, name: payload.name ?? "", avatarUrl: payload.picture },
    meta,
  );
}

export async function facebookLogin(
  accessToken: string,
  userId: string,
  meta: SessionMeta,
): Promise<TokenPair & { user: User; isNewUser: boolean }> {
  // Confirm the token was actually issued for our app (and for this user)
  // before trusting anything from /me — otherwise a token minted for an
  // unrelated Facebook app could be replayed against us.
  const appToken = `${env.FACEBOOK_APP_ID}|${env.FACEBOOK_APP_SECRET}`;
  const debug = await axios.get("https://graph.facebook.com/debug_token", {
    params: { input_token: accessToken, access_token: appToken },
  });
  const data = debug.data?.data;
  if (!data?.is_valid || data.app_id !== env.FACEBOOK_APP_ID || data.user_id !== userId) {
    throw new UnauthorizedError("Invalid Facebook session.");
  }

  const profile = await axios.get("https://graph.facebook.com/me", {
    params: { fields: "id,name,email,picture.type(large)", access_token: accessToken },
  });
  if (!profile.data?.email) {
    throw new BadRequestError("Email permission is required to sign in with Facebook.");
  }

  return linkOrCreateOAuthUser(
    {
      provider: "facebook",
      providerId: profile.data.id,
      email: profile.data.email,
      name: profile.data.name ?? "",
      avatarUrl: profile.data.picture?.data?.url,
    },
    meta,
  );
}

// ── Staff: email + password ────────────────────────────────────────────

export async function staffLogin(email: string, password: string, meta: SessionMeta): Promise<TokenPair & { user: User }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new UnauthorizedError("Invalid email or password.");
  if (user.status === "BLOCKED" || user.status === "SUSPENDED") {
    throw new ForbiddenError("This account has been blocked or suspended.");
  }
  if (user.status === "PENDING_CLAIM") {
    throw new ForbiddenError("Please accept your invite email before logging in.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new UnauthorizedError("Invalid email or password.");

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, user };
}

export async function acceptStaffInvite(token: string, password: string, meta: SessionMeta): Promise<TokenPair & { user: User }> {
  const invite = await prisma.staffInvite.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!invite) throw new BadRequestError("Invalid or expired invite link.");
  if (invite.acceptedAt) throw new BadRequestError("This invite has already been used.");
  if (invite.expiresAt < new Date()) throw new BadRequestError("This invite link has expired.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.$transaction(async (tx) => {
    await tx.staffInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } });
    return tx.user.update({
      where: { id: invite.userId },
      data: { passwordHash, status: "ACTIVE", claimedAt: new Date() },
    });
  });

  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, user };
}

export async function createStaffInvite(
  issuedById: number,
  input: { email: string; name: string; role: Extract<Role, "ADMIN" | "EMPLOYEE"> },
): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError("A user with this email already exists");

  const token = generateRefreshTokenValue();

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email: input.email, name: input.name, role: input.role, status: "PENDING_CLAIM" },
    });
    await tx.staffInvite.create({
      data: {
        userId: created.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + STAFF_INVITE_TTL_HOURS * 60 * 60 * 1000),
        issuedById,
      },
    });
    return created;
  });

  const acceptUrl = `${env.STAFF_APP_URL}/staff/accept-invite?token=${token}`;
  const { subject, html } = staffInviteEmail(input.name, acceptUrl);
  await sendMail({ to: input.email, subject, html });

  return user;
}

// ── Shared password reset (staff + customer) ────────────────────────────

// env.STAFF_APP_URL is really just "the frontend's base origin" despite the
// name — the frontend is one SPA serving both customer and staff routes —
// so it's reused as-is for customer links too, no separate env var needed.
export async function forgotPassword(email: string, resetPathPrefix: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return; // don't leak whether the email exists

  const token = generateRefreshTokenValue();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_HOURS * 60 * 60 * 1000),
    },
  });

  const resetUrl = `${env.STAFF_APP_URL}${resetPathPrefix}?token=${token}`;
  const { subject, html } = resetPathPrefix.startsWith("/staff")
    ? passwordResetEmail(user.name ?? "", resetUrl)
    : customerPasswordResetEmail(user.name ?? "", resetUrl);
  await sendMail({ to: email, subject, html });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!resetToken) throw new BadRequestError("Invalid or expired reset link.");
  if (resetToken.consumedAt) throw new BadRequestError("This reset link has already been used.");
  if (resetToken.expiresAt < new Date()) throw new BadRequestError("This reset link has expired.");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.refreshToken.updateMany({
      where: { userId: resetToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);
}

// ── Shared session management ────────────────────────────────────────────

export async function rotateRefreshToken(refreshToken: string, meta: SessionMeta): Promise<TokenPair> {
  const tokenHash = hashToken(refreshToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!existing) throw new UnauthorizedError("Invalid refresh token.");

  if (existing.revokedAt) {
    // Reuse of an already-rotated token: possible theft — kill the whole session family.
    await prisma.refreshToken.updateMany({
      where: { userId: existing.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw new UnauthorizedError("Session invalidated. Please log in again.");
  }

  if (existing.expiresAt < new Date()) throw new UnauthorizedError("Refresh token expired. Please log in again.");

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user) throw new UnauthorizedError("User no longer exists.");
  if (user.status === "BLOCKED" || user.status === "SUSPENDED") throw new ForbiddenError("Account is blocked.");

  const newAccessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshTokenValue = generateRefreshTokenValue();

  const newRow = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(newRefreshTokenValue),
      userAgent: meta.userAgent,
      createdByIp: meta.ip,
      expiresAt: refreshTokenExpiry(),
    },
  });

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), replacedById: newRow.id },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshTokenValue };
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function logoutAll(userId: number): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
