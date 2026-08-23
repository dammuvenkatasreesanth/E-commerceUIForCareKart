import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { usersRouter } from "../modules/users/users.routes";
import { catalogRouter } from "../modules/catalog/catalog.routes";
import { cartRouter } from "../modules/cart/cart.routes";
import { wishlistRouter } from "../modules/wishlist/wishlist.routes";
import { reviewsRouter } from "../modules/reviews/reviews.routes";
import { couponsRouter } from "../modules/coupons/coupons.routes";
import { checkoutRouter } from "../modules/checkout/checkout.routes";
import { ordersRouter } from "../modules/orders/orders.routes";
import { paymentsRouter } from "../modules/payments/payments.routes";
import { adminCatalogRouter } from "../modules/admin-catalog/admin-catalog.routes";
import { adminOrdersRouter } from "../modules/admin-orders/admin-orders.routes";
import { adminCustomersRouter } from "../modules/admin-customers/admin-customers.routes";
import { adminStaffRouter, adminAuditLogRouter } from "../modules/admin-staff/admin-staff.routes";
import {
  adminCouponsRouter,
  adminBannersRouter,
  adminContentPagesRouter,
  adminCampaignsRouter,
  adminSettingsRouter,
  publicContentRouter,
} from "../modules/marketing/marketing.routes";
import { reportsRouter } from "../modules/reports/reports.routes";
import { supportRouter } from "../modules/support/support.routes";
import { employeeRouter } from "../modules/employee/employee.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/coupons", couponsRouter);
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/payments", paymentsRouter);
apiRouter.use("/admin", adminCatalogRouter);
apiRouter.use("/admin/orders", adminOrdersRouter);
apiRouter.use("/admin/customers", adminCustomersRouter);
apiRouter.use("/admin/staff", adminStaffRouter);
apiRouter.use("/admin/audit-log", adminAuditLogRouter);
apiRouter.use("/admin/coupons", adminCouponsRouter);
apiRouter.use("/admin/banners", adminBannersRouter);
apiRouter.use("/admin/content-pages", adminContentPagesRouter);
apiRouter.use("/admin/campaigns", adminCampaignsRouter);
apiRouter.use("/admin/settings", adminSettingsRouter);
apiRouter.use("/content", publicContentRouter);
apiRouter.use("/admin/reports", reportsRouter);
apiRouter.use("/support", supportRouter);
apiRouter.use("/employee", employeeRouter);

// Additional module routers are mounted here as each phase is built.
