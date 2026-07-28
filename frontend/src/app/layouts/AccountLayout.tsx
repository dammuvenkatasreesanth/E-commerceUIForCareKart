import { Outlet } from "react-router";

// Shared account shell. Login-guarding is handled upstream by
// RequireCustomerAuth (wraps the whole /account/* subtree), so this layout
// only supplies the shared page container — no chrome duplicated across the
// individual account views.
export function AccountLayout() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4 md:py-6 pb-24 md:pb-8">
      <Outlet />
    </div>
  );
}
