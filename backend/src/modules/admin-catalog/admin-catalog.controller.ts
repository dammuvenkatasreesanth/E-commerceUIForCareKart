import type { Request, Response } from "express";
import * as service from "./admin-catalog.service";
import { uploadToCloudinary } from "../../providers/storage/cloudinary-storage";
import { validateUploadedFile } from "../../lib/fileValidation";
import { parseIdParam } from "../../lib/parseId";
import { BadRequestError } from "../../lib/errors";
import { writeAudit } from "../../middleware/audit.middleware";

export async function listProducts(req: Request, res: Response) {
  res.json(await service.listProducts(req.query as unknown as Parameters<typeof service.listProducts>[0]));
}

export async function getProduct(req: Request, res: Response) {
  res.json(await service.getProduct(parseIdParam(req.params.id)));
}

export async function createProduct(req: Request, res: Response) {
  const product = await service.createProduct(req.body);
  await writeAudit({ actorId: req.user!.id, action: "product.create", entityType: "Product", entityId: product.id, ipAddress: req.ip });
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const product = await service.updateProduct(id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "product.update", entityType: "Product", entityId: id, ipAddress: req.ip });
  res.json(product);
}

export async function setPackTiers(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const product = await service.setPackTiers(id, req.body.tiers);
  await writeAudit({ actorId: req.user!.id, action: "product.pack_tiers.update", entityType: "Product", entityId: id, ipAddress: req.ip });
  res.json(product);
}

export async function setBoxSizes(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const product = await service.setBoxSizes(id, req.body.boxSizes);
  await writeAudit({ actorId: req.user!.id, action: "product.box_sizes.update", entityType: "Product", entityId: id, ipAddress: req.ip });
  res.json(product);
}

export async function addImage(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  if (!req.file) throw new BadRequestError("No image file uploaded");
  const { ext, contentType } = await validateUploadedFile(req.file.buffer, req.file.mimetype, "image");
  const url = await uploadToCloudinary("product-images", req.file.buffer, ext, contentType);
  const image = await service.addProductImage(id, url);
  res.status(201).json(image);
}

export async function removeImage(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const imageId = parseIdParam(req.params.imageId, "image id");
  await service.removeProductImage(id, imageId);
  res.status(204).send();
}

// Just stores the file and hands back its URL — the caller PATCHes it onto
// the product's videoUrl separately (mirrors the banner image upload flow).
export async function uploadVideo(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError("No video file uploaded");
  const { ext, contentType } = await validateUploadedFile(req.file.buffer, req.file.mimetype, "video");
  const url = await uploadToCloudinary("product-videos", req.file.buffer, ext, contentType);
  res.status(201).json({ url });
}

export async function listCategories(_req: Request, res: Response) {
  res.json(await service.listCategoriesAdmin());
}

export async function createCategory(req: Request, res: Response) {
  res.status(201).json(await service.createCategory(req.body));
}

export async function updateCategory(req: Request, res: Response) {
  res.json(await service.updateCategory(parseIdParam(req.params.id), req.body));
}

export async function deleteCategory(req: Request, res: Response) {
  await service.deleteCategory(parseIdParam(req.params.id));
  res.status(204).send();
}

export async function uploadCategoryImage(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError("No image file uploaded");
  const { ext, contentType } = await validateUploadedFile(req.file.buffer, req.file.mimetype, "image");
  const url = await uploadToCloudinary("categories", req.file.buffer, ext, contentType);
  res.status(201).json({ url });
}

export async function importCsv(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError("No CSV file uploaded");
  const result = await service.importProductsCsv(req.file.buffer);
  await writeAudit({
    actorId: req.user!.id,
    action: "product.csv_import",
    entityType: "Product",
    metadata: result,
    ipAddress: req.ip,
  });
  res.json(result);
}

export async function exportCsv(_req: Request, res: Response) {
  const csv = await service.exportProductsCsv();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="products-export.csv"`);
  res.send(csv);
}
