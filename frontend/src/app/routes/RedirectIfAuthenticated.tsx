import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function RedirectIfAuthenticated() {
  const { status, user } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from;

  // A brand-new customer becomes "authenticated" the instant their OTP is
  // verified (this backend creates the account at verify time), but still
  // needs to complete their profile (name/GSTIN) on this same page before
  // leaving — user.name is null until then. Redirecting away as soon as
  // status flips would race LoginPage's own post-verify handling and yank
  // the user off the page before the profile step ever renders, so we only
  // treat the session as "done with /login" once a name is on file.
  if (status === "authenticated" && user?.name) {
    return <Navigate to={from ? `${from.pathname}${from.search ?? ""}` : "/account"} replace />;
  }
  return <Outlet />;
}
