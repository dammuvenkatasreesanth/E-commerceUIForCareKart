// Carries "where to send the user after they click the emailed verification
// link" across the email round-trip. location.state (react-router's normal
// mechanism for this) doesn't survive that trip — clicking an emailed link is
// a fresh page load, not client-side navigation — so this uses localStorage
// instead, keyed for a single pending redirect at a time.
const STORAGE_KEY = "carekart_post_verify_redirect";

export function setPostVerifyRedirect(path: string): void {
  localStorage.setItem(STORAGE_KEY, path);
}

export function takePostVerifyRedirect(): string | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (value) localStorage.removeItem(STORAGE_KEY);
  return value;
}
