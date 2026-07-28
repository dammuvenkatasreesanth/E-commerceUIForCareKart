import { Users, ShoppingCart, LifeBuoy } from "lucide-react";
import { StaffLayout, type StaffNavItem } from "./StaffLayout";

const NAV_ITEMS: StaffNavItem[] = [
  { to: "/staff/employee", label: "Customers", icon: Users, end: true },
  { to: "/staff/employee/orders", label: "Orders", icon: ShoppingCart },
  { to: "/staff/employee/tickets", label: "Support Tickets", icon: LifeBuoy },
];

export function EmployeeLayout() {
  return <StaffLayout portalName="Employee Portal" navItems={NAV_ITEMS} />;
}
