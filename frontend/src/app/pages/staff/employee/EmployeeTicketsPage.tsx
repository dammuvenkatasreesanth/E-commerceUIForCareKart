import { useState } from "react";
import { useNavigate } from "react-router";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useTickets } from "../../../hooks/useEmployee";
import type { SupportTicketListItem, TicketStatus } from "../../../types/support";

const TICKET_STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function humanize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

export function EmployeeTicketsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TicketStatus | "">("");

  const { data, isLoading } = useTickets({ status: status || undefined, page, limit: 20 });

  const goToTicket = (t: SupportTicketListItem) => navigate(`/staff/employee/tickets/${t.id}`);

  const columns: DataTableColumn<SupportTicketListItem>[] = [
    { key: "ticketNumber", header: "Ticket", render: (t) => <span className="font-mono font-semibold text-sm">{t.ticketNumber}</span> },
    {
      key: "subject",
      header: "Subject",
      render: (t) => <span className="truncate max-w-[220px] inline-block">{t.subject}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      render: (t) => (
        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[180px]">{t.user.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{t.user.phone ?? "—"}</p>
        </div>
      ),
    },
    { key: "priority", header: "Priority", render: (t) => <StatusBadge status={t.priority} /> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "assignedTo", header: "Assigned To", render: (t) => t.assignedTo?.name ?? "Unassigned" },
    { key: "createdAt", header: "Created", render: (t) => new Date(t.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Support Tickets</h1>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyField={(t) => t.id}
        isLoading={isLoading}
        emptyMessage="No tickets found"
        filters={
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as TicketStatus | ""); setPage(1); }}
            className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none"
          >
            <option value="">All Statuses</option>
            {TICKET_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
          </select>
        }
        pagination={data ? { page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit, onPageChange: setPage } : undefined}
        onRowClick={goToTicket}
      />
    </div>
  );
}
