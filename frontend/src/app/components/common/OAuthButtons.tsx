import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

// Popup-based sign-in (GIS's default) is unreliable in practice: desktop
// browsers with strict tracking-prevention (Edge, some ad-blockers) silently
// block the popup, and mobile web browsers frequently hang or block it
// outright. Redirect mode does a plain top-level navigation instead — no
// popup involved — so it works everywhere; the tradeoff is the credential
// arrives via a full-page POST to the backend (see auth.controller.ts's
// googleRedirectCallbackHandler), not a same-page JS callback.
const GOOGLE_CALLBACK_URL = `${import.meta.env.VITE_API_BASE_URL as string}/auth/google/callback`;

interface OAuthButtonsProps {
  /** Runs synchronously right as the Google button is clicked, before the
   * page navigates away — the caller's chance to persist anything (return
   * path, in-progress state) that needs to survive the round trip. */
  onBeforeGoogleRedirect?: () => void;
}

export function OAuthButtons({ onBeforeGoogleRedirect }: OAuthButtonsProps) {
  return (
    <div className="space-y-2.5">
      {/* Plain, un-styled Google button — a previous version rendered it
          invisible under a site-styled overlay, but that relies on Google's
          real button having fully rendered at the exact moment of the click.
          On slower mobile connections it sometimes hadn't yet, so taps
          landed on nothing. Not worth the fragility for a style match. */}
      <div className="w-full flex justify-center" onClickCapture={onBeforeGoogleRedirect}>
        <GoogleLogin
          onSuccess={() => {}}
          onError={() => toast.error("Google sign-in failed. Please try again.")}
          ux_mode="redirect"
          login_uri={GOOGLE_CALLBACK_URL}
          width="320"
        />
      </div>
    </div>
  );
}
