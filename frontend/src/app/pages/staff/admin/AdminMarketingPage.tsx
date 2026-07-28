import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useAdminBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useUploadBannerImage,
} from "../../../hooks/admin/useAdminMarketing";
import { BG_PRESETS } from "../../../lib/constants";
import type { CouponInput, BannerInput } from "../../../lib/api/endpoints/admin/marketing";
import type { AdminCoupon, AdminBanner } from "../../../types/admin";

// Banner.bgGradient stores a preset key (e.g. "royal"), never a raw class
// string — Tailwind's JIT scanner only generates CSS for class names it can
// find literally in source files, so this lookup's values must stay literal
// (mirrors BannerCarousel.tsx's BANNER_GRADIENT_CLASSES).
const BANNER_GRADIENT_CLASSES: Record<string, string> = {
  royal: "from-banner-royal-from to-banner-royal-to",
  teal: "from-banner-teal-from to-banner-teal-to",
  purple: "from-banner-purple-from to-banner-purple-to",
  orange: "from-banner-orange-from to-banner-orange-to",
  navy: "from-banner-navy-from to-banner-navy-to",
};
const DEFAULT_GRADIENT_CLASS = BANNER_GRADIENT_CLASSES.royal;

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

const emptyCouponForm = (): CouponInput => ({
  code: "",
  type: "PERCENT",
  value: 0,
  minOrderAmount: 0,
  maxUses: undefined,
  expiresAt: undefined,
});

const emptyBannerForm = (): BannerInput => ({
  badge: "",
  headline: "",
  subheadline: "",
  subtext: "",
  ctaPrimaryText: "",
  ctaPrimaryLink: "",
  ctaSecondaryText: "",
  ctaSecondaryLink: "",
  bgGradient: BG_PRESETS[0].key,
  imageUrl: "",
  sortOrder: 0,
  startsAt: "",
  endsAt: "",
});

