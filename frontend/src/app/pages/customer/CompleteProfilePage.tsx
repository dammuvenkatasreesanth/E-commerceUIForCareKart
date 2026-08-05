import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { updateProfile } from "../../lib/api/endpoints/users";
import { validateGSTIN } from "../../lib/gstin";
import { useAuth } from "../../context/AuthContext";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

// Reached after any brand-new customer's first session (OAuth signup, or
// email/password signup followed by email verification) — the account
// already has a name by this point (collected at signup, or provided by the
// OAuth provider), so this is purely an optional business-details step, not
// a required registration gate. Deliberately NOT wrapped by
// RedirectIfAuthenticated, only by RequireCustomerAuth, so it renders for an
// authenticated user without being redirected away.
export function CompleteProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [isRetailer, setIsRetailer] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstinError, setGstinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goAfterLogin = () => {
    const from = (location.state as { from?: Location } | null)?.from;
    navigate(from ? `${from.pathname}${from.search ?? ""}` : "/account");
  };

  const handleSave = async () => {
    if (!name.trim() || isSubmitting) return;
    if (isRetailer && gstin) {
      if (!validateGSTIN(gstin)) {
        setGstinError("Invalid GSTIN format. Please check and try again.");
        return;
      }
    }
    const isBusiness = isRetailer && gstin && validateGSTIN(gstin);
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        accountType: isBusiness ? "BUSINESS" : "RETAIL",
        ...(isBusiness ? { gstin: gstin.toUpperCase() } : {}),
      });
      // RedirectIfAuthenticated (guarding /login) and other UI keyed off
      // user.name being non-null depend on AuthContext's cached user — refresh
      // it before navigating away, since updateProfile() doesn't update it itself.
      await refreshProfile();
      goAfterLogin();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-8 bg-white">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Complete Profile</h1>
        <p className="text-sm text-muted-foreground mb-6">Almost there — a couple more details (optional)</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name <span className="text-destructive">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
          </div>
          <label className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${isRetailer ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
            <input type="checkbox" checked={isRetailer} onChange={(e) => setIsRetailer(e.target.checked)} className="w-4 h-4 accent-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Purchasing for a registered business</p>
              <p className="text-xs text-muted-foreground">Get GST invoices &amp; B2B bulk pricing</p>
            </div>
          </label>
          {isRetailer && (
            <div>
              <label className="block text-xs font-semibold mb-1">GSTIN</label>
              <input value={gstin} onChange={(e) => { setGstin(e.target.value.toUpperCase()); setGstinError(""); }} placeholder="27AABCC1234M1Z5" maxLength={15} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
              {gstinError && <p className="text-xs text-destructive mt-1">{gstinError}</p>}
              <p className="text-[10px] text-muted-foreground mt-1">15-character GST identification number. Leave blank if unavailable.</p>
            </div>
          )}
        </div>
        <button onClick={handleSave} disabled={!name.trim() || isSubmitting} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
          {isSubmitting ? "Saving…" : "Save & Continue"}
        </button>
        <button onClick={goAfterLogin} disabled={isSubmitting} className="w-full py-2.5 text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors mt-2">
          Skip for now
        </button>
      </div>
    </div>
  );
}
