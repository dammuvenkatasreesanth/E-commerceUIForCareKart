import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { useBoxSizes, useCreateBoxSize, useUpdateBoxSize, useDeleteBoxSize } from "../../../hooks/admin/useAdminShipping";
import type { BoxSize, BoxSizeInput } from "../../../types/admin";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

const emptyForm = (): BoxSizeInput => ({ boxCount: 1, lengthCm: 0, widthCm: 0, heightCm: 0 });

export function AdminBoxSizesPage() {
  const { data: boxSizes, isLoading } = useBoxSizes();
  const createBoxSize = useCreateBoxSize();
  const updateBoxSize = useUpdateBoxSize();
  const deleteBoxSize = useDeleteBoxSize();

  const [editing, setEditing] = useState<BoxSize | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BoxSizeInput>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (b: BoxSize) => {
    setEditing(b);
    setForm({ boxCount: b.boxCount, lengthCm: b.lengthCm, widthCm: b.widthCm, heightCm: b.heightCm });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (form.boxCount <= 0 || form.lengthCm <= 0 || form.widthCm <= 0 || form.heightCm <= 0) {
      toast.error("Please fill in box count and all three dimensions");
      return;
    }
    setIsSaving(true);
    try {
      if (editing) {
        await updateBoxSize.mutateAsync({ id: editing.id, input: form });
        toast.success("Box size updated");
      } else {
        await createBoxSize.mutateAsync(form);
        toast.success("Box size added");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (b: BoxSize) => {
    if (!window.confirm(`Delete the box size for ${b.boxCount} boxes? This cannot be undone.`)) return;
    try {
      await deleteBoxSize.mutateAsync(b.id);
      toast.success("Box size deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Shipping Box Sizes</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />Add Box Size
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        The packing standard used to size every Delhivery shipment. When an order is placed, the total box count (pack size × quantity, summed across the
        order) is matched to the smallest box here that's big enough — order placement doesn't need every possible count listed, just the ones your
        warehouse actually packs to.
      </p>

      {isLoading ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">Loading…</div>
      ) : (boxSizes ?? []).length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">
          No box sizes configured yet — shipments will go out without declared dimensions until you add some.
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Boxes</th>
                <th className="text-left px-4 py-2.5 font-semibold">Length (cm)</th>
                <th className="text-left px-4 py-2.5 font-semibold">Width (cm)</th>
                <th className="text-left px-4 py-2.5 font-semibold">Height (cm)</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {[...(boxSizes ?? [])].sort((a, b) => a.boxCount - b.boxCount).map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-semibold flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-primary" />Pack of {b.boxCount}</td>
                  <td className="px-4 py-2.5">{b.lengthCm}</td>
                  <td className="px-4 py-2.5">{b.widthCm}</td>
                  <td className="px-4 py-2.5">{b.heightCm}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(b)} className="p-1.5 hover:bg-muted rounded-lg text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Box Size" : "Add Box Size"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Number of boxes</label>
              <input
                type="number"
                value={form.boxCount || ""}
                onChange={(e) => setForm((f) => ({ ...f, boxCount: Number(e.target.value) }))}
                placeholder="e.g. 5"
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Length (cm)</label>
                <input type="number" value={form.lengthCm || ""} onChange={(e) => setForm((f) => ({ ...f, lengthCm: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Width (cm)</label>
                <input type="number" value={form.widthCm || ""} onChange={(e) => setForm((f) => ({ ...f, widthCm: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Height (cm)</label>
                <input type="number" value={form.heightCm || ""} onChange={(e) => setForm((f) => ({ ...f, heightCm: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Box Size"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
