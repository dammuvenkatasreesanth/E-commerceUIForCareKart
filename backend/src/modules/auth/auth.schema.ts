import { z } from "zod";
import { PHONE_REGEX } from "../../config/constants";

export const otpRequestSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, "Enter a valid phone number"),
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(PHONE_REGEX),
  code: z.string().length(6),
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
