import type { Request, Response } from "express";
import * as service from "./marketing.service";
import { parseIdParam } from "../../lib/parseId";
import { writeAudit } from "../../middleware/audit.middleware";
import { uploadToCloudinary } from "../../providers/storage/cloudinary-storage";
import { validateUploadedFile } from "../../lib/fileValidation";
import { BadRequestError } from "../../lib/errors";

// Coupons
export async function listCoupons(_req: Request, res: Response) {
  res.json(await service.listCoupons());
}
export async function createCoupon(req: Request, res: Response) {
  const coupon = await service.createCoupon(req.user!.id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "coupon.create", entityType: "Coupon", entityId: coupon.id, ipAddress: req.ip });
  res.status(201).json(coupon);
}
export async function updateCoupon(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  const coupon = await service.updateCoupon(id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "coupon.update", entityType: "Coupon", entityId: id, ipAddress: req.ip });
  res.json(coupon);
}
export async function deleteCoupon(req: Request, res: Response) {
  const id = parseIdParam(req.params.id);
  await service.deleteCoupon(id);
  await writeAudit({ actorId: req.user!.id, action: "coupon.deactivate", entityType: "Coupon", entityId: id, ipAddress: req.ip });
  res.status(204).send();
}

// Banners
export async function listBanners(_req: Request, res: Response) {
  res.json(await service.listBannersAdmin());
}
export async function createBanner(req: Request, res: Response) {
  res.status(201).json(await service.createBanner(req.body));
}
export async function updateBanner(req: Request, res: Response) {
  res.json(await service.updateBanner(parseIdParam(req.params.id), req.body));
}
export async function deleteBanner(req: Request, res: Response) {
  await service.deleteBanner(parseIdParam(req.params.id));
  res.status(204).send();
}
export async function uploadBannerImage(req: Request, res: Response) {
  if (!req.file) throw new BadRequestError("No image file uploaded");
  const { ext, contentType } = await validateUploadedFile(req.file.buffer, req.file.mimetype, "image");
  const url = await uploadToCloudinary("banners", req.file.buffer, ext, contentType);
  res.status(201).json({ url });
}

// Content pages
export async function listContentPages(_req: Request, res: Response) {
  res.json(await service.listContentPages());
}
export async function createContentPage(req: Request, res: Response) {
  res.status(201).json(await service.createContentPage(req.user!.id, req.body));
}
export async function updateContentPage(req: Request, res: Response) {
  res.json(await service.updateContentPage(parseIdParam(req.params.id), req.user!.id, req.body));
}
export async function deleteContentPage(req: Request, res: Response) {
  await service.deleteContentPage(parseIdParam(req.params.id));
  res.status(204).send();
}

// Campaigns
export async function listCampaigns(_req: Request, res: Response) {
  res.json(await service.listCampaigns());
}
export async function createCampaign(req: Request, res: Response) {
  const campaign = await service.createCampaign(req.user!.id, req.body);
  await writeAudit({ actorId: req.user!.id, action: "campaign.create", entityType: "EmailCampaign", entityId: campaign.id, metadata: { recipientCount: campaign.recipientCount }, ipAddress: req.ip });
  res.status(201).json(campaign);
}

// Public
export async function getPublicPage(req: Request, res: Response) {
  res.json(await service.getPublishedPage(req.params.slug));
}

// Settings
export async function getSettings(_req: Request, res: Response) {
  res.json(await service.getSettings());
}
export async function updateSetting(req: Request, res: Response) {
  const key = req.params.key;
  const setting = await service.updateSetting(key, req.body.value);
  await writeAudit({ actorId: req.user!.id, action: "settings.update", entityType: "StoreSetting", metadata: { key }, ipAddress: req.ip });
  res.json(setting);
}
