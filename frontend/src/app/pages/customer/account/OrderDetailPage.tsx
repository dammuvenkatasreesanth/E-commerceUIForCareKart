import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Check, Clock, Download, Package, RefreshCw, Truck, XCircle, Undo2 } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useOrder, useCancelOrder, useReturnOrder, useReorder, downloadInvoice } from "../../../hooks/useOrders";
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, CANCELLABLE_STATUSES, timelineSteps } from "../../../lib/orderStatus";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useOrder(Number.isFinite(orderId) ? orderId : undefined);

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnItemId, setReturnItemId] = useState<string>("");
  const [returnReason, setReturnReason] = useState("");
  const [returnQty, setReturnQty] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  const cancelMutation = useCancelOrder(orderId);
  const returnMutation = useReturnOrder(orderId);
  const reorderMutation = useReorder(orderId);

  if (isLoading) {
    return <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm mb-4">Order not found</p>
        <button onClick={() => navigate("/account/orders")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Back to Orders</button>
      </div>
    );
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const canReturn = order.status === "DELIVERED";
  const isTerminalOffPath = order.status === "CANCELLED" || order.status === "RETURN_REQUESTED" || order.status === "RETURNED";

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("Please tell us why you're cancelling");
      return;
    }
    cancelMutation.mutate(cancelReason.trim(), {
      onSuccess: () => {
        toast.success("Order cancelled");
        setShowCancelForm(false);
        setCancelReason("");
      },
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleReturn = () => {
    if (!returnReason.trim()) {
      toast.error("Please tell us the reason for the return");
      return;
    }
    returnMutation.mutate(
      { orderItemId: returnItemId ? Number(returnItemId) : undefined, reason: returnReason.trim(), requestedQty: returnQty },
      {
        onSuccess: () => {
          toast.success("Return requested — we'll review it shortly");
          setShowReturnForm(false);
          setReturnReason("");
          setReturnItemId("");
          setReturnQty(1);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  const handleReorder = () => {
    reorderMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.added.length > 0) toast.success(`Added ${result.added.length} item${result.added.length > 1 ? "s" : ""} to your cart`);
        if (result.skipped.length > 0) toast.warning(`Couldn't add: ${result.skipped.join(", ")}`);
        navigate("/cart");
      },
      onError: (err: Error) => toast.error(errorMessage(err)),
    });
  };

  const handleInvoice = async () => {
    setIsDownloading(true);
    try {
      await downloadInvoice(order.id, order.orderNumber);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/account/orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Orders</button>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
      </div>

      {/* Shipment tracking */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />Shipment Tracking</h2>
        {order.trackingId && (
          <div className="flex items-center justify-between gap-3 bg-muted rounded-xl px-3 py-2.5 mb-4">
            <div>
              <p className="text-sm font-semibold">{order.carrier ?? "Courier"} · {order.trackingId}</p>
              {order.shippingStatus && <p className="text-xs text-muted-foreground mt-0.5">{order.shippingStatus}</p>}
            </div>
          </div>
        )}
        {isTerminalOffPath ? (
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${order.status === "CANCELLED" ? "bg-red-100" : "bg-amber-100"}`}>
              {order.status === "CANCELLED" ? <XCircle className="w-4 h-4 text-destructive" /> : <Undo2 className="w-4 h-4 text-amber-600" />}
            </div>
            <div>
              <p className="text-sm font-semibold">{ORDER_STATUS_LABELS[order.status]}</p>
              {order.cancelReason && <p className="text-xs text-muted-foreground mt-0.5">Reason: {order.cancelReason}</p>}
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {timelineSteps().map((stepStatus, i, arr) => {
              const historyEntry = order.statusHistory?.find((h) => h.toStatus === stepStatus);
              const currentIdx = arr.indexOf(order.status);
              const done = currentIdx >= 0 ? i <= currentIdx : !!historyEntry;
              return (
                <div key={stepStatus} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done ? "bg-emerald-500" : "bg-muted border-2 border-border"}`}>
                      {done ? <Check className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    {i < arr.length - 1 && <div className={`w-0.5 h-10 ${done ? "bg-emerald-200" : "bg-border"}`} />}
                  </div>
                  <div className="pt-1 pb-8 last:pb-0">
                    <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{ORDER_STATUS_LABELS[stepStatus]}</p>
                    {historyEntry && <p className="text-xs text-muted-foreground mt-0.5">{new Date(historyEntry.createdAt).toLocaleString()}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary" />Items Ordered</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 mb-4 last:mb-0">
            <ImageWithFallback src={item.imageUrl ?? undefined} alt={item.productName} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm">{item.productName}</p>
              <p className="text-xs text-muted-foreground">Size: {item.sizeLabel} · Qty: {item.quantity}</p>
            </div>
            <p className="font-extrabold">₹{Number(item.lineTotal).toLocaleString()}</p>
          </div>
        ))}
        <div className="border-t border-border mt-4 pt-4 flex justify-between font-extrabold">
          <span>Order Total</span>
          <span>₹{Number(order.totalAmount).toLocaleString()}</span>
        </div>
      </div>

      {/* Delivery address */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-2">Delivered to</h2>
        <p className="text-sm font-semibold">{order.shipName}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{order.shipLine1}, {order.shipCity}, {order.shipState} — {order.shipPincode}</p>
        <p className="text-xs text-muted-foreground mt-0.5">📞 {order.shipPhone}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Payment for this order never actually completed (see
            payments.service.ts's auto-cancel branch) — there's no real sale
            to invoice, so the backend rejects it; don't even offer the button. */}
        {!(order.status === "CANCELLED" && order.paymentStatus === "FAILED") && (
          <button onClick={handleInvoice} disabled={isDownloading} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-50">
            <Download className="w-4 h-4" />{isDownloading ? "Downloading…" : "Invoice"}
          </button>
        )}
        <button onClick={handleReorder} disabled={reorderMutation.isPending} className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-sm font-semibold rounded-xl disabled:opacity-50">
          <RefreshCw className="w-4 h-4" />{reorderMutation.isPending ? "Adding…" : "Reorder"}
        </button>
        {canCancel && (
          <button onClick={() => setShowCancelForm((v) => !v)} className="flex items-center gap-1.5 px-4 py-2.5 border border-destructive/30 text-destructive text-sm font-semibold rounded-xl">
            <XCircle className="w-4 h-4" />Cancel Order
          </button>
        )}
        {canReturn && (
          <button onClick={() => setShowReturnForm((v) => !v)} className="flex items-center gap-1.5 px-4 py-2.5 border border-border text-sm font-semibold rounded-xl">
            <Undo2 className="w-4 h-4" />Return / Refund
          </button>
        )}
      </div>

      {showCancelForm && (
        <div className="bg-white border-2 border-destructive/30 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-sm mb-3">Why are you cancelling?</h3>
          <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Tell us the reason…" rows={3} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none mb-3" />
          <div className="flex gap-2">
            <button onClick={handleCancel} disabled={cancelMutation.isPending} className="flex-1 py-2.5 bg-destructive text-white text-sm font-bold rounded-xl disabled:opacity-50">{cancelMutation.isPending ? "Cancelling…" : "Confirm Cancellation"}</button>
            <button onClick={() => setShowCancelForm(false)} className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">Never mind</button>
          </div>
        </div>
      )}

      {showReturnForm && (
        <div className="bg-white border-2 border-primary/30 rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-sm mb-3">Request a return</h3>
          <div className="space-y-3 mb-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Item</label>
              <select value={returnItemId} onChange={(e) => setReturnItemId(e.target.value)} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm">
                <option value="">Entire order</option>
                {order.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.productName} (Qty: {item.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Quantity</label>
              <input type="number" min={1} value={returnQty} onChange={(e) => setReturnQty(Math.max(1, Number(e.target.value)))} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Reason</label>
              <textarea value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder="What went wrong?" rows={3} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleReturn} disabled={returnMutation.isPending} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-50">{returnMutation.isPending ? "Submitting…" : "Submit Return Request"}</button>
            <button onClick={() => setShowReturnForm(false)} className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
