import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import { toast } from "sonner";
import { AuthLayout } from "../../components/common/AuthLayout";
import { OAuthButtons } from "../../components/common/OAuthButtons";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";
import { customerLogin } from "../../lib/api/endpoints/auth";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: Location } | null)?.from;

  const goAfterLogin = () => {
    navigate(from ? `${from.pathname}${from.search ?? ""}` : "/account");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await customerLogin(email.trim(), password);
      await authenticateAndMergeCart(result.accessToken, result.user);
      goAfterLogin();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">Welcome back</h1>
      <p className="text-sm text-muted-foreground mb-6">Log in to your CareKart account</p>

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
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:underline">Forgot password?</Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your password"
            className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!email.trim() || !password || isSubmitting}
          className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
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
          else goAfterLogin();
        }}
      />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
