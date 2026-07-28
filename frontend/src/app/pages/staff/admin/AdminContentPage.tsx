import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "../../../components/common/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs";
import {
  useContentPages,
  useCreateContentPage,
  useUpdateContentPage,
  useDeleteContentPage,
  useCampaigns,
  useCreateCampaign,
} from "../../../hooks/admin/useAdminMarketing";
import type { ContentPageInput, CampaignInput } from "../../../lib/api/endpoints/admin/marketing";
import type { ContentPage, Campaign } from "../../../types/admin";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

function formatSegment(segment: unknown): string {
  if (segment && typeof segment === "object" && "accountType" in segment) {
    const accountType = (segment as { accountType?: string }).accountType;
    if (accountType === "RETAIL") return "Retail customers";
    if (accountType === "BUSINESS") return "Business customers";
  }
  return "All customers";
}

const emptyPageForm = (): ContentPageInput => ({ slug: "", title: "", bodyHtml: "" });

interface CampaignFormState {
  subject: string;
  bodyHtml: string;
  accountType: "" | "RETAIL" | "BUSINESS";
  sendNow: boolean;
}

const emptyCampaignForm = (): CampaignFormState => ({ subject: "", bodyHtml: "", accountType: "", sendNow: false });

export function AdminContentPage() {
  return (
    <div>
      <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-5">Content</h1>
      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages">Content Pages</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>
        <TabsContent value="pages" className="mt-4">
          <ContentPagesTab />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-4">
          <CampaignsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentPagesTab() {
  const { data: pages, isLoading } = useContentPages();
  const createPage = useCreateContentPage();
  const updatePage = useUpdateContentPage();
  const deletePage = useDeleteContentPage();

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ContentPage | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ContentPageInput>(emptyPageForm());
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyPageForm());
    setShowForm(true);
  };

  const openEdit = (p: ContentPage) => {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title, bodyHtml: p.bodyHtml });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim() || !form.bodyHtml.trim()) {
      toast.error("Please provide a slug, title, and body");
      return;
    }
    setIsSaving(true);
    try {
      const input: ContentPageInput = { ...form, slug: form.slug.trim() };
      if (editing) {
        await updatePage.mutateAsync({ id: editing.id, input });
        toast.success("Page updated");
      } else {
        await createPage.mutateAsync(input);
        toast.success("Page created");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (p: ContentPage) => {
    try {
      await updatePage.mutateAsync({ id: p.id, input: { isPublished: !p.isPublished } });
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (p: ContentPage) => {
    if (!window.confirm(`Delete page "${p.title}"? This cannot be undone.`)) return;
    try {
      await deletePage.mutateAsync(p.id);
      toast.success("Page deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const filtered = (pages ?? []).filter(
    (p) => p.slug.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: DataTableColumn<ContentPage>[] = [
    { key: "slug", header: "Slug", render: (p) => <span className="font-mono text-xs">{p.slug}</span> },
    { key: "title", header: "Title", render: (p) => <span className="font-semibold">{p.title}</span> },
    {
      key: "published",
      header: "Status",
      render: (p) => (
        <button onClick={() => handleTogglePublished(p)} className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isPublished ? "bg-blue-50 text-blue-700" : "bg-muted text-muted-foreground"}`}>
          {p.isPublished ? "Published" : "Draft"}
        </button>
      ),
    },
    { key: "createdAt", header: "Created", render: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />Add Page
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField={(p) => p.id}
        isLoading={isLoading}
        emptyMessage="No content pages found"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search slug or title…"
        rowActions={(p) => (
          <>
            <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
            <button onClick={() => handleDelete(p)} className="p-1.5 hover:bg-muted rounded-lg text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Page" : "Add Page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="privacy-policy" className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Body (HTML)</label>
              <textarea value={form.bodyHtml} onChange={(e) => setForm((f) => ({ ...f, bodyHtml: e.target.value }))} rows={10} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono resize-y" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : "Save Page"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampaignsTab() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CampaignFormState>(emptyCampaignForm());
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setForm(emptyCampaignForm());
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.subject.trim() || !form.bodyHtml.trim()) {
      toast.error("Please provide a subject and body");
      return;
    }
    setIsSaving(true);
    try {
      const input: CampaignInput = {
        subject: form.subject.trim(),
        bodyHtml: form.bodyHtml,
        segment: form.accountType ? { accountType: form.accountType } : undefined,
        sendNow: form.sendNow,
      };
      await createCampaign.mutateAsync(input);
      toast.success(form.sendNow ? "Campaign is sending" : "Campaign saved as draft");
      setShowForm(false);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const columns: DataTableColumn<Campaign>[] = [
    { key: "subject", header: "Subject", render: (c) => <span className="font-semibold">{c.subject}</span> },
    { key: "sentAt", header: "Sent", render: (c) => (c.sentAt ? new Date(c.sentAt).toLocaleString() : "Not sent yet") },
    { key: "recipientCount", header: "Recipients", render: (c) => c.recipientCount },
    { key: "segment", header: "Segment", render: (c) => <span className="text-xs text-muted-foreground">{formatSegment(c.segment)}</span> },
  ];

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl">
          <Plus className="w-3.5 h-3.5" />New Campaign
        </button>
      </div>

      <DataTable columns={columns} data={campaigns ?? []} keyField={(c) => c.id} isLoading={isLoading} emptyMessage="No campaigns found" />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Subject</label>
              <input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Body (HTML)</label>
              <textarea value={form.bodyHtml} onChange={(e) => setForm((f) => ({ ...f, bodyHtml: e.target.value }))} rows={10} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono resize-y" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Segment</label>
              <select value={form.accountType} onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value as CampaignFormState["accountType"] }))} className="w-full px-3 py-2 bg-muted rounded-xl border border-transparent focus:outline-none text-sm">
                <option value="">All customers</option>
                <option value="RETAIL">Retail customers</option>
                <option value="BUSINESS">Business customers</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sendNow} onChange={(e) => setForm((f) => ({ ...f, sendNow: e.target.checked }))} className="accent-primary" />
              Send now
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-50">{isSaving ? "Saving…" : form.sendNow ? "Send Campaign" : "Save Draft"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
