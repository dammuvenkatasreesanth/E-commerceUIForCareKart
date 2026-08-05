import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Loader2, XCircle } from "lucide-react";
import { AuthLayout } from "../../components/common/AuthLayout";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";
import { verifyEmail } from "../../lib/api/endpoints/auth";
import { takePostVerifyRedirect } from "../../lib/postVerifyRedirect";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // StrictMode double-invoke guard — the token is single-use
    ran.current = true;

    if (!token) {
      setError("This verification link is invalid or missing a token.");
      return;
    }

    (async () => {
      try {
        const result = await verifyEmail(token);
        await authenticateAndMergeCart(result.accessToken, result.user);
        const redirect = takePostVerifyRedirect();
        navigate(redirect ?? "/complete-profile", { replace: true });
      } catch (err) {
        setError(errorMessage(err));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthLayout>
      <div className="text-center py-6">
        {error ? (
          <>
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Verification failed</h1>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Link to="/login" className="text-sm text-primary font-semibold hover:underline">Back to sign in</Link>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Verifying your email…</h1>
            <p className="text-sm text-muted-foreground">Hang tight, this only takes a moment.</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
