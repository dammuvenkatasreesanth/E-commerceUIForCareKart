import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Home } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { UploadProgressBar } from "../../../components/common/UploadProgressBar";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, useUploadCategoryImage } from "../../../hooks/admin/useAdminCatalog";
import type { AdminCategory } from "../../../types/admin";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

interface CategoryForm {
  name: string;
  parentId: number | "";
  imageUrl: string;
  showOnHomepage: boolean;
  sortOrder: number;
}

const emptyForm = (): CategoryForm => ({ name: "", parentId: "", imageUrl: "", showOnHomepage: false, sortOrder: 0 });

export function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const uploadImage = useUploadCategoryImage();

  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (c: AdminCategory) => {
    setEditing(c);
    setForm({
      name: c.name,
      parentId: c.parentId ?? "",
      imageUrl: c.imageUrl ?? "",
      showOnHomepage: c.showOnHomepage,
      sortOrder: c.sortOrder,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { url } = await uploadImage.mutateAsync({ file, onProgress: setUploadProgress });
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Please provide a name");
      return;
    }
    setIsSaving(true);
    try {
      const input = {
        name: form.name.trim(),
        parentId: form.parentId === "" ? undefined : form.parentId,
        imageUrl: form.imageUrl || undefined,
        showOnHomepage: form.showOnHomepage,
        sortOrder: form.sortOrder,
      };
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, input });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(input);
        toast.success("Category created");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (c: AdminCategory) => {
    try {
      await updateCategory.mutateAsync({ id: c.id, input: { isActive: !c.isActive } });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (c: AdminCategory) => {
    if (!window.confirm(`Delete category "${c.name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory.mutateAsync(c.id);
      toast.success("Category deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />Add Category
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-5">
        <strong>Active</strong> categories appear in the product filters. <strong>Show on Homepage</strong> additionally puts them in the storefront's "Shop by Category" tile grid, ordered by Sort Order.
      </p>

      {isLoading ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">Loading…</div>
      ) : (categories ?? []).length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">No categories found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...(categories ?? [])].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => (
            <div key={c.id} className="border border-border rounded-2xl overflow-hidden bg-white">
              <div className="h-24 bg-muted relative">
                <ImageWithFallback src={c.imageUrl ?? undefined} alt={c.name} className="w-full h-full object-cover" />
                {c.showOnHomepage && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
                    <Home className="w-2.5 h-2.5" />On Homepage
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm truncate">{c.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => handleToggleActive(c)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isActive ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                  <span className="text-[11px] text-muted-foreground">Sort {c.sortOrder}</span>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-border rounded-lg text-xs font-semibold"><Pencil className="w-3 h-3" />Edit</button>
                  <button onClick={() => handleDelete(c)} className="flex items-center justify-center px-2 py-1.5 border border-border rounded-lg text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Image</label>
              <div className="flex items-center gap-3">
                {form.imageUrl && <ImageWithFallback src={form.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-border flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <label className={`flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-semibold cursor-pointer w-fit ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {isUploading ? `Uploading… ${uploadProgress ?? 0}%` : form.imageUrl ? "Replace Image" : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {uploadProgress !== null && <UploadProgressBar percent={uploadProgress} />}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value ? Number(e.target.value) : "" }))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm"
              >
                <option value="">None (top-level)</option>
                {(categories ?? []).filter((c) => c.id !== editing?.id).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${form.showOnHomepage ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="checkbox" checked={form.showOnHomepage} onChange={(e) => setForm((f) => ({ ...f, showOnHomepage: e.target.checked }))} className="w-4 h-4 accent-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5"><Home className="w-3.5 h-3.5 text-primary" />Show on Homepage</p>
                <p className="text-[11px] text-muted-foreground">Feature this category in the storefront's "Shop by Category" grid</p>
              </div>
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Category"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
