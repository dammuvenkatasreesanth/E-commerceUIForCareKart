import { api, buildQuery } from "../../client";
import type { StaffMember, AuditLogEntry, Paginated, StaffStatus } from "../../../../types/admin";
import type { Role } from "../../../../types/user";

export function listStaff(): Promise<StaffMember[]> {
  return api.get("/admin/staff");
}

export function inviteStaff(
  input: { email: string; name: string; role: Extract<Role, "ADMIN" | "EMPLOYEE"> },
): Promise<{ id: number; email: string; name: string; role: Role; status: StaffStatus }> {
  return api.post("/admin/staff", input);
}

export function updateStaffRole(id: number, role: Role): Promise<StaffMember> {
  return api.patch(`/admin/staff/${id}/role`, { role });
}

export function updateStaffStatus(id: number, status: StaffStatus): Promise<StaffMember> {
  return api.patch(`/admin/staff/${id}/status`, { status });
}

export interface AuditLogQuery {
  actorId?: number;
  entityType?: string;
  page?: number;
  limit?: number;
}

export function listAuditLog(query: AuditLogQuery = {}): Promise<Paginated<AuditLogEntry>> {
  return api.get(`/admin/audit-log${buildQuery(query as Record<string, string | number | boolean | undefined | null>)}`);
}
