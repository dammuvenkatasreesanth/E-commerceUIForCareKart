import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, User, MessageSquare, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { StatusBadge } from "../../../components/common/StatusBadge";
import { useTicket, useAddTicketNote, useUpdateTicketStatus } from "../../../hooks/useEmployee";
import type { TicketStatus } from "../../../types/support";

const TICKET_STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function humanize(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function EmployeeTicketDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const { data: ticket, isLoading } = useTicket(Number.isFinite(ticketId) ? ticketId : undefined);

  const addTicketNote = useAddTicketNote();
  const updateTicketStatus = useUpdateTicketStatus();

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteIsInternal, setNoteIsInternal] = useState(false);

  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusValue, setStatusValue] = useState<TicketStatus>("OPEN");
  const [assignToSelf, setAssignToSelf] = useState(false);

  if (isLoading) {
    return <div className="text-center py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm mb-4">Ticket not found</p>
        <button onClick={() => navigate("/staff/employee/tickets")} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Back to Tickets</button>
      </div>
    );
  }

  const openNoteForm = () => {
    setNoteText("");
    setNoteIsInternal(false);
    setShowNoteForm(true);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast.error("Enter a note");
      return;
    }
    addTicketNote.mutate(
      { id: ticket.id, note: noteText.trim(), isInternal: noteIsInternal },
      {
        onSuccess: () => { toast.success("Note added"); setShowNoteForm(false); },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  };

  const openStatusForm = () => {
    setStatusValue(ticket.status);
    setAssignToSelf(false);
    setShowStatusForm(true);
  };

  const handleUpdateStatus = () => {
    updateTicketStatus.mutate(
      { id: ticket.id, status: statusValue, assignToSelf },
      {
        onSuccess: () => { toast.success("Ticket status updated"); setShowStatusForm(false); },
        onError: (err: Error) => toast.error(errorMessage(err)),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/staff/employee/tickets")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft className="w-4 h-4" />Back to Tickets
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">{ticket.subject}</h1>
          <p className="text-sm text-muted-foreground font-mono">{ticket.ticketNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={openNoteForm} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl">Add Note</button>
        <button onClick={openStatusForm} className="px-4 py-2.5 border border-border text-sm font-semibold rounded-xl">Update Status</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 space-y-4">
          {/* Description */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3">Description</h2>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Notes thread */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" />Notes</h2>
            {ticket.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {ticket.notes.map((n) => (
                  <div key={n.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm flex-1">{n.note}</p>
                      {n.isInternal && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 flex-shrink-0">Internal</span>}
                    </div>
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
            <p className="text-sm font-semibold">{ticket.user.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ticket.user.phone ?? "—"}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ticket.user.email ?? "—"}</p>
          </div>

          {/* Ticket meta */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-primary" />Details</h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground">Linked Order</p>
                <p className="font-semibold mt-0.5">{ticket.orderId ? `#${ticket.orderId}` : "—"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground">Assigned To</p>
                <p className="font-semibold mt-0.5">{ticket.assignedTo?.name ?? "Unassigned"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide font-bold text-muted-foreground">Created</p>
                <p className="font-semibold mt-0.5">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add note dialog */}
      <Dialog open={showNoteForm} onOpenChange={setShowNoteForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none"
                placeholder="Add a note about this ticket…"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={noteIsInternal} onChange={(e) => setNoteIsInternal(e.target.checked)} className="rounded border-border" />
              Internal note (not visible to customer)
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowNoteForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleAddNote} disabled={addTicketNote.isPending} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {addTicketNote.isPending ? "Saving…" : "Add Note"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update status dialog */}
      <Dialog open={showStatusForm} onOpenChange={setShowStatusForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select value={statusValue} onChange={(e) => setStatusValue(e.target.value as TicketStatus)} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                {TICKET_STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={assignToSelf} onChange={(e) => setAssignToSelf(e.target.checked)} className="rounded border-border" />
              Assign to me
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowStatusForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleUpdateStatus} disabled={updateTicketStatus.isPending} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {updateTicketStatus.isPending ? "Saving…" : "Save Status"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
