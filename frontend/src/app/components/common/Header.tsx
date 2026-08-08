import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ShoppingCart, Search, User, Shield, Truck,
  Phone, X, ArrowLeft, ChevronRight,
  Home, Package, Tag, Menu,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Logo } from "../Logo";
import { UserAvatar } from "./UserAvatar";
import type { AuthUser } from "../../types/user";
import { useAutosuggest, useCategories } from "../../hooks/useCatalog";

export function Header({ cartCount, isLoggedIn, currentUser, searchQuery, setSearchQuery }: {
  cartCount: number;
  isLoggedIn: boolean;
  currentUser: AuthUser | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [focused, setFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmed = searchQuery.trim().toLowerCase();
  const { data: suggestionData } = useAutosuggest(searchQuery);
  const suggestions = trimmed.length >= 1 ? (suggestionData ?? []).slice(0, 6) : [];
  const { data: categories } = useCategories();

  const goToCategory = (slug: string) => navigate(`/products?category=${slug}`);

  const showDropdown = focused && trimmed.length >= 1;

  const commit = () => {
    if (!trimmed) return;
    navigate("/products");
    setFocused(false);
    setMobileSearchOpen(false);
  };

  const pickProduct = (slug: string) => {
    setFocused(false);
    setMobileSearchOpen(false);
    navigate(`/products/${slug}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const SearchDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
      {suggestions.length > 0 ? (
        <>
          <div className="px-3 py-2 border-b border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Products</p>
          </div>
          {suggestions.map(p => (
            <button key={p.id} onMouseDown={() => { setSearchQuery(p.name); pickProduct(p.slug); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left">
              <ImageWithFallback src={p.image ?? ""} alt={p.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
              </div>
            </button>
          ))}
          <button onMouseDown={commit} className="w-full flex items-center gap-2 px-4 py-3 border-t border-border hover:bg-muted text-sm font-semibold text-primary transition-colors">
            <Search className="w-4 h-4" />See all results for "{searchQuery}"
          </button>
        </>
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground">No products found for "{searchQuery}"</p>
          <p className="text-xs text-muted-foreground mt-1">Try gloves, masks, sanitizer…</p>
        </div>
      )}
    </div>
  );

  const sideNavLinks: { label: string; icon: React.FC<{ className?: string }>; to: string; highlight?: boolean }[] = [
    { label: "Home", icon: Home, to: "/" },
    { label: "Products", icon: Package, to: "/products" },
    { label: "My Cart", icon: ShoppingCart, to: "/cart", highlight: cartCount > 0 },
    { label: isLoggedIn ? "My Account" : "Login", icon: User, to: isLoggedIn ? "/account" : "/login" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* ── Mobile Side Drawer ── */}
      {sideMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSideMenuOpen(false)}
          />
          {/* Drawer */}
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl"
            style={{ animation: "slideInLeft 0.25s ease-out" }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-primary">
              <Logo className="h-7 brightness-0 invert" />
              <button
                onClick={() => setSideMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto py-3">
              {/* Main Navigation */}
              <div className="px-3 mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1.5">Navigation</p>
                {sideNavLinks.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.to); setSideMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors group ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                      <span className="text-sm font-semibold">{item.label}</span>
                      {item.label === "My Cart" && cartCount > 0 && (
                        <span className="ml-auto w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mx-4 border-t border-border mb-4" />

              {/* Categories */}
              <div className="px-3 mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-1.5">Categories</p>
                {(categories ?? []).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { goToCategory(cat.slug); setSideMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 hover:bg-muted text-left transition-colors group"
                  >
                    <Tag className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="mx-4 border-t border-border mb-4" />

              {/* Trust badges */}
              <div className="px-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Why CareKart?</p>
                {[
                  { icon: Shield, text: "ISO 13485 Certified" },
                  { icon: Truck, text: "Same-day dispatch" },
                  { icon: Shield, text: "AQL 1.5 Tested" },
                  { icon: Phone, text: "24/7 Support" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-3 px-3 py-2">
                    <b.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-border">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted">
                  <UserAvatar
                    avatarUrl={currentUser?.avatarUrl}
                    name={currentUser?.name}
                    className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentUser?.phone ?? currentUser?.email}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setSideMenuOpen(false); }}
                  className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes slideInLeft {
              from { transform: translateX(-100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      <div className="bg-primary text-white text-center py-1.5 text-xs font-medium hidden sm:block">
        🚚 Free shipping above ₹2,000 &nbsp;|&nbsp; ISO 13485 Certified &nbsp;|&nbsp; Same-day dispatch before 3 PM
      </div>

      {/* Mobile full-screen search overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
            <button onClick={() => { setMobileSearchOpen(false); setSearchQuery(""); setFocused(false); }} className="p-1.5"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={mobileInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={e => e.key === "Enter" && commit()}
                placeholder="Search gloves, masks, PPE kits…"
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-xl border border-transparent focus:border-primary/30 focus:outline-none"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {trimmed.length === 0 && (
              <div className="px-4 py-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Nitrile Gloves", "N95 Mask", "Sanitizer", "PPE Kit", "Face Shield", "Surgical Gloves"].map(s => (
                    <button key={s} onClick={() => { setSearchQuery(s); setFocused(true); }} className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}
            {trimmed.length >= 1 && suggestions.length > 0 && (
              <div>
                {suggestions.map(p => (
                  <button key={p.id} onClick={() => { setSearchQuery(p.name); pickProduct(p.slug); }} className="w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted transition-colors text-left">
                    <ImageWithFallback src={p.image ?? ""} alt={p.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
                <button onClick={commit} className="w-full flex items-center gap-2 px-4 py-4 hover:bg-muted text-sm font-semibold text-primary transition-colors border-b border-border">
                  <Search className="w-4 h-4" />See all results for "{searchQuery}"
                </button>
              </div>
            )}
            {trimmed.length >= 1 && suggestions.length === 0 && (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold">No results for "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try gloves, masks, sanitizer…</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Mobile: burger button */}
        <button
          id="mobile-burger-menu"
          onClick={() => setSideMenuOpen(true)}
          className="p-2 hover:bg-muted rounded-xl flex md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <button onClick={() => navigate("/")} className="flex items-center flex-shrink-0">
          <Logo className="h-8" />
        </button>

        {/* Desktop search */}
        <div ref={dropdownRef} className="flex-1 mx-3 hidden md:block relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={e => e.key === "Enter" && commit()}
              placeholder="Search gloves, masks, PPE kits…"
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showDropdown && <SearchDropdown />}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile: search trigger + cart + profile */}
          <button onClick={() => { setMobileSearchOpen(true); setFocused(true); }} className="p-2 hover:bg-muted rounded-xl flex md:hidden">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={() => navigate("/cart")} className="relative p-2 hover:bg-muted rounded-xl flex md:hidden">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button onClick={() => navigate(isLoggedIn ? "/account" : "/login")} className="flex md:hidden items-center justify-center p-2 hover:bg-muted rounded-xl">
            {isLoggedIn
              ? <UserAvatar avatarUrl={currentUser?.avatarUrl} name={currentUser?.name} className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-extrabold" />
              : <User className="w-5 h-5" />}
          </button>
          {/* Desktop — note: no admin/staff entry point here by design. Staff reach
              their portal only via the unlinked /staff/login URL (see routes/router.tsx). */}
          <button onClick={() => navigate("/cart")} className="relative p-2 hover:bg-muted rounded-xl hidden md:flex">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
          <button onClick={() => navigate(isLoggedIn ? "/account" : "/login")} className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"><User className="w-4 h-4" />{isLoggedIn ? "Account" : "Login"}</button>
        </div>
      </div>

      <div className="hidden md:block border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 overflow-x-auto py-2">
          {(categories ?? []).map(c => <button key={c.id} onClick={() => goToCategory(c.slug)} className="text-muted-foreground hover:text-primary whitespace-nowrap font-medium transition-colors text-xs">{c.name}</button>)}
        </div>
      </div>
    </header>
  );
}
