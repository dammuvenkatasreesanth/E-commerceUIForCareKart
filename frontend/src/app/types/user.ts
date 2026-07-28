export type Role = "CUSTOMER" | "ADMIN" | "EMPLOYEE";
export type AccountType = "RETAIL" | "BUSINESS";
export type GstStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export interface AuthUser {
  id: number;
  role: Role;
  name: string | null;
  phone: string | null;
  email: string | null;
  accountType: AccountType;
  gstin: string | null;
  gstStatus: GstStatus;
}

export const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

export function isStaffRole(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}

export function staffPortalHome(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/staff/admin";
    case "EMPLOYEE":
      return "/staff/employee";
    default:
      return "/staff/login";
  }
}
