import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { OAuthButtons } from "../../components/common/OAuthButtons";
import { customerSignup, resendVerification } from "../../lib/api/endpoints/auth";
import { setPostVerifyRedirect } from "../../lib/postVerifyRedirect";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || isSubmitting) return;
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
      await customerSignup(name.trim(), email.trim(), password);
      if (from) setPostVerifyRedirect(`${from.pathname}${from.search ?? ""}`);
      setSent(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    try {
      await resendVerification(email.trim());
      toast.success("Verification email sent again.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Click it to activate your account.
          </p>
          <button onClick={handleResend} disabled={isResending} className="text-xs text-primary font-semibold hover:underline disabled:opacity-50">
            {isResending ? "Resending…" : "Didn't get it? Resend email"}
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Create your account</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign up to start shopping with CareKart</p>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-semibold mb-1.5">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Re-enter password"
            className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !email.trim() || isSubmitting}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating account…" : "Create Account"}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground font-medium">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <OAuthButtons
        onAuthenticated={(isNewUser) => {
          if (isNewUser) navigate("/complete-profile", { state: { from } });
          else navigate(from ? `${from.pathname}${from.search ?? ""}` : "/account");
        }}
      />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
