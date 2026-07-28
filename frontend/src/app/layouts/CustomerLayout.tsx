import { Outlet } from "react-router";
import { Header } from "../components/common/Header";
import { MobileBottomNav } from "../components/common/MobileBottomNav";
import { useLegacyStore } from "../context/LegacyStoreContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

export function CustomerLayout() {
  const { searchQuery, setSearchQuery } = useLegacyStore();
  const { status, user } = useAuth();
  const { data: cartData } = useCart();
  const cartCount = cartData?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const isLoggedIn = status === "authenticated";

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        currentUser={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Outlet />
      <MobileBottomNav cartCount={cartCount} isLoggedIn={isLoggedIn} />
    </div>
  );
}
