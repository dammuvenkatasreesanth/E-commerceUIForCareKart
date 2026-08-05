import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "../../components/common/AuthLayout";
import { forgotPassword } from "../../lib/api/endpoints/auth";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Reset Password</h1>
      <p className="text-sm text-muted-foreground mb-6">We'll email you a link to choose a new password</p>

      {sent ? (
        <p className="text-sm text-muted-foreground py-4">
          If an account exists for <span className="font-semibold text-foreground">{email}</span>, a reset link has been sent.
        </p>
      ) : (
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
              autoFocus
            />
          </div>
          <button onClick={handleSubmit} disabled={!email.trim() || isSubmitting} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </button>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link to="/login" className="text-primary font-semibold hover:underline">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
