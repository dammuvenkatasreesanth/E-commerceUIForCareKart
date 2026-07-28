// Carries the header/listing search box state across pages without prop-drilling.
// The old mock products/banners/cart fields this context used to hold are gone —
// catalog is real React Query data (useCatalog.ts) and cart is the real
// guest-cart/server-cart system (useCart.ts).
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface LegacyStoreContextValue {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const LegacyStoreContext = createContext<LegacyStoreContextValue | undefined>(undefined);

export function LegacyStoreProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  const value = useMemo<LegacyStoreContextValue>(() => ({ searchQuery, setSearchQuery }), [searchQuery]);

  return <LegacyStoreContext.Provider value={value}>{children}</LegacyStoreContext.Provider>;
}

export function useLegacyStore(): LegacyStoreContextValue {
  const ctx = useContext(LegacyStoreContext);
  if (!ctx) throw new Error("useLegacyStore must be used within LegacyStoreProvider");
  return ctx;
}
