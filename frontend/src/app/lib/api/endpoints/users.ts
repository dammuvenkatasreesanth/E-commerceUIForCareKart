import { api } from "../client";
import type { AuthUser, AccountType } from "../../../types/user";

export function getMe(): Promise<AuthUser> {
  return api.get("/users/me");
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  accountType?: AccountType;
  gstin?: string;
}

export function updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
  return api.patch("/users/me", input);
}

export function requestPhoneChangeOtp(newPhone: string): Promise<{ message: string }> {
  return api.post("/users/me/phone/request-otp", { newPhone });
}

export function verifyPhoneChangeOtp(newPhone: string, code: string): Promise<AuthUser> {
  return api.post("/users/me/phone/verify-otp", { newPhone, code });
}
