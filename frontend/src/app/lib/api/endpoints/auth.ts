import { api } from "../client";
import type { AuthUser } from "../../../types/user";

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export function customerSignup(name: string, email: string, password: string): Promise<{ message: string }> {
  return api.post("/auth/signup", { name, email, password });
}

export function customerLogin(email: string, password: string): Promise<AuthResponse> {
  return api.post("/auth/login", { email, password });
}

export function verifyEmail(token: string): Promise<AuthResponse & { isNewUser: boolean }> {
  return api.post("/auth/verify-email", { token });
}

export function resendVerification(email: string): Promise<{ message: string }> {
  return api.post("/auth/resend-verification", { email });
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return api.post("/auth/forgot-password", { email });
}

export function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return api.post("/auth/reset-password", { token, password });
}

export function googleLogin(idToken: string): Promise<AuthResponse & { isNewUser: boolean }> {
  return api.post("/auth/google", { idToken });
}

export function facebookLogin(accessToken: string, userId: string): Promise<AuthResponse & { isNewUser: boolean }> {
  return api.post("/auth/facebook", { accessToken, userId });
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
