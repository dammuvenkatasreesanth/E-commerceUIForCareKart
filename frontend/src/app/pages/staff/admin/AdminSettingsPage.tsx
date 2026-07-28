import { useState } from "react";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { useAdminSettings, useUpdateSetting } from "../../../hooks/admin/useAdminMarketing";
import type { AdminSetting } from "../../../types/admin";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function AdminSettingsPage() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();

  const [editing, setEditing] = useState<AdminSetting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [valueText, setValueText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = (s: AdminSetting) => {
    setEditing(s);
    setValueText(JSON.stringify(s.value, null, 2));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(valueText);
    } catch {
      toast.error("Invalid JSON — please fix the value before saving");
      return;
    }
    setIsSaving(true);
    try {
      await updateSetting.mutateAsync({ key: editing.key, value: parsed });
      toast.success("Setting updated");
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const columns: DataTableColumn<AdminSetting>[] = [
    { key: "key", header: "Key", render: (s) => <span className="font-mono font-bold text-xs">{s.key}</span> },
    {
      key: "value",
      header: "Value",
      render: (s) => (
        <pre className="text-xs text-muted-foreground max-w-md truncate whitespace-pre-wrap break-all">{JSON.stringify(s.value)}</pre>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Settings</h1>

      <DataTable
        columns={columns}
        data={settings ?? []}
        keyField={(s) => s.key}
        isLoading={isLoading}
        emptyMessage="No settings found"
        rowActions={(s) => (
          <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {editing?.key}</DialogTitle>
          </DialogHeader>
          <div>
            <label className="block text-xs font-semibold mb-1">Value (JSON)</label>
            <textarea value={valueText} onChange={(e) => setValueText(e.target.value)} rows={10} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono resize-y" />
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
