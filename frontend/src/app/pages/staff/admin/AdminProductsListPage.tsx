import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Download, Upload, X, Video } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import {
  useAdminProducts,
  useAdminProduct,
  useCreateProduct,
  useUpdateProduct,
  useAdminCategories,
  useImportProductsCsv,
  useSetPackTiers,
  useAddProductImage,
  useRemoveProductImage,
  useUploadProductVideo,
} from "../../../hooks/admin/useAdminCatalog";
import { exportProductsCsv } from "../../../lib/api/endpoints/admin/catalog";
import { downloadBlob } from "../../../lib/download";
import type { AdminProduct, AdminProductInput, AdminPackTier } from "../../../types/admin";

type PackTierForm = { tierIndex: number; label: string; packQty: number; discountPct: number; tag: string };

const defaultTiers = (): PackTierForm[] => [
  { tierIndex: 0, label: "Single Unit", packQty: 1, discountPct: 0, tag: "" },
  { tierIndex: 1, label: "Box · 100 units", packQty: 100, discountPct: 5, tag: "" },
  { tierIndex: 2, label: "Box · 500 units", packQty: 500, discountPct: 12, tag: "Popular" },
  { tierIndex: 3, label: "Pallet · 1000+", packQty: 1000, discountPct: 20, tag: "Best Value" },
];

const tiersFromProduct = (tiers: AdminPackTier[]): PackTierForm[] =>
  [...tiers]
    .sort((a, b) => a.tierIndex - b.tierIndex)
    .map((t) => ({ tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: Number(t.discountPct), tag: t.tag ?? "" }));

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

const emptyForm = (): AdminProductInput => ({
  name: "",
  tagline: "",
  description: "",
  categoryId: 0,
  price: 0,
  mrp: 0,
  material: "",
  badge: "",
  videoUrl: "",
  moq: 1,
  gstRate: 18,
  hsnCode: "",
  weightGrams: undefined,
  lengthCm: undefined,
  widthCm: undefined,
  heightCm: undefined,
  sizes: [],
  isActive: true,
  inStock: true,
});

