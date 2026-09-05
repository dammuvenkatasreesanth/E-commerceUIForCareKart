import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import { authenticate, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { uploadProductImage, uploadCategoryImage, uploadProductVideo, uploadCsv } from "../../middleware/upload.middleware";
import {
  createProductSchema,
  updateProductSchema,
  setPackTiersSchema,
  setBoxSizesSchema,
  createCategorySchema,
  updateCategorySchema,
  adminListProductsQuerySchema,
} from "./admin-catalog.schema";
import * as controller from "./admin-catalog.controller";

export const adminCatalogRouter = Router();

adminCatalogRouter.use(authenticate, requireRole("ADMIN"));

adminCatalogRouter.get("/products", validate({ query: adminListProductsQuerySchema }), asyncHandler(controller.listProducts));
adminCatalogRouter.get("/products/export", asyncHandler(controller.exportCsv));
adminCatalogRouter.post("/products/import", uploadCsv.single("file"), asyncHandler(controller.importCsv));
adminCatalogRouter.get("/products/:id", asyncHandler(controller.getProduct));
adminCatalogRouter.post("/products", validate({ body: createProductSchema }), asyncHandler(controller.createProduct));
adminCatalogRouter.patch("/products/:id", validate({ body: updateProductSchema }), asyncHandler(controller.updateProduct));
adminCatalogRouter.delete("/products/:id", asyncHandler(controller.deleteProduct));
adminCatalogRouter.put("/products/:id/pack-tiers", validate({ body: setPackTiersSchema }), asyncHandler(controller.setPackTiers));
adminCatalogRouter.put("/products/:id/box-sizes", validate({ body: setBoxSizesSchema }), asyncHandler(controller.setBoxSizes));
adminCatalogRouter.post("/products/:id/images", uploadProductImage.single("image"), asyncHandler(controller.addImage));
adminCatalogRouter.delete("/products/:id/images/:imageId", asyncHandler(controller.removeImage));
adminCatalogRouter.post("/products/:id/video", uploadProductVideo.single("video"), asyncHandler(controller.uploadVideo));

adminCatalogRouter.get("/categories", asyncHandler(controller.listCategories));
adminCatalogRouter.post("/categories", validate({ body: createCategorySchema }), asyncHandler(controller.createCategory));
adminCatalogRouter.patch("/categories/:id", validate({ body: updateCategorySchema }), asyncHandler(controller.updateCategory));
adminCatalogRouter.delete("/categories/:id", asyncHandler(controller.deleteCategory));
adminCatalogRouter.post("/categories/upload-image", uploadCategoryImage.single("image"), asyncHandler(controller.uploadCategoryImage));
