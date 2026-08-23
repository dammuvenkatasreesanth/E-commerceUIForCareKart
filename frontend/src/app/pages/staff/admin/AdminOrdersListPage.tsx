import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Download, Eye, Truck } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useAdminOrders, useSchedulePickup } from "../../../hooks/admin/useAdminOrders";
import { exportOrdersCsv, type AdminOrderListQuery } from "../../../lib/api/endpoints/admin/orders";
import { downloadBlob } from "../../../lib/download";
import type { AdminOrder } from "../../../types/admin";
import type { OrderStatus, PaymentStatus } from "../../../types/order";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"];

function humanize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function AdminOrdersListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");

  const query: AdminOrderListQuery = {
    q: q || undefined,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
    page,
    limit: 20,
  };

  const { data, isLoading } = useAdminOrders(query);
  const schedulePickup = useSchedulePickup();

  const handleExport = async () => {
    try {
      const blob = await exportOrdersCsv(query);
      downloadBlob(blob, "orders-export.csv");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleSchedulePickup = () => {
    schedulePickup.mutate(undefined, {
      onSuccess: (result) => toast.success(result.pickupId ? `Pickup scheduled (ID: ${result.pickupId})` : "Pickup request sent to Delhivery"),
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  };

  const goToOrder = (o: AdminOrder) => navigate(`/staff/admin/orders/${o.id}`);

  const columns: DataTableColumn<AdminOrder>[] = [
    {
      key: "orderNumber",
      header: "Order",
      render: (o) => <span className="font-mono font-semibold text-sm">{o.orderNumber}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      render: (o) => (
        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[180px]">{o.user.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{o.user.phone ?? "—"}</p>
        </div>
      ),
    },
    { key: "date", header: "Date", render: (o) => new Date(o.createdAt).toLocaleDateString() },
    { key: "total", header: "Total", render: (o) => <span className="font-semibold">₹{Number(o.totalAmount).toLocaleString()}</span> },
    { key: "status", header: "Status", render: (o) => <StatusBadge status={o.status} /> },
    { key: "paymentStatus", header: "Payment", render: (o) => <StatusBadge status={o.paymentStatus} /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Orders</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSchedulePickup}
            disabled={schedulePickup.isPending}
            className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl disabled:opacity-50"
          >
            <Truck className="w-3.5 h-3.5" />{schedulePickup.isPending ? "Scheduling…" : "Schedule Delhivery Pickup"}
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl">
            <Download className="w-3.5 h-3.5" />Export CSV
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyField={(o) => o.id}
        isLoading={isLoading}
        emptyMessage="No orders found"
        searchValue={q}
        onSearchChange={(v) => { setQ(v); setPage(1); }}
        searchPlaceholder="Search order number, customer…"
        filters={
          <>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as OrderStatus | ""); setPage(1); }}
              className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => { setPaymentStatus(e.target.value as PaymentStatus | ""); setPage(1); }}
              className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none"
            >
              <option value="">All Payments</option>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
            </select>
          </>
        }
        pagination={data ? { page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit, onPageChange: setPage } : undefined}
        onRowClick={goToOrder}
        rowActions={(o) => (
          <button onClick={() => goToOrder(o)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      />
    </div>
  );
}
