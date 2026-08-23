import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Megaphone, FileText, Settings, BarChart3, UserCog, Boxes } from "lucide-react";
import { StaffLayout, type StaffNavItem } from "./StaffLayout";

const NAV_ITEMS: StaffNavItem[] = [
  { to: "/staff/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/staff/admin/products", label: "Products", icon: Package },
  { to: "/staff/admin/categories", label: "Categories", icon: Tag },
  { to: "/staff/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/staff/admin/box-sizes", label: "Box Sizes", icon: Boxes },
  { to: "/staff/admin/customers", label: "Customers", icon: Users },
  { to: "/staff/admin/marketing", label: "Marketing", icon: Megaphone },
  { to: "/staff/admin/content", label: "Content", icon: FileText },
  { to: "/staff/admin/staff", label: "Staff", icon: UserCog },
  { to: "/staff/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/staff/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout() {
  return <StaffLayout portalName="Admin Portal" navItems={NAV_ITEMS} />;
}
