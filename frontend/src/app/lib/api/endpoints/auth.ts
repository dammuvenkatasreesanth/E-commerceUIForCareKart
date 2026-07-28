import { api } from "../client";
import type { AuthUser } from "../../../types/user";

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export function requestOtp(phone: string): Promise<{ message: string }> {
  return api.post("/auth/otp/request", { phone });
}

export function verifyOtp(phone: string, code: string): Promise<AuthResponse & { isNewUser: boolean }> {
  return api.post("/auth/otp/verify", { phone, code });
}

export function staffLogin(email: string, password: string): Promise<AuthResponse> {
  return api.post("/auth/staff/login", { email, password });
}

export function staffAcceptInvite(token: string, password: string): Promise<AuthResponse> {
  return api.post("/auth/staff/accept-invite", { token, password });
}

export function staffForgotPassword(email: string): Promise<{ message: string }> {
  return api.post("/auth/staff/forgot-password", { email });
}

export function staffResetPassword(token: string, password: string): Promise<{ message: string }> {
  return api.post("/auth/staff/reset-password", { token, password });
}

export function refreshSession(): Promise<{ accessToken: string }> {
  return api.post("/auth/refresh");
}

export function logout(): Promise<void> {
  return api.post("/auth/logout");
}

export function logoutAll(): Promise<void> {
  return api.post("/auth/logout-all");
}
