import { useState, type ComponentType } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components/Logo";
import { useScrollToTop } from "../../hooks/useScrollToTop";

export interface StaffNavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

export function StaffLayout({ portalName, navItems }: { portalName: string; navItems: StaffNavItem[] }) {
  useScrollToTop();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/staff/login", { replace: true });
    }
  };

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
            }`
          }
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 flex-shrink-0 bg-gradient-to-b from-banner-navy-from to-banner-navy-to border-r border-white/10">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo className="h-6 brightness-0 invert" />
          <p className="text-[10px] text-primary-foreground/50 font-semibold uppercase tracking-wide mt-1.5">{portalName}</p>
        </div>
        {nav}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-primary-foreground truncate">{user?.name ?? user?.email}</p>
            <p className="text-[11px] text-primary-foreground/50 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-banner-navy-from to-banner-navy-to flex flex-col">
            <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
              <Logo className="h-6 brightness-0 invert" />
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-primary-foreground/70" /></button>
            </div>
            {nav}
            <div className="px-3 py-4 border-t border-white/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground transition-colors">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-border sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <p className="text-sm font-bold">{portalName}</p>
          <div className="w-5" />
        </header>
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