export function AdminMarketingPage() {
  return (
    <div>
      <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Marketing</h1>
      <Tabs defaultValue="coupons">
        <TabsList>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="coupons" className="mt-4">
          <CouponsTab />
        </TabsContent>
        <TabsContent value="banners" className="mt-4">
          <BannersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CouponsTab() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CouponInput>(emptyCouponForm());
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCouponForm());
    setShowForm(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minOrderAmount: Number(c.minOrderAmount),
      maxUses: c.maxUses ?? undefined,
      expiresAt: toDateInput(c.expiresAt) || undefined,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim() || form.value <= 0) {
      toast.error("Please provide a coupon code and a positive value");
      return;
    }
    setIsSaving(true);
    try {
      const input: CouponInput = { ...form, code: form.code.trim().toUpperCase(), minOrderAmount: form.minOrderAmount || 0 };
      if (editing) {
        await updateCoupon.mutateAsync({ id: editing.id, input });
        toast.success("Coupon updated");
      } else {
        await createCoupon.mutateAsync(input);
        toast.success("Coupon created");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (c: AdminCoupon) => {
    try {
      await updateCoupon.mutateAsync({ id: c.id, input: { isActive: !c.isActive } });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (c: AdminCoupon) => {
    if (!window.confirm(`Delete coupon ${c.code}? It will be deactivated.`)) return;
    try {
      await deleteCoupon.mutateAsync(c.id);
      toast.success("Coupon deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const filtered = (coupons ?? []).filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const columns: DataTableColumn<AdminCoupon>[] = [
    { key: "code", header: "Code", render: (c) => <span className="font-mono font-bold text-xs">{c.code}</span> },
    {
      key: "value",
      header: "Discount",
      render: (c) => <span>{c.type === "PERCENT" ? `${Number(c.value)}% off` : `₹${Number(c.value).toLocaleString()} off`}</span>,
    },
    { key: "minOrder", header: "Min Order", render: (c) => <span>₹{Number(c.minOrderAmount).toLocaleString()}</span> },
    { key: "usage", header: "Used / Max", render: (c) => <span>{c.usedCount} / {c.maxUses ?? "∞"}</span> },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <button onClick={() => handleToggleActive(c)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isActive ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
          {c.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    { key: "expiresAt", header: "Expiry", render: (c) => <span>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "No expiry"}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />Add Coupon
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No coupons found"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search coupon code…"
        rowActions={(c) => (
          <>
            <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => handleDelete(c)} className="p-1.5 hover:bg-muted rounded-lg text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Code</label>
              <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponInput["type"] }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                <option value="PERCENT">Percent (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Value</label>
              <input type="number" value={form.value || ""} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Min Order Amount (₹)</label>
              <input type="number" value={form.minOrderAmount ?? ""} onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Max Uses</label>
              <input
                type="number"
                value={form.maxUses ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value === "" ? undefined : Number(e.target.value) }))}
                placeholder="Unlimited"
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiresAt ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value || undefined }))}
                className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Coupon"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BannersTab() {
  const { data: banners, isLoading } = useAdminBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const uploadImage = useUploadBannerImage();

  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BannerInput>(emptyBannerForm());
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyBannerForm());
    setShowForm(true);
  };

  const openEdit = (b: AdminBanner) => {
    setEditing(b);
    setForm({
      badge: b.badge ?? "",
      headline: b.headline,
      subheadline: b.subheadline ?? "",
      subtext: b.subtext ?? "",
      ctaPrimaryText: b.ctaPrimaryText ?? "",
      ctaPrimaryLink: b.ctaPrimaryLink ?? "",
      ctaSecondaryText: b.ctaSecondaryText ?? "",
      ctaSecondaryLink: b.ctaSecondaryLink ?? "",
      bgGradient: b.bgGradient ?? BG_PRESETS[0].key,
      imageUrl: b.imageUrl ?? "",
      sortOrder: b.sortOrder,
      startsAt: toDateInput(b.startsAt) || undefined,
      endsAt: toDateInput(b.endsAt) || undefined,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { url } = await uploadImage.mutateAsync(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.headline.trim()) {
      toast.error("Please provide a headline");
      return;
    }
    setIsSaving(true);
    try {
      const input: BannerInput = {
        ...form,
        badge: form.badge || undefined,
        subheadline: form.subheadline || undefined,
        subtext: form.subtext || undefined,
        ctaPrimaryText: form.ctaPrimaryText || undefined,
        ctaPrimaryLink: form.ctaPrimaryLink || undefined,
        ctaSecondaryText: form.ctaSecondaryText || undefined,
        ctaSecondaryLink: form.ctaSecondaryLink || undefined,
        imageUrl: form.imageUrl || undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      };
      if (editing) {
        await updateBanner.mutateAsync({ id: editing.id, input });
        toast.success("Banner updated");
      } else {
        await createBanner.mutateAsync(input);
        toast.success("Banner created");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (b: AdminBanner) => {
    try {
      await updateBanner.mutateAsync({ id: b.id, input: { isActive: !b.isActive } });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (b: AdminBanner) => {
    if (!window.confirm(`Delete banner "${b.headline}"? This cannot be undone.`)) return;
    try {
      await deleteBanner.mutateAsync(b.id);
      toast.success("Banner deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />Add Banner
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">Loading…</div>
      ) : (banners ?? []).length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-10 text-center text-muted-foreground">No banners found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(banners ?? []).map((b) => (
            <div key={b.id} className="border border-border rounded-2xl overflow-hidden bg-white">
              <div className={`h-20 bg-gradient-to-br ${BANNER_GRADIENT_CLASSES[b.bgGradient ?? ""] ?? DEFAULT_GRADIENT_CLASS} relative flex items-start p-2`}>
                {b.badge && <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">{b.badge}</span>}
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm truncate">{b.headline}</p>
                <p className="text-xs text-muted-foreground truncate">{b.subheadline || "—"}</p>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => handleToggleActive(b)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${b.isActive ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
                    {b.isActive ? "Active" : "Inactive"}
                  </button>
                  <span className="text-xs text-muted-foreground">Sort {b.sortOrder}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => openEdit(b)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-border rounded-lg text-xs font-semibold"><Pencil className="w-3 h-3" />Edit</button>
                  <button onClick={() => handleDelete(b)} className="flex items-center justify-center px-2 py-1.5 border border-border rounded-lg text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Headline</label>
              <input value={form.headline} onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Subheadline</label>
              <input value={form.subheadline} onChange={(e) => setForm((f) => ({ ...f, subheadline: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Badge</label>
              <input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="Limited Time" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Subtext</label>
              <textarea value={form.subtext} onChange={(e) => setForm((f) => ({ ...f, subtext: e.target.value }))} rows={2} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Primary CTA Text</label>
              <input value={form.ctaPrimaryText} onChange={(e) => setForm((f) => ({ ...f, ctaPrimaryText: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Primary CTA Link</label>
              <input value={form.ctaPrimaryLink} onChange={(e) => setForm((f) => ({ ...f, ctaPrimaryLink: e.target.value }))} placeholder="/products" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Secondary CTA Text</label>
              <input value={form.ctaSecondaryText} onChange={(e) => setForm((f) => ({ ...f, ctaSecondaryText: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Secondary CTA Link</label>
              <input value={form.ctaSecondaryLink} onChange={(e) => setForm((f) => ({ ...f, ctaSecondaryLink: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Gradient</label>
              <select value={form.bgGradient} onChange={(e) => setForm((f) => ({ ...f, bgGradient: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                {BG_PRESETS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder ?? ""} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Starts At</label>
              <input type="date" value={form.startsAt ?? ""} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value || undefined }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Ends At</label>
              <input type="date" value={form.endsAt ?? ""} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value || undefined }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1">Image</label>
              <div className="flex items-center gap-3">
                {form.imageUrl && <img src={form.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover bg-muted flex-shrink-0" />}
                <label className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-semibold cursor-pointer">
                  <ImagePlus className="w-3.5 h-3.5" />{isUploading ? "Uploading…" : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving || isUploading} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Banner"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
