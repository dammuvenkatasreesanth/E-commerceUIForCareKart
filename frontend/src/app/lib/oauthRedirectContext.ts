import type { CartQuoteLineItem } from "../types/cart";

// Carries "where to send the user back to, and any in-progress state" across
// the Google redirect-mode round trip (this page -> accounts.google.com ->
// our backend -> back). A real cross-origin navigation doesn't preserve
// location.state or component state, unlike the old popup flow which never
// left the page — mirrors lib/postVerifyRedirect.ts's approach for the same
// reason (the emailed-link round trip has the same problem).
const STORAGE_KEY = "carekart_oauth_redirect_context";

interface OAuthRedirectContext {
  returnPath: string;
  buyNow?: CartQuoteLineItem;
}

export function setOAuthRedirectContext(ctx: OAuthRedirectContext): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
}

export function takeOAuthRedirectContext(): OAuthRedirectContext | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(STORAGE_KEY);
  try {
    return JSON.parse(raw) as OAuthRedirectContext;
  } catch {
    return null;
  }
}
