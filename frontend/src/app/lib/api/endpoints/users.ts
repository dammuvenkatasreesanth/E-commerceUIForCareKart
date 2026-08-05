import { api } from "../client";
import type { AuthUser, AccountType } from "../../../types/user";

export function getMe(): Promise<AuthUser> {
  return api.get("/users/me");
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  accountType?: AccountType;
  gstin?: string;
}

export function updateProfile(input: UpdateProfileInput): Promise<AuthUser> {
  return api.patch("/users/me", input);
}
