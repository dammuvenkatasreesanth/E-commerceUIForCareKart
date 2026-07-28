import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function RequireCustomerAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    // Silent-refresh check is still in flight — render nothing rather than
    // redirecting, so an actually-logged-in user isn't bounced on refresh.
    return null;
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
