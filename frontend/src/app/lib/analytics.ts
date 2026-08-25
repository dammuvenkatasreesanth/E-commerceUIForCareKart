// Google Analytics 4 — loaded dynamically (not a static <script> in
// index.html) so it no-ops cleanly when VITE_GA_MEASUREMENT_ID isn't set,
// same "inert until configured" pattern used for the other third-party
// integrations in this app. Pageviews are fired manually on route change
// (send_page_view: false at init) since this is a client-side-routed SPA —
// the bare gtag.js snippet only counts the very first page load otherwise.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer!.push(args);
}

let initialized = false;

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Since 2024, gtag.js defaults analytics_storage to "denied" until told
  // otherwise (Google's Consent Mode) — without this, the script loads and
  // initializes normally but silently withholds every actual event, which
  // is indistinguishable from a broken integration when you're just
  // checking "did the script load". This site has no cookie-consent
  // banner gating anything, so there's no real consent state to wait on —
  // grant analytics outright; ad_storage stays denied since nothing here
  // does ad targeting.
  gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied" });
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path: string): void {
  if (!GA_MEASUREMENT_ID || !initialized) return;
  gtag("event", "page_view", { page_path: path });
}
