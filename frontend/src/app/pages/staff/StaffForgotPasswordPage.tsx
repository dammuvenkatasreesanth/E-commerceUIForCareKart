import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { staffForgotPassword } from "../../lib/api/endpoints/auth";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function StaffForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await staffForgotPassword(email.trim());
      setSent(true);
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
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-foreground">Reset Password</h1>
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          {sent ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              If an account exists for <span className="font-semibold text-foreground">{email}</span>, a reset link has been sent.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="you@carekart.local" className="w-full pl-9 pr-3 py-2.5 bg-muted text-foreground rounded-xl border border-border focus:border-primary focus:outline-none text-sm" autoFocus />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={!email.trim() || isSubmitting} className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors text-sm">
                {isSubmitting ? "Sending…" : "Send Reset Link"}
              </button>
            </div>
          )}
          <button onClick={() => navigate("/staff/login")} className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-4">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
