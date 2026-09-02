import { Outlet, useLocation } from "react-router";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { MobileBottomNav } from "../components/common/MobileBottomNav";
import { useLegacyStore } from "../context/LegacyStoreContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { useScrollToTop } from "../hooks/useScrollToTop";

// These pages render their own full-screen AuthLayout shell (own logo, own
// "Back to store" link, own footer) — the site Header/MobileBottomNav is
// redundant chrome on top of an already-complete standalone design.
const BARE_AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

export function CustomerLayout() {
  useScrollToTop();
  const { searchQuery, setSearchQuery } = useLegacyStore();
  const { status, user } = useAuth();
  const { data: cartData } = useCart();
  const { pathname } = useLocation();
  const cartCount = cartData?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const isLoggedIn = status === "authenticated";
  const hideChrome = BARE_AUTH_PATHS.includes(pathname);

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      {!hideChrome && (
        <Header
          cartCount={cartCount}
          isLoggedIn={isLoggedIn}
          currentUser={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      <Outlet />
      {!hideChrome && <Footer />}
      {!hideChrome && <MobileBottomNav cartCount={cartCount} isLoggedIn={isLoggedIn} />}
    </div>
  );
}
