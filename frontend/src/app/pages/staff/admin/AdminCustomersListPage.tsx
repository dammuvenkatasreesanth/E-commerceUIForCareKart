import { useState } from "react";
import { useNavigate } from "react-router";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useAdminCustomers } from "../../../hooks/admin/useAdminCustomers";
import type { AdminCustomerListItem } from "../../../types/admin";
import type { AccountType, GstStatus } from "../../../types/user";

export function AdminCustomersListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [accountType, setAccountType] = useState<AccountType | "">("");
  const [gstStatus, setGstStatus] = useState<GstStatus | "">("");
  const { data, isLoading } = useAdminCustomers({
    q: q || undefined,
    accountType: accountType || undefined,
    gstStatus: gstStatus || undefined,
    page,
    limit: 20,
  });

  const columns: DataTableColumn<AdminCustomerListItem>[] = [
    {
      key: "name",
      header: "Customer",
      render: (c) => (
        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[200px]">{c.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{c.accountType === "BUSINESS" ? "Business" : "Retail"}</p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (c) => (
        <div className="min-w-0">
          <p className="truncate max-w-[200px]">{c.phone ?? "—"}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{c.email ?? "—"}</p>
        </div>
      ),
    },
    { key: "gstStatus", header: "GST Status", render: (c) => <StatusBadge status={c.gstStatus} /> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "orders", header: "Orders", render: (c) => c._count.orders },
    { key: "createdAt", header: "Joined", render: (c) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Customers</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyField={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No customers found"
        searchValue={q}
        onSearchChange={(v) => { setQ(v); setPage(1); }}
        searchPlaceholder="Search name, phone, email, GSTIN…"
        filters={
          <>
            <select
              value={accountType}
              onChange={(e) => { setAccountType(e.target.value as AccountType | ""); setPage(1); }}
              className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none"
            >
              <option value="">All Account Types</option>
              <option value="RETAIL">Retail</option>
              <option value="BUSINESS">Business</option>
            </select>
            <select
              value={gstStatus}
              onChange={(e) => { setGstStatus(e.target.value as GstStatus | ""); setPage(1); }}
              className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none"
            >
              <option value="">All GST Statuses</option>
              <option value="NONE">None</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </>
        }
        pagination={data ? { page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit, onPageChange: setPage } : undefined}
        onRowClick={(c) => navigate(`/staff/admin/customers/${c.id}`)}
      />
    </div>
  );
}
