import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "../../components/common/AuthLayout";
import { resetPassword } from "../../lib/api/endpoints/auth";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("This reset link is invalid or missing a token.");
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
      await resetPassword(token, password);
      toast.success("Password reset — sign in with your new password");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Set a New Password</h1>
      <p className="text-sm text-muted-foreground mb-6">Choose a new password for your account</p>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-semibold mb-1.5">New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" autoFocus />
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
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors">
          {isSubmitting ? "Saving…" : "Reset Password"}
        </button>
      </div>
    </AuthLayout>
  );
}
