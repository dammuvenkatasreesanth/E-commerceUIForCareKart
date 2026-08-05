import { createBrowserRouter } from "react-router";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { AccountLayout } from "../layouts/AccountLayout";
import { RequireCustomerAuth } from "./RequireCustomerAuth";
import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";
import { RequireStaffAuth } from "./RequireStaffAuth";

import { HomePage } from "../pages/customer/HomePage";
import { ListingPage } from "../pages/customer/ListingPage";
import { ProductDetailPage } from "../pages/customer/ProductDetailPage";
import { CartPage } from "../pages/customer/CartPage";
import { CheckoutPage } from "../pages/customer/CheckoutPage";
import { OrderConfirmationPage } from "../pages/customer/OrderConfirmationPage";
import { LoginPage } from "../pages/customer/LoginPage";
import { SignupPage } from "../pages/customer/SignupPage";
import { VerifyEmailPage } from "../pages/customer/VerifyEmailPage";
import { ForgotPasswordPage } from "../pages/customer/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/customer/ResetPasswordPage";
import { CompleteProfilePage } from "../pages/customer/CompleteProfilePage";
import { AccountHomePage } from "../pages/customer/account/AccountHomePage";
import { OrdersListPage } from "../pages/customer/account/OrdersListPage";
import { OrderDetailPage } from "../pages/customer/account/OrderDetailPage";
import { AddressesPage } from "../pages/customer/account/AddressesPage";
import { WishlistPage } from "../pages/customer/account/WishlistPage";
import { BusinessProfilePage } from "../pages/customer/account/BusinessProfilePage";
import { EditProfilePage } from "../pages/customer/account/EditProfilePage";
import { NotFoundPage } from "../pages/NotFoundPage";

import { StaffLoginPage } from "../pages/staff/StaffLoginPage";
import { StaffAcceptInvitePage } from "../pages/staff/StaffAcceptInvitePage";
import { StaffForgotPasswordPage } from "../pages/staff/StaffForgotPasswordPage";
import { StaffResetPasswordPage } from "../pages/staff/StaffResetPasswordPage";
import { AdminLayout } from "../layouts/staff/AdminLayout";
import { AdminDashboardPage } from "../pages/staff/admin/AdminDashboardPage";
import { AdminProductsListPage } from "../pages/staff/admin/AdminProductsListPage";
import { AdminCategoriesPage } from "../pages/staff/admin/AdminCategoriesPage";
import { AdminOrdersListPage } from "../pages/staff/admin/AdminOrdersListPage";
import { AdminOrderDetailPage } from "../pages/staff/admin/AdminOrderDetailPage";
import { AdminCustomersListPage } from "../pages/staff/admin/AdminCustomersListPage";
import { AdminCustomerDetailPage } from "../pages/staff/admin/AdminCustomerDetailPage";
import { AdminMarketingPage } from "../pages/staff/admin/AdminMarketingPage";
import { AdminContentPage } from "../pages/staff/admin/AdminContentPage";
import { AdminStaffPage } from "../pages/staff/admin/AdminStaffPage";
import { AdminSettingsPage } from "../pages/staff/admin/AdminSettingsPage";
import { AdminReportsPage } from "../pages/staff/admin/AdminReportsPage";
import { EmployeeLayout } from "../layouts/staff/EmployeeLayout";
import { EmployeeCustomersPage } from "../pages/staff/employee/EmployeeCustomersPage";
import { EmployeeCustomerDetailPage } from "../pages/staff/employee/EmployeeCustomerDetailPage";
import { EmployeeOrdersPage } from "../pages/staff/employee/EmployeeOrdersPage";
import { EmployeeOrderDetailPage } from "../pages/staff/employee/EmployeeOrderDetailPage";
import { EmployeeTicketsPage } from "../pages/staff/employee/EmployeeTicketsPage";
import { EmployeeTicketDetailPage } from "../pages/staff/employee/EmployeeTicketDetailPage";

export const router = createBrowserRouter([
  {
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ListingPage /> },
      { path: "/products/:slug", element: <ProductDetailPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order-confirmation", element: <OrderConfirmationPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
      {
        element: <RedirectIfAuthenticated />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },
      {
        element: <RequireCustomerAuth />,
        children: [
          // Not wrapped by RedirectIfAuthenticated: reached right after OTP verify
          // for a brand-new signup, at which point the user is already
          // authenticated but hasn't filled in name/GSTIN yet.
          { path: "/complete-profile", element: <CompleteProfilePage /> },
          {
            path: "/account",
            element: <AccountLayout />,
            children: [
              { index: true, element: <AccountHomePage /> },
              { path: "orders", element: <OrdersListPage /> },
              { path: "orders/:id", element: <OrderDetailPage /> },
              { path: "addresses", element: <AddressesPage /> },
              { path: "wishlist", element: <WishlistPage /> },
              { path: "business", element: <BusinessProfilePage /> },
              { path: "edit-profile", element: <EditProfilePage /> },
            ],
          },
        ],
      },
    ],
  },
  // Staff routes — intentionally not linked from any customer nav; reached only
  // by knowing the URL. Real access control is enforced by the backend's
  // requireRole() middleware regardless of what renders here.
  { path: "/staff/login", element: <StaffLoginPage /> },
  { path: "/staff/accept-invite", element: <StaffAcceptInvitePage /> },
  { path: "/staff/forgot-password", element: <StaffForgotPasswordPage /> },
  { path: "/staff/reset-password", element: <StaffResetPasswordPage /> },
  {
    element: <RequireStaffAuth allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/staff/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <AdminProductsListPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "orders", element: <AdminOrdersListPage /> },
          { path: "orders/:id", element: <AdminOrderDetailPage /> },
          { path: "customers", element: <AdminCustomersListPage /> },
          { path: "customers/:id", element: <AdminCustomerDetailPage /> },
          { path: "marketing", element: <AdminMarketingPage /> },
          { path: "content", element: <AdminContentPage /> },
          { path: "staff", element: <AdminStaffPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireStaffAuth allowedRoles={["EMPLOYEE"]} />,
    children: [
      {
        path: "/staff/employee",
        element: <EmployeeLayout />,
        children: [
          { index: true, element: <EmployeeCustomersPage /> },
          { path: "customers/:id", element: <EmployeeCustomerDetailPage /> },
          { path: "orders", element: <EmployeeOrdersPage /> },
          { path: "orders/:id", element: <EmployeeOrderDetailPage /> },
          { path: "tickets", element: <EmployeeTicketsPage /> },
          { path: "tickets/:id", element: <EmployeeTicketDetailPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
