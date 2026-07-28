import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/user";

// UX guard only — the real security boundary is the backend's requireRole()
// middleware on every /admin, /employee route, unchanged by this.
// This just keeps someone from landing on a portal shell they have no data
// access to and seeing empty/erroring screens.
export function RequireStaffAuth({ allowedRoles }: { allowedRoles: Role[] }) {
  const { status, user, isStaff } = useAuth();
  const location = useLocation();

  if (status === "loading") return null;
  if (status !== "authenticated" || !isStaff) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/staff/login" replace />;
  }
  return <Outlet />;
}
