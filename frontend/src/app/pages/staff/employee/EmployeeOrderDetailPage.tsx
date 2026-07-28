import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Package, User, MapPin, History, StickyNote, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useEmployeeOrder, useAddOrderNote, useEmployeeCancelOrder, useEmployeeReturnOrder } from "../../../hooks/useEmployee";
import type { OrderStatus } from "../../../types/order";

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED"];

function humanize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function EmployeeOrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useEmployeeOrder(Number.isFinite(orderId) ? orderId : undefined);

  const addOrderNote = useAddOrderNote();
  const cancelOrder = useEmployeeCancelOrder();
  const returnOrder = useEmployeeReturnOrder();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnOrderItemId, setReturnOrderItemId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnQty, setReturnQty] = useState(1);

  if (isLoading) {
    return <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm mb-4">Order not found</p>
        <button onClick={() => navigate("/staff/employee/orders")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Back to Orders</button>
      </div>
    );
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);
  const canReturn = order.status === "DELIVERED";

  const openNoteForm = () => {
    setNoteText("");
    setShowNoteForm(true);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast.error("Enter a note");
      return;
    }
    addOrderNote.mutate(
      { id: order.id, note: noteText.trim() },
      {
        onSuccess: () => { toast.success("Note added"); setShowNoteForm(false); },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  };

  const openCancelForm = () => {
    setCancelReason("");
    setShowCancelForm(true);
  };

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast.error("Enter a cancellation reason");
      return;
    }
    cancelOrder.mutate(
      { id: order.id, reason: cancelReason.trim() },
      {
        onSuccess: () => { toast.success("Order cancelled"); setShowCancelForm(false); },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  };

  const openReturnForm = () => {
    setReturnOrderItemId("");
    setReturnReason("");
    setReturnQty(1);
    setShowReturnForm(true);
  };

  const handleReturnOrder = () => {
    if (!returnReason.trim() || returnQty <= 0) {
      toast.error("Enter a valid reason and quantity");
      return;
    }
    returnOrder.mutate(
      {
        id: order.id,
        input: {
          orderItemId: returnOrderItemId ? Number(returnOrderItemId) : undefined,
          reason: returnReason.trim(),
          requestedQty: returnQty,
        },
      },
      {
        onSuccess: () => { toast.success("Return request submitted"); setShowReturnForm(false); },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/staff/employee/orders")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
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
        <button onClick={openNoteForm} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Add Note</button>
        {canCancel && (
          <button onClick={openCancelForm} className="px-4 py-2.5 border border-destructive/30 text-destructive text-sm font-semibold rounded-xl">Cancel Order</button>
        )}
        {canReturn && (
          <button onClick={openReturnForm} className="px-4 py-2.5 border border-border text-sm font-semibold rounded-xl">Process Return</button>
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

          {/* Notes */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><StickyNote className="w-4 h-4 text-primary" />Notes</h2>
            {order.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {order.notes.map((n) => (
                  <div key={n.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <p className="text-sm">{n.note}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">Staff #{n.authorId} · {new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
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

          {/* Returns */}
          {order.returns.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><RotateCcw className="w-4 h-4 text-primary" />Returns</h2>
              <div className="space-y-3">
                {order.returns.map((r) => (
                  <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Qty {r.requestedQty}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add note dialog */}
      <Dialog open={showNoteForm} onOpenChange={setShowNoteForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div>
            <label className="block text-xs font-semibold mb-1">Note</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
              placeholder="Add an internal note about this order…"
            />
          </div>
          <DialogFooter>
            <button onClick={() => setShowNoteForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleAddNote} disabled={addOrderNote.isPending} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {addOrderNote.isPending ? "Saving…" : "Add Note"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel order dialog */}
      <Dialog open={showCancelForm} onOpenChange={setShowCancelForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
          </DialogHeader>
          <div>
            <label className="block text-xs font-semibold mb-1">Reason</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
              placeholder="Why is this order being cancelled?"
            />
          </div>
          <DialogFooter>
            <button onClick={() => setShowCancelForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Back</button>
            <button onClick={handleCancelOrder} disabled={cancelOrder.isPending} className="px-4 py-2 bg-destructive text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process return dialog */}
      <Dialog open={showReturnForm} onOpenChange={setShowReturnForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Item (optional)</label>
              <select
                value={returnOrderItemId}
                onChange={(e) => setReturnOrderItemId(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm"
              >
                <option value="">Whole order</option>
                {order.items.map((item) => (
                  <option key={item.id} value={item.id}>{item.productName} — {item.sizeLabel}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Requested Quantity</label>
              <input
                type="number"
                min={1}
                value={returnQty || ""}
                onChange={(e) => setReturnQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Reason</label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
                placeholder="Why is this being returned?"
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowReturnForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleReturnOrder} disabled={returnOrder.isPending} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {returnOrder.isPending ? "Submitting…" : "Submit Return"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
