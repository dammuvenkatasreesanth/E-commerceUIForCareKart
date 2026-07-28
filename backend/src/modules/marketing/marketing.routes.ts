import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { uploadBannerImage } from "../../middleware/upload.middleware";
import {
  createCouponSchema,
  updateCouponSchema,
  createBannerSchema,
  updateBannerSchema,
  createContentPageSchema,
  updateContentPageSchema,
  createCampaignSchema,
  updateSettingSchema,
} from "./marketing.schema";
import * as controller from "./marketing.controller";

const requireAdmin = [authenticate, requireRole("ADMIN")];

export const adminCouponsRouter = Router();
adminCouponsRouter.use(...requireAdmin);
adminCouponsRouter.get("/", asyncHandler(controller.listCoupons));
adminCouponsRouter.post("/", validate({ body: createCouponSchema }), asyncHandler(controller.createCoupon));
adminCouponsRouter.patch("/:id", validate({ body: updateCouponSchema }), asyncHandler(controller.updateCoupon));
adminCouponsRouter.delete("/:id", asyncHandler(controller.deleteCoupon));

export const adminBannersRouter = Router();
adminBannersRouter.use(...requireAdmin);
adminBannersRouter.get("/", asyncHandler(controller.listBanners));
adminBannersRouter.post("/", validate({ body: createBannerSchema }), asyncHandler(controller.createBanner));
adminBannersRouter.post("/upload-image", uploadBannerImage.single("image"), asyncHandler(controller.uploadBannerImage));
adminBannersRouter.patch("/:id", validate({ body: updateBannerSchema }), asyncHandler(controller.updateBanner));
adminBannersRouter.delete("/:id", asyncHandler(controller.deleteBanner));

export const adminContentPagesRouter = Router();
adminContentPagesRouter.use(...requireAdmin);
adminContentPagesRouter.get("/", asyncHandler(controller.listContentPages));
adminContentPagesRouter.post("/", validate({ body: createContentPageSchema }), asyncHandler(controller.createContentPage));
adminContentPagesRouter.patch("/:id", validate({ body: updateContentPageSchema }), asyncHandler(controller.updateContentPage));
adminContentPagesRouter.delete("/:id", asyncHandler(controller.deleteContentPage));

export const adminCampaignsRouter = Router();
adminCampaignsRouter.use(...requireAdmin);
adminCampaignsRouter.get("/", asyncHandler(controller.listCampaigns));
adminCampaignsRouter.post("/", validate({ body: createCampaignSchema }), asyncHandler(controller.createCampaign));

export const adminSettingsRouter = Router();
adminSettingsRouter.use(...requireAdmin);
adminSettingsRouter.get("/", asyncHandler(controller.getSettings));
adminSettingsRouter.patch("/:key", validate({ body: updateSettingSchema }), asyncHandler(controller.updateSetting));

export const publicContentRouter = Router();
publicContentRouter.get("/pages/:slug", asyncHandler(controller.getPublicPage));
