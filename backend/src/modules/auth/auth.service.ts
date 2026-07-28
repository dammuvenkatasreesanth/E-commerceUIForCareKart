import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  signAccessToken,
  generateRefreshTokenValue,
  hashToken,
  refreshTokenExpiry,
} from "../../lib/jwt";
import { BadRequestError, ConflictError, ForbiddenError, UnauthorizedError } from "../../lib/errors";
import { smsProvider } from "../../providers/sms";
import { sendMail } from "../../providers/email/mailer";
import { passwordResetEmail, staffInviteEmail } from "../../providers/email/templates/staffAuth";
import { env } from "../../config/env";
import {
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MINUTES,
  PASSWORD_RESET_TTL_HOURS,
  STAFF_INVITE_TTL_HOURS,
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

function generateOtpCode(): string {
  const max = 10 ** OTP_LENGTH;
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(OTP_LENGTH, "0");
}

// ── Customer: phone + OTP ─────────────────────────────────────────────────

export async function requestCustomerOtp(phone: string): Promise<void> {
  const code = generateOtpCode();
  const codeHash = hashToken(code);

  await prisma.otpRequest.create({
    data: {
      phone,
      purpose: "LOGIN",
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    },
  });

  await smsProvider.sendOtp(phone, code);
}

export async function verifyCustomerOtp(
  phone: string,
  code: string,
  meta: SessionMeta,
): Promise<TokenPair & { isNewUser: boolean; user: User }> {
  const otpRequest = await prisma.otpRequest.findFirst({
    where: { phone, purpose: "LOGIN", consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRequest) throw new BadRequestError("No OTP request found. Please request a new code.");
  if (otpRequest.expiresAt < new Date()) throw new BadRequestError("OTP has expired. Please request a new code.");
  if (otpRequest.attempts >= OTP_MAX_ATTEMPTS) {
    throw new BadRequestError("Too many incorrect attempts. Please request a new code.");
  }

  if (otpRequest.codeHash !== hashToken(code)) {
    await prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { attempts: { increment: 1 } },
    });
    throw new BadRequestError("Incorrect OTP code.");
  }

  await prisma.otpRequest.update({ where: { id: otpRequest.id }, data: { consumedAt: new Date() } });

  let user = await prisma.user.findUnique({ where: { phone } });
  let isNewUser = false;

  if (!user) {
    user = await prisma.user.create({ data: { phone, role: "CUSTOMER", status: "ACTIVE" } });
    isNewUser = true;
  } else if (user.status === "BLOCKED" || user.status === "SUSPENDED") {
    throw new ForbiddenError("This account has been blocked or suspended.");
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const tokens = await issueSession(user.id, user.role, meta);
  return { ...tokens, isNewUser, user };
}

export async function requestPhoneChangeOtp(userId: number, newPhone: string): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { phone: newPhone } });
  if (existing && existing.id !== userId) {
    throw new BadRequestError("This phone number is already in use.");
  }

  const code = generateOtpCode();
  await prisma.otpRequest.create({
    data: {
      phone: newPhone,
      purpose: "PHONE_CHANGE",
      codeHash: hashToken(code),
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
      userId,
    },
  });
  await smsProvider.sendOtp(newPhone, code);
}

export async function verifyPhoneChangeOtp(userId: number, newPhone: string, code: string): Promise<User> {
  const otpRequest = await prisma.otpRequest.findFirst({
    where: { phone: newPhone, purpose: "PHONE_CHANGE", consumedAt: null, userId },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRequest) throw new BadRequestError("No OTP request found. Please request a new code.");
  if (otpRequest.expiresAt < new Date()) throw new BadRequestError("OTP has expired. Please request a new code.");
  if (otpRequest.attempts >= OTP_MAX_ATTEMPTS) {
    throw new BadRequestError("Too many incorrect attempts. Please request a new code.");
  }
  if (otpRequest.codeHash !== hashToken(code)) {
    await prisma.otpRequest.update({ where: { id: otpRequest.id }, data: { attempts: { increment: 1 } } });
    throw new BadRequestError("Incorrect OTP code.");
  }

  await prisma.otpRequest.update({ where: { id: otpRequest.id }, data: { consumedAt: new Date() } });
  return prisma.user.update({ where: { id: userId }, data: { phone: newPhone } });
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

export async function staffForgotPassword(email: string): Promise<void> {
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

  const resetUrl = `${process.env.STAFF_APP_URL ?? "http://localhost:5173"}/staff/reset-password?token=${token}`;
  const { subject, html } = passwordResetEmail(user.name ?? "", resetUrl);
  await sendMail({ to: email, subject, html });
}

export async function staffResetPassword(token: string, password: string): Promise<void> {
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
