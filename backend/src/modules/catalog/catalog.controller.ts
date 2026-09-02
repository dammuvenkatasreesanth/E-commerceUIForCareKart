import type { Request, Response } from "express";
import * as catalogService from "./catalog.service";

export async function listProducts(req: Request, res: Response) {
  const result = await catalogService.listProducts(req.query as unknown as Parameters<typeof catalogService.listProducts>[0]);
  res.json(result);
}

export async function getProduct(req: Request, res: Response) {
  const product = await catalogService.getProductBySlug(req.params.slug);
  res.json(product);
}

export async function listCategories(_req: Request, res: Response) {
  const categories = await catalogService.listCategories();
  res.json(categories);
}

export async function autosuggest(req: Request, res: Response) {
  const { q, limit } = req.query as unknown as { q: string; limit: number };
  const results = await catalogService.autosuggest(q, limit);
  res.json(results);
}

export async function listBanners(_req: Request, res: Response) {
  const banners = await catalogService.listActiveBanners();
  res.json(banners);
}

export async function lookupPincode(req: Request, res: Response) {
  const result = await catalogService.lookupPincode(req.params.pincode);
  res.json(result);
}
