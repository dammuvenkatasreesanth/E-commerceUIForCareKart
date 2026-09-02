import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Download, Eye, RefreshCw, Package } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useOrders, useReorder, downloadInvoice } from "../../../hooks/useOrders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "../../../lib/orderStatus";

export function OrdersListPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div>
      <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Profile</button>
      <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-4">Your Orders</h2>
      {(orders ?? []).length === 0 ? (
        <div className="text-center py-16 bg-white border border-border rounded-2xl">
          <Package className="w-10 h-10 mx-auto mb-2 text-border" />
          <p className="text-muted-foreground text-sm mb-4">You haven't placed any orders yet</p>
          <button onClick={() => navigate("/products")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-3">
          {(orders ?? []).map((order) => (
            <OrderCard key={order.id} order={order} onView={() => navigate(`/account/orders/${order.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onView }: { order: import("../../../types/order").Order; onView: () => void }) {
  const reorderMutation = useReorder(order.id);
  const navigate = useNavigate();

  const handleReorder = () => {
    reorderMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.added.length > 0) toast.success(`Added ${result.added.length} item${result.added.length > 1 ? "s" : ""} to your cart`);
        if (result.skipped.length > 0) toast.warning(`Couldn't add: ${result.skipped.join(", ")}`);
        navigate("/cart");
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleInvoice = () => {
    downloadInvoice(order.id, order.orderNumber).catch((err: Error) => toast.error(err.message));
  };

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-4 text-xs">
          <div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Order ID</p><p className="font-mono font-bold text-foreground">{order.orderNumber}</p></div>
          <div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Date</p><p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p></div>
          <div><p className="font-bold text-[10px] uppercase tracking-wide text-muted-foreground">Total</p><p className="font-extrabold">₹{Number(order.totalAmount).toLocaleString()}</p></div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>
      <div className="p-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 mb-3 last:mb-0">
            <ImageWithFallback src={item.imageUrl ?? undefined} alt={item.productName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate">{item.productName}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p><p className="text-sm font-bold">₹{Number(item.lineTotal).toLocaleString()}</p></div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <button onClick={onView} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Eye className="w-3.5 h-3.5" />View Details</button>
        {/* No real sale to invoice when the payment was never completed — see OrderDetailPage.tsx. */}
        {!(order.status === "CANCELLED" && order.paymentStatus === "FAILED") && (
          <button onClick={handleInvoice} className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl"><Download className="w-3.5 h-3.5" />Invoice</button>
        )}
        <button onClick={handleReorder} disabled={reorderMutation.isPending} className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl disabled:opacity-50"><RefreshCw className="w-3.5 h-3.5" />{reorderMutation.isPending ? "Adding…" : "Reorder"}</button>
      </div>
    </div>
  );
}
