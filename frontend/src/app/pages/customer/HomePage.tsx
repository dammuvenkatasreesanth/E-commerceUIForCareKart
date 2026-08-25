import { useNavigate } from "react-router";
import {
  ChevronRight, Users, Package, Truck, Zap,
  Check, ShieldCheck, BadgeCheck,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Seo } from "../../components/common/Seo";
import { BannerCarousel } from "../../components/common/BannerCarousel";
import { ProductCard } from "../../components/common/ProductCard";
import { Stars } from "../../components/common/Stars";
import { PACK_LABELS } from "../../lib/constants";
import { useProducts, useBanners, useCategories } from "../../hooks/useCatalog";
import type { Banner as LegacyBanner } from "../../types/product";

export function HomePage() {
  const navigate = useNavigate();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8, sort: "popularity" });
  const { data: bannersData, isLoading: bannersLoading } = useBanners();
  const { data: categoriesData } = useCategories();

  const products = productsData?.items ?? [];
  // BannerCarousel still expects the legacy Banner shape (field names differ
  // from the real API's Banner type) — map here rather than touching that
  // shared, out-of-scope component.
  const banners: LegacyBanner[] = (bannersData ?? []).map((b) => ({
    id: String(b.id),
    active: b.isActive,
    badge: b.badge ?? "",
    headline: b.headline,
    subheadline: b.subheadline ?? "",
    subtext: b.subtext ?? "",
    ctaPrimary: b.ctaPrimaryText ?? "",
    ctaPrimaryLink: b.ctaPrimaryLink ?? "",
    ctaSecondary: b.ctaSecondaryText ?? "",
    bg: b.bgGradient ?? "royal",
    imageUrl: b.imageUrl ?? "",
  }));

  const cats = (categoriesData ?? [])
    .filter((c) => c.showOnHomepage)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 md:pb-8">
      <Seo
        title="CareKart — Medical Gloves & PPE Marketplace"
        description="India's B2B PPE marketplace — factory-direct nitrile and latex gloves, N95 masks, and PPE kits for hospitals, clinics, and retailers. Bulk pricing, ISO/CE/FDA certified, pan-India delivery."
        path="/"
      />
      {/* Banner carousel */}
      {!bannersLoading && <BannerCarousel banners={banners} />}

      {/* Stats strip */}
      <div className="bg-white border border-border rounded-2xl mb-6 md:mb-8 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
          {[{ value: "50,000+", label: "Healthcare Clients", icon: Users }, { value: "200+", label: "Products Listed", icon: Package }, { value: "99.8%", label: "On-time Delivery", icon: Truck }, { value: "Same Day", label: "Order Dispatch", icon: Zap }].map(s => (
            <div key={s.label} className="flex items-center gap-3 px-5 py-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><s.icon className="w-5 h-5 text-primary" /></div>
              <div><p className="text-lg font-extrabold text-primary leading-tight">{s.value}</p><p className="text-[11px] text-muted-foreground font-medium">{s.label}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans']">Shop by Category</h2>
          <button onClick={() => navigate("/products")} className="text-xs text-primary font-semibold flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {cats.map(cat => (
            <button key={cat.id} onClick={() => navigate(`/products?category=${cat.slug}`)} className="group flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative bg-muted">
                <ImageWithFallback src={cat.imageUrl ?? undefined} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-center leading-tight text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bestsellers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans']">Today's Bestsellers</h2>
          <button onClick={() => navigate("/products")} className="text-xs text-primary font-semibold flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        {productsLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No products available right now.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.filter(p => p.badge === "Bestseller").slice(0, 4).concat(products.filter(p => p.badge !== "Bestseller")).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Bulk pricing banner */}
      <div className="bg-gradient-to-br from-accent to-teal-700 rounded-3xl p-6 md:p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-[11px] font-bold mb-3">VOLUME PRICING</span>
            <h2 className="text-xl md:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Scale Your Business with CareKart B2B</h2>
            <p className="text-teal-100 text-sm">Tiered discounts applied automatically on every product — no codes, no registration required.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {PACK_LABELS.slice(1).map((l, i) => (
              <div key={l} className="bg-white/15 rounded-xl p-3 text-center border border-white/20">
                <p className="text-xl font-extrabold">{[5, 12, 20][i]}%</p>
                <p className="text-[10px] text-teal-100 mt-0.5 leading-tight">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Built on Trust — redesigned */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-2">Built on Trust. Backed by Science.</h2>
          <p className="text-sm text-muted-foreground">Every product we supply is tested, certified, and proven in India's leading healthcare institutions.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: ShieldCheck, title: "ISO 13485:2016 Certified", desc: "Our quality management system meets the highest international standard for medical device manufacturing, ensuring every product is safe and effective.", color: "bg-blue-50 text-blue-700" },
            { icon: Truck, title: "Same-Day Dispatch Guarantee", desc: "Orders placed before 3 PM are dispatched the same day. Real-time tracking provided for every shipment, pan-India.", color: "bg-emerald-50 text-emerald-700" },
            { icon: BadgeCheck, title: "Factory-Direct Supply Chain", desc: "We manufacture and supply directly — no middlemen. This means you get better prices, consistent quality, and direct accountability.", color: "bg-purple-50 text-purple-700" },
            { icon: Users, title: "50,000+ Verified Clients", desc: "From AIIMS to local clinics, from Fortune 500 companies to independent pharmacies — CareKart serves the full spectrum of Indian healthcare.", color: "bg-orange-50 text-orange-700" },
          ].map(t => (
            <div key={t.title} className="bg-white border border-border rounded-2xl p-5 flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${t.color}`}><t.icon className="w-6 h-6" /></div>
              <div><p className="font-bold text-sm mb-1">{t.title}</p><p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p></div>
            </div>
          ))}
        </div>

        {/* Certification strip */}
        <div className="mt-4 bg-muted rounded-2xl px-5 py-3 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {["ISO 13485:2016", "CE Marked", "FDA Listed", "FSSAI Approved", "BIS Certified", "NABL Lab Tested"].map(c => (
            <div key={c} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Check className="w-3.5 h-3.5 text-emerald-500" />{c}</div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-8">
        <div className="text-center mb-5">
          <h2 className="text-lg md:text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-1">What Our Customers Say</h2>
          <p className="text-sm text-muted-foreground">Trusted by healthcare professionals, procurement teams, and retailers across India.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Apollo Pharmacy", role: "Chain of 500+ stores", text: "CareKart's bulk pricing and consistent quality have made them our primary PPE supplier. The GST invoicing is seamless for our procurement team.", rating: 5, avatar: "A" },
            { name: "Dr. Sunita Mehta", role: "Director, Mehta Clinics", text: "We've tried many suppliers but CareKart delivers exactly what they promise. The nitrile gloves are excellent and same-day dispatch has saved us multiple times.", rating: 5, avatar: "S" },
            { name: "SafeGuard Distributors", role: "Regional PPE Distributor", text: "The 20% pallet discount is real and quality is consistent box to box. We've scaled from 500 to 50,000 units/month with CareKart in 8 months.", rating: 5, avatar: "G" },
          ].map(t => (
            <div key={t.name} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-extrabold flex-shrink-0">{t.avatar}</div>
                <div><p className="font-bold text-sm">{t.name}</p><p className="text-[11px] text-muted-foreground">{t.role}</p></div>
              </div>
              <Stars rating={t.rating} small />
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
