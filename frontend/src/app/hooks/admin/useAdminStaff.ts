import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../lib/api/endpoints/admin/staff";

const STAFF_KEY = ["admin", "staff"];
const AUDIT_KEY = ["admin", "audit-log"];

export function useStaffList() {
  return useQuery({ queryKey: STAFF_KEY, queryFn: api.listStaff });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.inviteStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export function useUpdateStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: Parameters<typeof api.updateStaffRole>[1] }) => api.updateStaffRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export function useUpdateStaffStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Parameters<typeof api.updateStaffStatus>[1] }) => api.updateStaffStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export function useAuditLog(query: api.AuditLogQuery = {}) {
  return useQuery({ queryKey: [...AUDIT_KEY, query], queryFn: () => api.listAuditLog(query) });
}