export function AdminProductsListPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data, isLoading } = useAdminProducts({ q: q || undefined, category: category || undefined, page, limit: 20 });
  const { data: categories } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const importCsv = useImportProductsCsv();
  const setPackTiers = useSetPackTiers();
  const addProductImage = useAddProductImage();
  const removeProductImage = useRemoveProductImage();
  const uploadProductVideo = useUploadProductVideo();

  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminProductInput>(emptyForm());
  const [sizesInput, setSizesInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [tiers, setTiers] = useState<PackTierForm[]>(defaultTiers());
  const [isSavingTiers, setIsSavingTiers] = useState(false);
  // `editing` is a snapshot from when the dialog opened — refetch by id so the
  // images grid reflects adds/removes without needing to close and reopen.
  const { data: liveEditingProduct } = useAdminProduct(editing?.id);
  const editingImages = liveEditingProduct?.images ?? editing?.images ?? [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSizesInput("");
    setTiers(defaultTiers());
    setShowForm(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      tagline: p.tagline ?? "",
      description: p.description,
      categoryId: p.categoryId,
      price: Number(p.price),
      mrp: Number(p.mrp),
      material: p.material ?? "",
      badge: p.badge ?? "",
      videoUrl: p.videoUrl ?? "",
      moq: p.moq,
      gstRate: Number(p.gstRate),
      hsnCode: p.hsnCode ?? "",
      weightGrams: p.weightGrams ?? undefined,
      lengthCm: p.lengthCm ?? undefined,
      widthCm: p.widthCm ?? undefined,
      heightCm: p.heightCm ?? undefined,
      sizes: p.sizes.map((s) => s.size),
      isActive: p.isActive,
      inStock: p.inStock,
    });
    setSizesInput(p.sizes.map((s) => s.size).join(", "));
    setTiers(p.packTiers.length > 0 ? tiersFromProduct(p.packTiers) : defaultTiers());
    setShowForm(true);
  };

  const handleSave = async () => {
    const sizes = sizesInput.split(",").map((s) => s.trim()).filter(Boolean);
    if (!form.name.trim() || !form.description.trim() || !form.categoryId || form.price <= 0 || form.mrp <= 0 || sizes.length === 0) {
      toast.error("Please fill in name, description, category, price, MRP, and at least one size");
      return;
    }
    setIsSaving(true);
    const input: AdminProductInput = { ...form, sizes, packTiers: editing ? undefined : tiers };
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, input });
        toast.success("Product updated");
        setShowForm(false);
      } else {
        const created = await createProduct.mutateAsync(input);
        // Images/video uploads need a real product id, which only exists after
        // this first save — switch the same dialog into edit mode instead of
        // closing it, so the user can add them right away.
        setEditing(created);
        toast.success("Product created — now add images or a video below");
      }
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (p: AdminProduct) => {
    try {
      await updateProduct.mutateAsync({ id: p.id, input: { isActive: !p.isActive } });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleSaveTiers = async () => {
    if (!editing) return;
    setIsSavingTiers(true);
    try {
      await setPackTiers.mutateAsync({
        id: editing.id,
        tiers: tiers.map((t) => ({ tierIndex: t.tierIndex, label: t.label, packQty: t.packQty, discountPct: t.discountPct, tag: t.tag || undefined })),
      });
      toast.success("Pack pricing updated");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSavingTiers(false);
    }
  };

  const updateTier = (index: number, patch: Partial<PackTierForm>) => {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    addProductImage.mutate(
      { id: editing.id, file },
      { onError: (err: Error) => toast.error(err.message) },
    );
    e.target.value = "";
  };

  const handleRemoveImage = (imageId: number) => {
    if (!editing) return;
    removeProductImage.mutate({ id: editing.id, imageId }, { onError: (err: Error) => toast.error(err.message) });
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    uploadProductVideo.mutate(
      { id: editing.id, file },
      {
        onSuccess: ({ url }) => {
          setForm((f) => ({ ...f, videoUrl: url }));
          toast.success("Video uploaded — click Save Product to apply it");
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
    e.target.value = "";
  };

  const handleExport = async () => {
    try {
      const blob = await exportProductsCsv();
      downloadBlob(blob, "products-export.csv");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importCsv.mutate(file, {
      onSuccess: (result) => {
        toast.success(`Imported: ${result.created} created, ${result.updated} updated${result.errors.length ? `, ${result.errors.length} errors` : ""}`);
        if (result.errors.length > 0) console.warn("CSV import errors:", result.errors);
      },
      onError: (err: Error) => toast.error(err.message),
    });
    e.target.value = "";
  };

  const columns: DataTableColumn<AdminProduct>[] = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-muted" />
          <div className="min-w-0">
            <p className="font-semibold truncate max-w-[220px]">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.category?.name}</p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (p) => <span>₹{Number(p.price).toLocaleString()}</span> },
    { key: "moq", header: "MOQ", render: (p) => p.moq },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{p.inStock ? "In Stock" : "Out of Stock"}</span>
      ),
    },
    {
      key: "active",
      header: "Status",
      render: (p) => (
        <button onClick={() => handleToggleActive(p)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isActive ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
          {p.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Products</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl"><Download className="w-3.5 h-3.5" />Export CSV</button>
          <label className="flex items-center gap-1.5 px-3 py-2 border border-border text-xs font-semibold rounded-xl cursor-pointer">
            <Upload className="w-3.5 h-3.5" />Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5" />Add Product</button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        keyField={(p) => p.id}
        isLoading={isLoading}
        emptyMessage="No products found"
        searchValue={q}
        onSearchChange={(v) => { setQ(v); setPage(1); }}
        searchPlaceholder="Search products…"
        filters={
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="px-3 py-2 bg-muted rounded-xl border border-transparent text-sm focus:outline-none">
            <option value="">All Categories</option>
            {(categories ?? []).map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        }
        pagination={data ? { page: data.page, totalPages: data.totalPages, total: data.total, limit: data.limit, onPageChange: setPage } : undefined}
        rowActions={(p) => (
          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Tagline</label>
                <input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select value={form.categoryId || ""} onChange={(e) => setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                  <option value="">Select…</option>
                  {(categories ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Badge</label>
                <input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Bestseller, New…" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Price (₹)</label>
                <input type="number" value={form.price || ""} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">MRP (₹)</label>
                <input type="number" value={form.mrp || ""} onChange={(e) => setForm((f) => ({ ...f, mrp: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Material</label>
                <input value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">MOQ</label>
                <input type="number" value={form.moq || ""} onChange={(e) => setForm((f) => ({ ...f, moq: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">GST Rate (%)</label>
                <input type="number" value={form.gstRate ?? ""} onChange={(e) => setForm((f) => ({ ...f, gstRate: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">HSN Code</label>
                <input value={form.hsnCode} onChange={(e) => setForm((f) => ({ ...f, hsnCode: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Weight per unit (grams)</label>
                <input
                  type="number"
                  value={form.weightGrams ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, weightGrams: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="Used for courier shipment weight"
                  className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Package dimensions (cm) — L × W × H</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={form.lengthCm ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, lengthCm: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Length"
                    className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={form.widthCm ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, widthCm: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Width"
                    className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={form.heightCm ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Height"
                    className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Sizes (comma-separated)</label>
                <input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} placeholder="S, M, L, XL" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1">Product Video</label>
                {editing ? (
                  <div>
                    {form.videoUrl && (
                      <div className="flex items-center gap-2 mb-2 text-xs bg-muted rounded-xl px-3 py-2">
                        <Video className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <a href={form.videoUrl} target="_blank" rel="noreferrer" className="text-primary underline truncate flex-1 min-w-0">{form.videoUrl}</a>
                        <button onClick={() => setForm((f) => ({ ...f, videoUrl: "" }))} type="button" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <label className={`inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-semibold cursor-pointer ${uploadProductVideo.isPending ? "opacity-50 pointer-events-none" : ""}`}>
                      <Video className="w-3.5 h-3.5" />
                      {uploadProductVideo.isPending ? "Uploading…" : form.videoUrl ? "Replace Video" : "Upload Video"}
                      <input type="file" accept="video/*" className="hidden" onChange={handleUploadVideo} />
                    </label>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground">Save the product first — then you can upload a video here.</p>
                )}
              </div>
              {editing && (
                <div className="col-span-2 flex gap-4">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />Active</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} className="accent-primary" />In Stock</label>
                </div>
              )}
            </div>

            {/* Pack tiers */}
            <div className="border-t border-border pt-3">
              <label className="block text-xs font-semibold mb-2">Pack Pricing Tiers</label>
              <p className="text-[11px] text-muted-foreground mb-2">Set bulk-buy pricing — e.g. a box of 100 units at 5% off, a pallet of 1000+ at 20% off.</p>
              <div className="space-y-2">
                {tiers.map((t, i) => (
                  <div key={t.tierIndex} className="grid grid-cols-12 gap-1.5 items-center">
                    <input value={t.label} onChange={(e) => updateTier(i, { label: e.target.value })} placeholder="Label" className="col-span-4 px-2 py-1.5 bg-muted rounded-lg border border-transparent focus:border-primary/40 focus:outline-none text-xs" />
                    <input type="number" value={t.packQty || ""} onChange={(e) => updateTier(i, { packQty: Number(e.target.value) })} placeholder="Qty" className="col-span-2 px-2 py-1.5 bg-muted rounded-lg border border-transparent focus:border-primary/40 focus:outline-none text-xs" />
                    <input type="number" value={t.discountPct || ""} onChange={(e) => updateTier(i, { discountPct: Number(e.target.value) })} placeholder="% off" className="col-span-2 px-2 py-1.5 bg-muted rounded-lg border border-transparent focus:border-primary/40 focus:outline-none text-xs" />
                    <input value={t.tag} onChange={(e) => updateTier(i, { tag: e.target.value })} placeholder="Tag (optional)" className="col-span-4 px-2 py-1.5 bg-muted rounded-lg border border-transparent focus:border-primary/40 focus:outline-none text-xs" />
                  </div>
                ))}
              </div>
              {editing ? (
                <button onClick={handleSaveTiers} disabled={isSavingTiers} className="mt-2 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold disabled:opacity-50">
                  {isSavingTiers ? "Saving…" : "Save Pack Pricing"}
                </button>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-1.5">Pricing above will be applied when you save the product.</p>
              )}
            </div>

            {/* Images */}
            <div className="border-t border-border pt-3">
              <label className="block text-xs font-semibold mb-2">Images</label>
              {editing ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editingImages.map((img) => (
                      <div key={img.id} className="relative w-16 h-16 flex-shrink-0">
                        <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg border border-border" />
                        <button onClick={() => handleRemoveImage(img.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold cursor-pointer ${addProductImage.isPending ? "opacity-50 pointer-events-none" : ""}`}>
                    <Upload className="w-3.5 h-3.5" />
                    {addProductImage.isPending ? "Uploading…" : "Add Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                  </label>
                </>
              ) : (
                <p className="text-[11px] text-muted-foreground">Save the product first — then you can add images here.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Product"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
