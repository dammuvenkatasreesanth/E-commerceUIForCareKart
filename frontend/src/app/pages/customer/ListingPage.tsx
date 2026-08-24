import { useState } from "react";
import { useSearchParams } from "react-router";
import { Search, X, Filter } from "lucide-react";
import { ProductCard } from "../../components/common/ProductCard";
import { Seo } from "../../components/common/Seo";
import { useLegacyStore } from "../../context/LegacyStoreContext";
import { useProducts, useCategories } from "../../hooks/useCatalog";
import type { ProductListQuery } from "../../types/catalog";

const SORT_TO_QUERY: Record<string, ProductListQuery["sort"]> = {
  popular: "popularity",
  "price-low": "price_asc",
  "price-high": "price_desc",
  rating: "rating",
};

export function ListingPage() {
  const { searchQuery, setSearchQuery } = useLegacyStore();
  const { data: categories } = useCategories();
  // Category filter lives in the URL (?category=slug) so links from the navbar
  // and other pages can deep-link straight into a filtered listing — null = "All".
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category");
  const setActiveCategorySlug = (slug: string | null) => {
    setSearchParams(slug ? { category: slug } : {});
  };
  const [sortBy, setSortBy] = useState("popular");

  const q = searchQuery.trim();

  const query: ProductListQuery = {
    limit: 50,
    sort: SORT_TO_QUERY[sortBy],
    ...(activeCategorySlug ? { category: activeCategorySlug } : {}),
    ...(q ? { q } : {}),
  };

  const { data, isLoading } = useProducts(query);
  const products = data?.items ?? [];

  const chips = [{ slug: null as string | null, name: "All" }, ...((categories ?? []).map(c => ({ slug: c.slug, name: c.name })))];
  const activeCategory = (categories ?? []).find((c) => c.slug === activeCategorySlug);
  const seoTitle = activeCategory ? `${activeCategory.name} — Bulk PPE Supplies` : "Shop All Products";
  const seoDescription = activeCategory
    ? `Browse ${activeCategory.name.toLowerCase()} at factory-direct bulk pricing — ISO/CE/FDA certified, pan-India delivery.`
    : "Browse the full CareKart catalog — medical gloves, masks, and PPE at factory-direct bulk pricing.";
  const seoPath = activeCategorySlug ? `/products?category=${activeCategorySlug}` : "/products";

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <div className="mb-4 md:hidden"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products…" className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-border rounded-xl focus:border-primary/40 focus:outline-none" />{searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}</div></div>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white border border-border rounded-2xl p-4 sticky top-20">
            <p className="font-bold text-sm mb-3 flex items-center gap-2"><Filter className="w-4 h-4" />Filters</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
            {chips.map(cat => <button key={cat.name} onClick={() => setActiveCategorySlug(cat.slug)} className={`block w-full text-left px-2 py-1.5 rounded-lg text-xs mb-0.5 transition-colors ${activeCategorySlug === cat.slug ? "bg-secondary text-primary font-semibold" : "hover:bg-muted text-foreground"}`}>{cat.name}</button>)}
          </div>
        </aside>
        <div className="flex-1">
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto mb-3 md:hidden scrollbar-none">{chips.map(cat => <button key={cat.name} onClick={() => setActiveCategorySlug(cat.slug)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${activeCategorySlug === cat.slug ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground"}`}>{cat.name}</button>)}<span className="flex-shrink-0 w-2" /></div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">{isLoading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}${q ? ` for "${searchQuery}"` : ""}`}</p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs bg-muted border-none rounded-lg px-2 py-1.5 focus:outline-none"><option value="popular">Most Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select>
          </div>
          {isLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-12 h-12 text-border mb-4" />
              <p className="font-bold text-lg mb-1">No products found</p>
              <p className="text-sm text-muted-foreground mb-4">No results for "{searchQuery}". Try a different term.</p>
              <button onClick={() => setSearchQuery("")} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
