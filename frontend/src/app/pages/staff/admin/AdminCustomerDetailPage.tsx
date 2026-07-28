import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { MapPin, Star } from "lucide-react";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { useAdminCustomer, useDecideGstApproval, useSetCustomerStatus } from "../../../hooks/admin/useAdminCustomers";
import type { StaffStatus } from "../../../types/admin";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);
  const { data: customer, isLoading } = useAdminCustomer(customerId);
  const decideGstApproval = useDecideGstApproval();
  const setCustomerStatus = useSetCustomerStatus();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [statusDialog, setStatusDialog] = useState<StaffStatus | null>(null);
  const [statusReason, setStatusReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleApproveGst = async () => {
    try {
      await decideGstApproval.mutateAsync({ id: customerId, decision: "APPROVED" });
      toast.success("GST registration approved");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleRejectGst = async () => {
    setIsSaving(true);
    try {
      await decideGstApproval.mutateAsync({ id: customerId, decision: "REJECTED", note: rejectNote || undefined });
      toast.success("GST registration rejected");
      setShowRejectDialog(false);
      setRejectNote("");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReactivate = async () => {
    try {
      await setCustomerStatus.mutateAsync({ id: customerId, status: "ACTIVE" });
      toast.success("Customer reactivated");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!statusDialog) return;
    setIsSaving(true);
    try {
      await setCustomerStatus.mutateAsync({ id: customerId, status: statusDialog, reason: statusReason || undefined });
      toast.success(`Customer ${statusDialog === "BLOCKED" ? "blocked" : "suspended"}`);
      setStatusDialog(null);
      setStatusReason("");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!customer) {
    return <div className="py-16 text-center text-sm text-muted-foreground">Customer not found</div>;
  }

  return (
    <div>
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

        <div className="flex items-center gap-2">
          {customer.status !== "ACTIVE" && (
            <button onClick={handleReactivate} className="px-3 py-2 border border-border text-xs font-bold rounded-xl">Reactivate</button>
          )}
          {customer.status !== "SUSPENDED" && (
            <button onClick={() => setStatusDialog("SUSPENDED")} className="px-3 py-2 border border-border text-xs font-bold rounded-xl">Suspend</button>
          )}
          {customer.status !== "BLOCKED" && (
            <button onClick={() => setStatusDialog("BLOCKED")} className="px-3 py-2 bg-red-50 text-red-700 text-xs font-bold rounded-xl">Block</button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3">GST Registration</h2>
          {customer.gstin ? (
            <p className="text-sm font-mono mb-3">{customer.gstin}</p>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">No GSTIN on file</p>
          )}
          {customer.gstStatus === "PENDING" && (
            <div className="flex items-center gap-2">
              <button onClick={handleApproveGst} className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">Approve</button>
              <button onClick={() => setShowRejectDialog(true)} className="px-3 py-2 border border-border text-xs font-bold rounded-xl">Reject</button>
            </div>
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
                  onClick={() => navigate(`/staff/admin/orders/${o.id}`)}
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

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject GST Registration</DialogTitle>
          </DialogHeader>
          <div>
            <label className="block text-xs font-semibold mb-1">Reason (optional)</label>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
              placeholder="Let the customer know why…"
            />
          </div>
          <DialogFooter>
            <button onClick={() => setShowRejectDialog(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleRejectGst} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Reject"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialog !== null} onOpenChange={(open) => { if (!open) setStatusDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{statusDialog === "BLOCKED" ? "Block Customer" : "Suspend Customer"}</DialogTitle>
          </DialogHeader>
          <div>
            <label className="block text-xs font-semibold mb-1">Reason (optional)</label>
            <textarea
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
              placeholder="Internal note…"
            />
          </div>
          <DialogFooter>
            <button onClick={() => setStatusDialog(null)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleConfirmStatusChange} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Confirm"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
