import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env";
import type { Role } from "@prisma/client";

export interface AccessTokenPayload {
  sub: number;
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as AccessTokenPayload;
}

export function generateRefreshTokenValue(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiry(): Date {
  const days = env.JWT_REFRESH_TTL_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
