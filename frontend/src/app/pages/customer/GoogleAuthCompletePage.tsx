import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";
import { refreshSession } from "../../lib/api/endpoints/auth";
import { api } from "../../lib/api/client";
import { takeOAuthRedirectContext } from "../../lib/oauthRedirectContext";
import type { AuthUser } from "../../types/user";

// Landing spot for the Google redirect-mode round trip: the backend already
// set the httpOnly refresh cookie before sending the browser here, so this
// page just needs to turn that into a live session (same
// refresh-then-fetch-profile sequence AuthContext runs on every app boot)
// and then continue wherever the user was headed before they left.
export function GoogleAuthCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const ctx = takeOAuthRedirectContext();
      const isNewUser = searchParams.get("newUser") === "1";

      try {
        const { accessToken } = await refreshSession();
        const user = await api.get<AuthUser>("/users/me");
        await authenticateAndMergeCart(accessToken, user);

        if (isNewUser) {
          navigate("/complete-profile", { replace: true, state: ctx ? { from: { pathname: ctx.returnPath, search: "" } } : undefined });
        } else {
          navigate(ctx?.returnPath ?? "/account", { replace: true, state: ctx?.buyNow ? { buyNow: ctx.buyNow } : undefined });
        }
      } catch {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, searchParams, authenticateAndMergeCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
