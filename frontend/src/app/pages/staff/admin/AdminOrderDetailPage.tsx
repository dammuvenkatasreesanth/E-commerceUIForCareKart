import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Package, User, MapPin, History, StickyNote, RotateCcw, Truck, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useAdminOrder, useUpdateOrderStatus, useInitiateRefund, useRefreshShipmentTracking } from "../../../hooks/admin/useAdminOrders";
import type { OrderStatus } from "../../../types/order";

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

function humanize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

export function AdminOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useAdminOrder(Number.isFinite(orderId) ? orderId : undefined);

  const updateStatus = useUpdateOrderStatus();
  const initiateRefund = useInitiateRefund();
  const refreshTracking = useRefreshShipmentTracking();

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusValue, setStatusValue] = useState<OrderStatus>("PENDING");
  const [statusNote, setStatusNote] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [carrier, setCarrier] = useState("");

  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");

  if (isLoading) {
    return <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm mb-4">Order not found</p>
        <button onClick={() => navigate("/staff/admin/orders")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Back to Orders</button>
      </div>
    );
  }

  const canRefund = order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_REFUNDED";

  const openStatusForm = () => {
    setStatusValue(order.status);
    setStatusNote("");
    setTrackingId(order.trackingId ?? "");
    setCarrier(order.carrier ?? "");
    setShowStatusForm(true);
  };

  const handleUpdateStatus = () => {
    updateStatus.mutate(
      { id: order.id, input: { status: statusValue, note: statusNote.trim() || undefined, trackingId: trackingId.trim() || undefined, carrier: carrier.trim() || undefined } },
      {
        onSuccess: () => { toast.success("Order status updated"); setShowStatusForm(false); },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const openRefundForm = () => {
    setRefundAmount(Number(order.totalAmount));
    setRefundReason("");
    setShowRefundForm(true);
  };

  const handleRefund = () => {
    if (refundAmount <= 0 || !refundReason.trim()) {
      toast.error("Enter a valid amount and reason");
      return;
    }
    initiateRefund.mutate(
      { id: order.id, input: { amount: refundAmount, reason: refundReason.trim() } },
      {
        onSuccess: () => { toast.success("Refund initiated"); setShowRefundForm(false); },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/staff/admin/orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft className="w-4 h-4" />Back to Orders
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={openStatusForm} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Update Status</button>
        {canRefund && (
          <button onClick={openRefundForm} className="px-4 py-2.5 border border-destructive/30 text-destructive text-sm font-semibold rounded-xl">Initiate Refund</button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" />Items Ordered</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4 last:mb-0">
                <img src={item.imageUrl ?? undefined} alt={item.productName} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">Size: {item.sizeLabel} · Qty: {item.quantity}</p>
                </div>
                <p className="font-extrabold flex-shrink-0">₹{Number(item.lineTotal).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-extrabold">
              <span>Order Total</span>
              <span>₹{Number(order.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Status history timeline */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><History className="w-4 h-4 text-primary" />Status History</h2>
            {(order.statusHistory ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No status changes recorded yet</p>
            ) : (
              <div className="space-y-0">
                {(order.statusHistory ?? []).map((h, i, arr) => (
                  <div key={h.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 z-10 mt-1" />
                      {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                    </div>
                    <div className="pb-6 last:pb-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {h.fromStatus && <span className="text-xs text-muted-foreground">{humanize(h.fromStatus)} →</span>}
                        <StatusBadge status={h.toStatus} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(h.createdAt).toLocaleString()}</p>
                      {h.note && <p className="text-sm mt-1">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Refunds */}
          {order.refunds.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><RotateCcw className="w-4 h-4 text-primary" />Refunds</h2>
              <div className="space-y-3">
                {order.refunds.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-3 border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">₹{Number(r.amount).toLocaleString()}</p>
                      {r.reason && <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>}
                      <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal notes */}
          {order.notes.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><StickyNote className="w-4 h-4 text-primary" />Internal Notes</h2>
              <div className="space-y-3">
                {order.notes.map((n) => (
                  <div key={n.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <p className="text-sm">{n.note}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Staff #{n.authorId} · {new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Shipping / tracking */}
          {order.trackingId && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Shipping</h2>
              <p className="text-sm font-semibold">{order.carrier ?? "Manual"} · {order.trackingId}</p>
              {order.shippingStatus && <p className="text-xs text-muted-foreground mt-0.5">{order.shippingStatus}</p>}
              {order.shippingLastCheckedAt && (
                <p className="text-[11px] text-muted-foreground mt-0.5">Last checked {new Date(order.shippingLastCheckedAt).toLocaleString()}</p>
              )}
              {order.carrier === "DELHIVERY" && (
                <button
                  onClick={() => refreshTracking.mutate(order.id, { onError: (err: Error) => toast.error(err.message) })}
                  disabled={refreshTracking.isPending}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshTracking.isPending ? "animate-spin" : ""}`} />
                  {refreshTracking.isPending ? "Refreshing…" : "Refresh tracking"}
                </button>
              )}
            </div>
          )}

          {/* Customer */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><User className="w-4 h-4 text-primary" />Customer</h2>
            <p className="text-sm font-semibold">{order.user.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.user.phone ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.user.email ?? "—"}</p>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />Shipping Address</h2>
            <p className="text-sm font-semibold">{order.shipName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.shipLine1}{order.shipLine2 ? `, ${order.shipLine2}` : ""}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.shipCity}, {order.shipState} — {order.shipPincode}</p>
            <p className="text-xs text-muted-foreground mt-0.5">📞 {order.shipPhone}</p>
          </div>
        </div>
      </div>

      {/* Update status dialog */}
      <Dialog open={showStatusForm} onOpenChange={setShowStatusForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select value={statusValue} onChange={(e) => setStatusValue(e.target.value as OrderStatus)} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Note (optional)</label>
              <textarea value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={3} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" />
            </div>
            {order.carrier === "DELHIVERY" ? (
              <p className="text-xs text-muted-foreground bg-muted rounded-xl px-3 py-2">
                Tracking is managed automatically by Delhivery ({order.trackingId}) — use "Refresh tracking" instead of editing it here.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Tracking ID (optional)</label>
                  <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Carrier (optional)</label>
                  <input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <button onClick={() => setShowStatusForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleUpdateStatus} disabled={updateStatus.isPending} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {updateStatus.isPending ? "Saving…" : "Save Status"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund dialog */}
      <Dialog open={showRefundForm} onOpenChange={setShowRefundForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Amount (₹)</label>
              <input type="number" value={refundAmount || ""} onChange={(e) => setRefundAmount(Number(e.target.value))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Reason</label>
              <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)} rows={3} placeholder="Why is this order being refunded?" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowRefundForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleRefund} disabled={initiateRefund.isPending} className="px-4 py-2 bg-destructive text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {initiateRefund.isPending ? "Submitting…" : "Submit Refund"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
