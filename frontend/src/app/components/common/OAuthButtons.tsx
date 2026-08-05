import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { loadFacebookSdk, facebookLoginPopup } from "../../lib/facebookSdk";
import { googleLogin as googleLoginApi, facebookLogin as facebookLoginApi } from "../../lib/api/endpoints/auth";
import { useAuthenticateAndMergeCart } from "../../hooks/useAuthenticateAndMergeCart";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
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

  const handleFacebookClick = async () => {
    try {
      const appId = import.meta.env.VITE_FACEBOOK_APP_ID as string;
      await loadFacebookSdk(appId);
      const auth = await facebookLoginPopup();
      if (!auth) return; // user cancelled or declined permissions
      const result = await facebookLoginApi(auth.accessToken, auth.userId);
      await authenticateAndMergeCart(result.accessToken, result.user);
      onAuthenticated(result.isNewUser);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex justify-center">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed.")} width="320" />
      </div>
      <button
        onClick={handleFacebookClick}
        type="button"
        className="w-full py-2.5 border border-border rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
      >
        Continue with Facebook
      </button>
    </div>
  );
}
