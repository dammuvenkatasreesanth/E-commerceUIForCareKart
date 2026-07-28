import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { staffLogin } from "../../lib/api/endpoints/auth";
import { staffPortalHome } from "../../types/user";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

// Reached only by typing the URL directly — never linked from customer nav.
// One shared login for Admin/Employee; the destination portal is decided
// by the authenticated user's role, not by this page.
export function StaffLoginPage() {
  const navigate = useNavigate();
  const { loginStaff } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await staffLogin(email.trim(), password);
      loginStaff(result.accessToken, result.user);
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
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-foreground">CareKart Staff Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin · Employee</p>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@carekart.local"
                  className="w-full pl-9 pr-3 py-2.5 bg-muted text-foreground rounded-xl border border-border focus:border-primary focus:outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-muted text-foreground rounded-xl border border-border focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || !password || isSubmitting}
              className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors text-sm"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
            <button onClick={() => navigate("/staff/forgot-password")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
