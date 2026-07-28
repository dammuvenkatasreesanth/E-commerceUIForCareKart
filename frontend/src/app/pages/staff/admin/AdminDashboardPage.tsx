import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { IndianRupee, ShoppingCart, Users, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useDashboardKpis, useSalesTrend, usePendingOrderAlerts } from "../../../hooks/admin/useAdminReports";

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof IndianRupee; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4">
      <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-4.5 h-4.5 text-primary" />
      </div>
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: kpis, isLoading: kpisLoading } = useDashboardKpis();
  const { data: trend } = useSalesTrend(30);
  const { data: pendingOrders } = usePendingOrderAlerts();

  if (kpisLoading || !kpis) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  const growth = kpis.revenueGrowthPct;

  return (
    <div>
      <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Kpi icon={IndianRupee} label="Total Revenue" value={`₹${kpis.totalRevenue.toLocaleString()}`} sub={`₹${kpis.thisMonthRevenue.toLocaleString()} this month`} />
        <Kpi icon={ShoppingCart} label="Total Orders" value={kpis.totalOrders.toLocaleString()} sub={`${kpis.ordersToday} today`} />
        <Kpi icon={Users} label="Customers" value={kpis.totalCustomers.toLocaleString()} />
        <Kpi icon={growth !== null && growth < 0 ? TrendingDown : TrendingUp} label="Revenue Growth" value={growth === null ? "—" : `${growth > 0 ? "+" : ""}${growth}%`} sub="vs. last month" />
      </div>

      <div className="bg-white border border-border rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-sm mb-4">Sales Trend (30 days)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} labelFormatter={(d: string) => new Date(d).toLocaleDateString()} />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />Pending Orders</h2>
        {(pendingOrders ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No pending orders</p>
        ) : (
          <div className="space-y-2">
            {(pendingOrders ?? []).map((o) => (
              <div key={o.id} onClick={() => navigate(`/staff/admin/orders/${o.id}`)} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted cursor-pointer">
                <p className="text-sm font-mono font-medium">{o.orderNumber}</p>
                <span className="text-xs font-bold text-foreground flex-shrink-0 ml-2">₹{Number(o.totalAmount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
