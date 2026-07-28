import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useEmployeeCustomer } from "../../../hooks/useEmployee";

export function EmployeeCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);
  const { data: customer, isLoading } = useEmployeeCustomer(Number.isFinite(customerId) ? customerId : undefined);

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm mb-4">Customer not found</p>
        <button onClick={() => navigate("/staff/employee")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Back to Customers</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate("/staff/employee")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft className="w-4 h-4" />Back to Customers
      </button>

      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{customer.name ?? "Unnamed Customer"}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>{customer.phone ?? "—"}</span>
            <span>{customer.email ?? "—"}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{customer.accountType === "BUSINESS" ? "Business" : "Retail"}</span>
            <StatusBadge status={customer.gstStatus} />
            <StatusBadge status={customer.status} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3">GST Registration</h2>
          {customer.gstin ? (
            <p className="text-sm font-mono">{customer.gstin}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No GSTIN on file</p>
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3">Overview</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground">Total Orders</p>
              <p className="font-extrabold mt-0.5">{customer._count.orders}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground">Joined</p>
              <p className="font-semibold mt-0.5">{new Date(customer.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" />Saved Addresses</h2>
          {customer.addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No saved addresses</p>
          ) : (
            <div className="space-y-3">
              {customer.addresses.map((a) => (
                <div key={a.id} className="p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    {a.label && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.label}</span>}
                    {a.isDefault && <span className="flex items-center gap-1 text-xs font-bold text-primary"><Star className="w-3 h-3 fill-primary" />Default</span>}
                  </div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.line1}, {a.city}, {a.state} {a.pincode}</p>
                  <p className="text-xs text-muted-foreground">{a.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4">Recent Orders</h2>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {customer.orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => navigate(`/staff/employee/orders/${o.id}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-medium">{o.orderNumber}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-xs font-bold">₹{Number(o.totalAmount).toLocaleString()}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
