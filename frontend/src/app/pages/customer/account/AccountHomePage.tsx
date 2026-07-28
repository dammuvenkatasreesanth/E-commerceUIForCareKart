import { useNavigate } from "react-router";
import { BadgeCheck, Building2, ChevronRight, Edit2, Eye, Heart, LogOut, MapPin, Package } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useAuth } from "../../../context/AuthContext";
import { useOrders } from "../../../hooks/useOrders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../../lib/orderStatus";

export function AccountHomePage() {
  const navigate = useNavigate();
  const { user, status, logout } = useAuth();
  const { data: orders } = useOrders();

  if (status !== "authenticated" || !user) return null;

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  const navCards = [
    { icon: Package, label: "Your Orders", sub: "Track & manage", action: () => navigate("/account/orders"), color: "bg-blue-50 text-blue-600" },
    { icon: MapPin, label: "Addresses", sub: "Delivery addresses", action: () => navigate("/account/addresses"), color: "bg-emerald-50 text-emerald-600" },
    { icon: Heart, label: "Wishlist", sub: "Saved products", action: () => navigate("/account/wishlist"), color: "bg-pink-50 text-pink-600" },
    { icon: Building2, label: "Business Info", sub: "GST & company", action: () => navigate("/account/business"), color: "bg-purple-50 text-purple-600" },
    { icon: LogOut, label: "Sign Out", sub: "Log out safely", action: handleSignOut, color: "bg-red-50 text-red-500" },
  ];

  return (
    <div>
      {/* Profile hero card */}
      <div className="bg-primary rounded-2xl p-5 text-white mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] truncate">{user.name}</h1>
            <p className="text-sm text-blue-200">{user.phone}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.accountType === "BUSINESS" ? "bg-yellow-400/20 text-yellow-300" : "bg-white/10 text-white/70"}`}>
                {user.accountType === "BUSINESS" ? "🏢 Business Account" : "👤 Retail Account"}
              </span>
              {user.gstin && user.gstStatus === "PENDING" && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300">Pending approval</span>}
              {user.gstin && <BadgeCheck className="w-4 h-4 text-blue-300" />}
            </div>
          </div>
          <button onClick={() => navigate("/account/edit-profile")} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-semibold text-white transition-colors">
            <Edit2 className="w-3.5 h-3.5" />Edit
          </button>
        </div>
        {user.email && <p className="text-xs text-blue-300 mt-2 pl-[72px]">{user.email}</p>}
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {navCards.map(item => (
          <button key={item.label} onClick={item.action} className="bg-white border border-border rounded-2xl p-4 text-left hover:shadow-md transition-all group">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-sm">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </button>
        ))}
      </div>

      {/* Quick recent order preview */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-sm">Recent Order</h2>
          <button onClick={() => navigate("/account/orders")} className="text-xs text-primary font-semibold flex items-center gap-1">View all<ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        {orders && orders.length > 0 ? (
          (() => {
            const o = orders[0];
            return (
              <div>
                <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border text-xs">
                  <div className="flex gap-4">
                    <div><p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wide">Order ID</p><p className="font-mono font-bold">{o.orderNumber}</p></div>
                    <div><p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wide">Date</p><p className="font-semibold">{new Date(o.createdAt).toLocaleDateString()}</p></div>
                    <div><p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wide">Total</p><p className="font-extrabold">₹{Number(o.totalAmount).toLocaleString()}</p></div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${ORDER_STATUS_COLORS[o.status]}`}>{ORDER_STATUS_LABELS[o.status]}</span>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <ImageWithFallback src={o.items[0]?.imageUrl ?? undefined} alt={o.items[0]?.productName ?? ""} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{o.items[0]?.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {o.items[0]?.quantity}{o.items.length > 1 ? ` + ${o.items.length - 1} more` : ""}</p>
                  </div>
                  <button onClick={() => navigate(`/account/orders/${o.id}`)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
                    <Eye className="w-3.5 h-3.5" />Track
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">No orders yet</div>
        )}
      </div>
    </div>
  );
}
