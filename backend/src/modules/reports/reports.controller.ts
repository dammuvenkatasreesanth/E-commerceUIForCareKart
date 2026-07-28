import type { Request, Response } from "express";
import * as service from "./reports.service";

export async function dashboard(_req: Request, res: Response) {
  res.json(await service.getDashboardKpis());
}

export async function salesTrend(req: Request, res: Response) {
  const days = Number(req.query.days ?? 30);
  res.json(await service.getSalesTrend(Number.isFinite(days) && days > 0 ? days : 30));
}

export async function pendingOrderAlerts(_req: Request, res: Response) {
  res.json(await service.getPendingOrderAlerts());
}

function sendCsv(res: Response, filename: string, csv: string) {
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

export async function exportSales(_req: Request, res: Response) {
  sendCsv(res, "sales-report.csv", await service.exportSalesCsv());
}
export async function exportCustomers(_req: Request, res: Response) {
  sendCsv(res, "customers-report.csv", await service.exportCustomersCsv());
}
export async function exportCoupons(_req: Request, res: Response) {
  sendCsv(res, "coupons-report.csv", await service.exportCouponsCsv());
}
