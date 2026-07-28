import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { updateProfile } from "../../lib/api/endpoints/users";
import { validateGSTIN } from "../../lib/gstin";
import { useAuth } from "../../context/AuthContext";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

// Reached right after a brand-new customer verifies their phone OTP (the
// backend creates the account at verify time, so the user is already
// authenticated here — this is deliberately NOT wrapped by
// RedirectIfAuthenticated, only by RequireCustomerAuth, so it can render for
// an authenticated-but-incomplete-profile user without being redirected away.
export function CompleteProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isRetailer, setIsRetailer] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstinError, setGstinError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goAfterLogin = () => {
    const from = (location.state as { from?: Location } | null)?.from;
    navigate(from ? `${from.pathname}${from.search ?? ""}` : "/account");
  };

  const handleRegister = async () => {
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
        ...(email.trim() ? { email: email.trim() } : {}),
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
        <p className="text-sm text-muted-foreground mb-6">Almost there — tell us a bit about yourself</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name <span className="text-destructive">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
          </div>
          <label className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${isRetailer ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
            <input type="checkbox" checked={isRetailer} onChange={e => setIsRetailer(e.target.checked)} className="w-4 h-4 accent-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Purchasing for a registered business</p>
              <p className="text-xs text-muted-foreground">Get GST invoices &amp; B2B bulk pricing</p>
            </div>
          </label>
          {isRetailer && (
            <div>
              <label className="block text-xs font-semibold mb-1">GSTIN</label>
              <input value={gstin} onChange={e => { setGstin(e.target.value.toUpperCase()); setGstinError(""); }} placeholder="27AABCC1234M1Z5" maxLength={15} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm font-mono" />
              {gstinError && <p className="text-xs text-destructive mt-1">{gstinError}</p>}
              <p className="text-[10px] text-muted-foreground mt-1">15-character GST identification number. Leave blank if unavailable.</p>
            </div>
          )}
        </div>
        <button onClick={handleRegister} disabled={!name.trim() || isSubmitting} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
          {isSubmitting ? "Saving…" : "Create Account & Continue"}
        </button>
      </div>
    </div>
  );
}
