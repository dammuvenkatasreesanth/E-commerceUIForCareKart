import { useState } from "react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, ShoppingCart, Users, Tag, Clock } from "lucide-react";
import { DataTable } from "../../../components/common/DataTable";
import { useSalesTrend, usePendingOrderAlerts } from "../../../hooks/admin/useAdminReports";
import { exportSalesCsv, exportCustomersCsv, exportCouponsCsv } from "../../../lib/api/endpoints/admin/reports";
import { downloadBlob } from "../../../lib/download";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

const EXPORTS = [
  {
    key: "sales",
    label: "Sales Report",
    icon: ShoppingCart,
    description: "Every order counted toward revenue (confirmed onward) — order number, customer, status, total, and when it was placed.",
    fetch: exportSalesCsv,
    filename: "sales-report.csv",
  },
  {
    key: "customers",
    label: "Customers Report",
    icon: Users,
    description: "Every customer account — contact details, account type, GST status, order count, and join date.",
    fetch: exportCustomersCsv,
    filename: "customers-report.csv",
  },
  {
    key: "coupons",
    label: "Coupons Report",
    icon: Tag,
    description: "Every coupon — type, value, usage against its max, active status, and expiry.",
    fetch: exportCouponsCsv,
    filename: "coupons-report.csv",
  },
] as const;

export function AdminReportsPage() {
  const { data: trend } = useSalesTrend(30);
  const { data: pendingOrders, isLoading: pendingLoading } = usePendingOrderAlerts();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (exportDef: (typeof EXPORTS)[number]) => {
    setDownloading(exportDef.key);
    try {
      const blob = await exportDef.fetch();
      downloadBlob(blob, exportDef.filename);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Reports</h1>

      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-sm mb-4">Sales Trend (30 days)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} labelFormatter={(d: string) => new Date(d).toLocaleDateString()} />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-sm mb-3">Export Reports</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {EXPORTS.map((exportDef) => (
            <div key={exportDef.key} className="bg-white border border-border rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <exportDef.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{exportDef.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">{exportDef.description}</p>
                <button
                  onClick={() => handleExport(exportDef)}
                  disabled={downloading === exportDef.key}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold rounded-xl disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading === exportDef.key ? "Downloading…" : "Download CSV"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />Pending Orders</h2>
        <DataTable
          columns={[
            { key: "order", header: "Order", render: (o) => <span className="font-mono font-medium">{o.orderNumber}</span> },
            { key: "customer", header: "Customer", render: (o) => o.user.name ?? o.user.phone ?? "—" },
            { key: "total", header: "Total", render: (o) => `₹${Number(o.totalAmount).toLocaleString()}` },
            { key: "placed", header: "Placed", render: (o) => new Date(o.createdAt).toLocaleDateString() },
          ]}
          data={pendingOrders ?? []}
          keyField={(o) => o.id}
          isLoading={pendingLoading}
          emptyMessage="No pending orders"
        />
      </div>
    </div>
  );
}
