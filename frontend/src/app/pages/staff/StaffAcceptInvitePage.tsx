import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { ShieldCheck, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { staffAcceptInvite } from "../../lib/api/endpoints/auth";
import { staffPortalHome } from "../../types/user";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function StaffAcceptInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { loginStaff } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("This invite link is invalid or missing a token.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await staffAcceptInvite(token, password);
      loginStaff(result.accessToken, result.user);
      toast.success("Account activated");
      navigate(staffPortalHome(result.user.role), { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-foreground">Set Your Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Finish setting up your CareKart staff account</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full pl-9 pr-3 py-2.5 bg-muted text-foreground rounded-xl border border-border focus:border-primary focus:outline-none text-sm" autoFocus />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="Re-enter password" className="w-full pl-9 pr-3 py-2.5 bg-muted text-foreground rounded-xl border border-border focus:border-primary focus:outline-none text-sm" />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors text-sm">
              {isSubmitting ? "Activating…" : "Activate Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
