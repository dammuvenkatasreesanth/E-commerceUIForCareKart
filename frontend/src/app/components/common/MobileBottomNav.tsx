import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export function MobileBottomNav({ cartCount, isLoggedIn }: { cartCount: number; isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const items: { to: string; icon: React.FC<{ className?: string }>; label: string; count?: number; match: (path: string) => boolean }[] = [
    { to: "/", icon: Home, label: "Home", match: (p) => p === "/" },
    { to: "/products", icon: Search, label: "Search", match: (p) => p.startsWith("/products") },
    { to: "/cart", icon: ShoppingCart, label: "Cart", count: cartCount, match: (p) => p === "/cart" },
    { to: isLoggedIn ? "/account" : "/login", icon: User, label: "Account", match: (p) => p.startsWith("/account") || p === "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {items.map((item) => {
          const isActive = item.match(location.pathname);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${isActive ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {(item.count ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
