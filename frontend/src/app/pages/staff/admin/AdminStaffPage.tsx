import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import { useStaffList, useInviteStaff, useUpdateStaffRole, useUpdateStaffStatus, useAuditLog } from "../../../hooks/admin/useAdminStaff";
import { useAuth } from "../../../context/AuthContext";
import type { StaffMember, StaffStatus, AuditLogEntry } from "../../../types/admin";
import type { Role } from "../../../types/user";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

type StaffRole = Extract<Role, "ADMIN" | "EMPLOYEE">;
const STAFF_ROLES: StaffRole[] = ["ADMIN", "EMPLOYEE"];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-purple-50 text-purple-700",
  EMPLOYEE: "bg-blue-50 text-blue-700",
};

function roleLabel(role: Role): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function RoleBadge({ role }: { role: Role }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap ${ROLE_BADGE[role] ?? "bg-muted text-muted-foreground"}`}>{roleLabel(role)}</span>;
}

const emptyInvite = (): { email: string; name: string; role: StaffRole } => ({ email: "", name: "", role: "EMPLOYEE" });

function StaffTab() {
  const { user } = useAuth();
  const { data, isLoading } = useStaffList();
  const inviteStaff = useInviteStaff();
  const updateRole = useUpdateStaffRole();
  const updateStatus = useUpdateStaffStatus();

  const [q, setQ] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState(emptyInvite());
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    const staff = data ?? [];
    if (!q.trim()) return staff;
    const needle = q.trim().toLowerCase();
    return staff.filter((s) => (s.name ?? "").toLowerCase().includes(needle) || (s.email ?? "").toLowerCase().includes(needle));
  }, [data, q]);

  const handleInvite = async () => {
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) {
      toast.error("Please provide both name and email");
      return;
    }
    setIsSaving(true);
    try {
      const staff = await inviteStaff.mutateAsync(inviteForm);
      toast.success(`Invitation sent to ${staff.email}`);
      setShowInvite(false);
      setInviteForm(emptyInvite());
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleChange = async (staffMember: StaffMember, role: Role) => {
    if (role === staffMember.role) return;
    try {
      await updateRole.mutateAsync({ id: staffMember.id, role });
      toast.success("Role updated");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleStatusChange = async (staffMember: StaffMember, status: StaffStatus) => {
    if (status === staffMember.status) return;
    try {
      await updateStatus.mutateAsync({ id: staffMember.id, status });
      toast.success("Status updated");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const columns: DataTableColumn<StaffMember>[] = [
    {
      key: "name",
      header: "Staff Member",
      render: (s) => (
        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[200px]">{s.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{s.email ?? "—"}</p>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (s) => <RoleBadge role={s.role} /> },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
    {
      key: "claimedAt",
      header: "Invite Status",
      render: (s) =>
        s.claimedAt ? (
          <span className="text-xs text-muted-foreground">{new Date(s.claimedAt).toLocaleDateString()}</span>
        ) : (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap bg-amber-50 text-amber-700">Pending</span>
        ),
    },
    {
      key: "lastLoginAt",
      header: "Last Login",
      render: (s) => (s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString() : "—"),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={filtered}
        keyField={(s) => s.id}
        isLoading={isLoading}
        emptyMessage="No staff members found"
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder="Search name, email…"
        headerActions={
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
            <Plus className="w-3.5 h-3.5" />Invite Staff
          </button>
        }
        rowActions={(s) => (
          <div className="flex items-center gap-1.5">
            <select
              value={s.role}
              onChange={(e) => handleRoleChange(s, e.target.value as Role)}
              className="px-2 py-1 bg-muted rounded-lg border border-transparent text-[11px] font-semibold focus:outline-none"
              title="Change role"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </select>
            <select
              value={s.status}
              onChange={(e) => handleStatusChange(s, e.target.value as StaffStatus)}
              disabled={s.id === user?.id}
              className="px-2 py-1 bg-muted rounded-lg border border-transparent text-[11px] font-semibold focus:outline-none disabled:opacity-40"
              title={s.id === user?.id ? "You cannot change your own status" : "Change status"}
            >
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspend</option>
              <option value="BLOCKED">Block</option>
            </select>
          </div>
        )}
      />

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Name</label>
              <input
                value={inviteForm.name}
                onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Role</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm((f) => ({ ...f, role: e.target.value as StaffRole }))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {roleLabel(r)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowInvite(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">
              Cancel
            </button>
            <button onClick={handleInvite} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {isSaving ? "Sending…" : "Send Invite"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AuditLogTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLog({ page, limit: 20 });

  const columns: DataTableColumn<AuditLogEntry>[] = [
    {
      key: "actor",
      header: "Actor",
      render: (e) => (
        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[180px]">{e.actor?.name ?? e.actor?.email ?? "System"}</p>
          {e.actor?.email && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{e.actor.email}</p>}
        </div>
      ),
    },
    { key: "action", header: "Action", render: (e) => <span className="font-mono text-xs">{e.action}</span> },
    {
      key: "entity",
      header: "Entity",
      render: (e) => (e.entityType ? <span className="text-xs">{e.entityType} #{e.entityId}</span> : <span className="text-xs text-muted-foreground">—</span>),
    },
    {
      key: "metadata",
      header: "Metadata",
      render: (e) => <span className="text-xs text-muted-foreground truncate block max-w-[260px]">{e.metadata ? JSON.stringify(e.metadata) : "—"}</span>,
    },
    { key: "createdAt", header: "Timestamp", render: (e) => new Date(e.createdAt).toLocaleString() },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      keyField={(e) => e.id}
      isLoading={isLoading}
      emptyMessage="No audit log entries found"
      pagination={data ? { page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit, onPageChange: setPage } : undefined}
    />
  );
}

export function AdminStaffPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Staff Management</h1>
      </div>

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        <TabsContent value="staff" className="mt-4">
          <StaffTab />
        </TabsContent>
        <TabsContent value="audit" className="mt-4">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
