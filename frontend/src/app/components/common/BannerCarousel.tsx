import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "../../types/product";

// Banner.bg holds a preset key (e.g. "royal"), not a raw class string — Tailwind's
// JIT scanner only generates CSS for class names it can find literally in scanned
// source files, so a class string built at runtime from API data (or worse, an
// arbitrary-value string like `from-[#1741B0]` coming straight from the DB) would
// never get its CSS generated. This lookup's values are the literal strings Tailwind
// needs to see; never interpolate `bg` directly into a className.
const BANNER_GRADIENT_CLASSES: Record<string, string> = {
  royal: "from-banner-royal-from to-banner-royal-to",
  teal: "from-banner-teal-from to-banner-teal-to",
  purple: "from-banner-purple-from to-banner-purple-to",
  orange: "from-banner-orange-from to-banner-orange-to",
  navy: "from-banner-navy-from to-banner-navy-to",
};
const DEFAULT_GRADIENT_CLASS = BANNER_GRADIENT_CLASSES.royal;

// Banner.ctaPrimaryLink still stores legacy Page string values (e.g. "listing")
// carried over from the pre-router mock data — map them to routes here until
// mockData is updated to store real paths.
const LEGACY_PAGE_TO_PATH: Record<string, string> = {
  home: "/",
  listing: "/products",
  detail: "/products",
  cart: "/cart",
  checkout: "/checkout",
  confirmation: "/confirmation",
  account: "/account",
  "account-order": "/account",
  admin: "/admin",
  login: "/login",
};

// Admins now type real paths ("/products") or full URLs (a catalogue PDF,
// an external page) straight into the CTA link fields — the legacy-key
// lookup above only covers banners seeded before that admin UI existed.
// A link that isn't one of those old keys is used as-is; a full http(s)
// URL opens in a new tab instead of trying to client-side-route to it.
function goToLink(navigate: ReturnType<typeof useNavigate>, link: string | null | undefined) {
  if (!link) return;
  const target = LEGACY_PAGE_TO_PATH[link] ?? link;
  if (/^https?:\/\//i.test(target)) {
    window.open(target, "_blank", "noopener,noreferrer");
    return;
  }
  navigate(target.startsWith("/") ? target : `/${target}`);
}

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const navigate = useNavigate();
  const active = banners.filter(b => b.active);
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (active.length < 2) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % active.length), 4500);
  }, [active.length]);

  useEffect(() => { start(); return () => { if (timer.current) clearInterval(timer.current); }; }, [start]);

  const go = (n: number) => { setIdx(n); if (timer.current) clearInterval(timer.current); start(); };

  if (active.length === 0) return null;
  const b = active[idx];

  return (
    <div className="relative rounded-3xl overflow-hidden my-4 md:my-6 min-h-[260px] md:min-h-[320px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${BANNER_GRADIENT_CLASSES[b.bg] ?? DEFAULT_GRADIENT_CLASS} transition-all duration-700`} />
      <div className="relative z-10 flex items-center min-h-[260px] md:min-h-[320px]">
        <div className="flex-1 px-6 py-8 md:py-10 md:px-12">
          {b.badge && <span className="inline-flex items-center px-3 py-1 bg-white/15 border border-white/20 rounded-full text-xs font-semibold text-white mb-4">{b.badge}</span>}
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] text-white mb-1">
            {b.headline}
          </h1>
          {b.subheadline && <h2 className="text-2xl md:text-4xl font-extrabold leading-tight font-['Plus_Jakarta_Sans'] text-white/80 mb-3">{b.subheadline}</h2>}
          <p className="text-white/80 text-sm md:text-base mb-6 max-w-md">{b.subtext}</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => goToLink(navigate, b.ctaPrimaryLink)} className="px-5 py-2.5 bg-white text-primary font-bold rounded-xl text-sm hover:bg-opacity-90 transition-colors">{b.ctaPrimary}</button>
            {b.ctaSecondary && <button onClick={() => goToLink(navigate, b.ctaSecondaryLink)} className="px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl text-sm hover:bg-white/20 transition-colors">{b.ctaSecondary}</button>}
          </div>
        </div>
        {b.imageUrl && <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-64 md:w-96"><img src={b.imageUrl as string} alt="" className="w-full h-full object-cover opacity-25 md:opacity-35" /></div>}
      </div>

      {/* Dots */}
      {active.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {active.map((_, i) => <button key={i} onClick={() => go(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-white w-5" : "bg-white/40"}`} />)}
        </div>
      )}

      {/* Arrows */}
      {active.length > 1 && <>
        <button onClick={() => go((idx - 1 + active.length) % active.length)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"><ChevronLeft className="w-4 h-4" /></button>
        <button onClick={() => go((idx + 1) % active.length)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"><ChevronRight className="w-4 h-4" /></button>
      </>}
    </div>
  );
}
