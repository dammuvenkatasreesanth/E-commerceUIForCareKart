// Google Analytics 4 — loaded dynamically (not a static <script> in
// index.html) so it no-ops cleanly when VITE_GA_MEASUREMENT_ID isn't set,
// same "inert until configured" pattern used for the other third-party
// integrations in this app. Pageviews are fired manually on route change
// (send_page_view: false at init) since this is a client-side-routed SPA —
// the bare gtag.js snippet only counts the very first page load otherwise.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

// This GA4 property is linked under a Google Tag container (Tag Assistant
// shows Tag IDs "G-68FKLXZ8LS, GT-PHCDKRLS" as one linked tag — a GT- id is
// created automatically when a GA4 property gets linked to something else,
// Google Ads account linking being the usual cause). Once that link exists,
// Google's own recommended install changes: the gtag.js *script* has to be
// loaded with the container's GT- id, not the bare G- measurement id — the
// destination is still configured with the G- id via gtag('config', ...)
// below. Loading the script with the bare G- id (what this used to do) is
// why Tag Assistant reported "Deferred hits… no hits were sent by this tag"
// despite everything else (consent, config, events) executing correctly.
const GTM_CONTAINER_ID = "GT-PHCDKRLS";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
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
  // Exposed globally to exactly match Google's own official snippet (and so
  // any external tooling — the GA4 tag-health checks included — that looks
  // for window.gtag specifically finds it), even though our own code here
  // only ever calls the local gtag() above.
  window.gtag = gtag;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_CONTAINER_ID}`;
  document.head.appendChild(script);

  // Since 2024, gtag.js defaults analytics_storage to "denied" until told
  // otherwise (Google's Consent Mode) — without this, the script loads and
  // initializes normally but silently withholds every actual event, which
  // is indistinguishable from a broken integration when you're just
  // checking "did the script load". This site has no cookie-consent banner
  // gating anything, so there's no real consent state to wait on — grant
  // analytics outright.
  //
  // All FOUR Consent Mode v2 categories are set explicitly, not just the
  // two analytics-relevant ones — if Google Signals / Ads linking is
  // enabled on the property, an incomplete v2 signal (missing
  // ad_user_data/ad_personalization) can make the tag treat consent as not
  // properly configured and withhold hits entirely, which matches exactly
  // what was observed: the tag loads and processes events internally but
  // never actually sends one.
  gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageview(path: string): void {
  if (!GA_MEASUREMENT_ID || !initialized) return;
  gtag("event", "page_view", { page_path: path });
}
