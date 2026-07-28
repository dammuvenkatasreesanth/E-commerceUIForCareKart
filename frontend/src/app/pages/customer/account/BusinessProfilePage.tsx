import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BadgeCheck, Building2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { useUpdateProfile } from "../../../hooks/useProfile";
import { validateGSTIN } from "../../../lib/gstin";

const GST_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
const GST_STATUS_COLOR: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  APPROVED: "text-emerald-600 bg-emerald-50",
  REJECTED: "text-red-600 bg-red-50",
};

export function BusinessProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [gstin, setGstin] = useState("");
  const [gstinError, setGstinError] = useState("");
  const gstinInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSaveGstin = () => {
    const trimmed = gstin.trim().toUpperCase();
    if (!validateGSTIN(trimmed)) {
      setGstinError("Invalid GSTIN format. Please check and try again.");
      return;
    }
    setGstinError("");
    updateProfile.mutate(
      { accountType: "BUSINESS", gstin: trimmed },
      {
        onSuccess: () => {
          toast.success("Submitted for approval");
          setGstin("");
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Profile</button>
      <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-4">Business Info</h2>
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${user.accountType === "BUSINESS" ? "bg-blue-50 border border-blue-100" : "bg-muted"}`}>
          <Building2 className={`w-5 h-5 flex-shrink-0 ${user.accountType === "BUSINESS" ? "text-blue-600" : "text-muted-foreground"}`} />
          <div>
            <p className="font-semibold text-sm">{user.accountType === "BUSINESS" ? "Business Account" : "Retail Account"}</p>
            <p className="text-xs text-muted-foreground">{user.accountType === "BUSINESS" ? "GST invoices & bulk pricing enabled" : "Upgrade to business for GST invoices"}</p>
          </div>
        </div>
        <div><label className="block text-xs font-semibold mb-1">GSTIN</label>
          {user.gstin ? (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl">
              <BadgeCheck className={`w-4 h-4 flex-shrink-0 ${user.gstStatus === "APPROVED" ? "text-emerald-600" : "text-muted-foreground"}`} />
              <span className="font-mono text-sm font-bold">{user.gstin}</span>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${GST_STATUS_COLOR[user.gstStatus] ?? "bg-muted text-muted-foreground"}`}>
                {GST_STATUS_LABEL[user.gstStatus] ?? user.gstStatus}
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <input ref={gstinInputRef} value={gstin} onChange={e => { setGstin(e.target.value.toUpperCase()); setGstinError(""); }} placeholder="27AABCC1234M1Z5" maxLength={15} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
              {gstinError && <p className="text-xs text-destructive">{gstinError}</p>}
              <p className="text-[10px] text-muted-foreground">Add your GSTIN to receive GST-compliant tax invoices and unlock B2B bulk pricing.</p>
              <button onClick={handleSaveGstin} disabled={!gstin.trim() || updateProfile.isPending} className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-40">
                {updateProfile.isPending ? "Saving..." : "Save GSTIN"}
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-border pt-4 space-y-2.5">
          {[{ label: "Account Type", value: user.accountType === "BUSINESS" ? "Business" : "Retail" }, { label: "Phone", value: user.phone ?? "—" }].map(row => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className="text-xs font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
        {user.accountType === "RETAIL" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-xs font-bold text-primary mb-1">Upgrade to Business</p>
            <p className="text-[11px] text-muted-foreground mb-3">Add your GSTIN above to unlock bulk pricing, GST invoices, and dedicated B2B support.</p>
            <button onClick={() => gstinInputRef.current?.focus()} className="text-xs font-bold text-primary flex items-center gap-1">Add GSTIN now <ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}
