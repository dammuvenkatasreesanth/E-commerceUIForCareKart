import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleLogin as googleLoginApi } from "../../lib/api/endpoints/auth";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z" />
    </svg>
  );
}

interface OAuthButtonsProps {
  onAuthenticated: (isNewUser: boolean) => void;
}

export function OAuthButtons({ onAuthenticated }: OAuthButtonsProps) {
  const authenticateAndMergeCart = useAuthenticateAndMergeCart();

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      const result = await googleLoginApi(credentialResponse.credential);
      await authenticateAndMergeCart(result.accessToken, result.user);
      onAuthenticated(result.isNewUser);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Google's own button can't be restyled, so we render it invisible and on
          top (to keep receiving real clicks), with a site-styled button underneath
          for the visuals — a standard trick for @react-oauth/google. */}
      <div className="group relative w-full h-10 rounded-xl border border-border overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold group-hover:bg-muted transition-colors pointer-events-none">
          <GoogleIcon />
          <span>Sign in with Google</span>
        </div>
        {/* Fixed width (not measured/dynamic) — @react-oauth/google renders the
            button once at mount and doesn't reliably resize its inner iframe if
            the width prop changes afterward, so a static, generously wide value
            plus overflow-hidden on the container above is what keeps this robust. */}
        <div className="absolute top-0 left-0 opacity-0">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed.")} width="400" />
        </div>
      </div>
    </div>
  );
}
