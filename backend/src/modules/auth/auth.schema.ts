import { z } from "zod";

export const customerSignupSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8),
});

export const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(10),
});

export const facebookLoginSchema = z.object({
  accessToken: z.string().min(10),
  userId: z.string().min(1),
});

export const staffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const staffAcceptInviteSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export const staffForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const staffResetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});
