// In-memory only — never persisted to localStorage/sessionStorage, so an XSS bug
// can't exfiltrate a long-lived credential. Lost on hard refresh by design; the
// AuthContext boot sequence silently reacquires it via the httpOnly refresh cookie.
let accessToken: string | null = null;
let lastKnownPortal: "customer" | "staff" | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null, portal?: "customer" | "staff"): void {
  accessToken = token;
  if (portal) lastKnownPortal = portal;
  if (token === null) lastKnownPortal = null;
}

export function getLastKnownPortal(): "customer" | "staff" | null {
  return lastKnownPortal;
}

type SessionExpiredListener = () => void;
let sessionExpiredListener: SessionExpiredListener | null = null;

/** AuthContext registers itself here so the API client can report a failed
 * silent-refresh without a circular import between client.ts and AuthContext.tsx. */
export function onSessionExpired(listener: SessionExpiredListener): void {
  sessionExpiredListener = listener;
}

export function notifySessionExpired(): void {
  sessionExpiredListener?.();
}
