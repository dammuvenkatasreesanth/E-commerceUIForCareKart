import { prisma } from "../../lib/prisma";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { sendMail } from "../../providers/email/mailer";
import { logger } from "../../lib/logger";
import type { AccountType } from "@prisma/client";

// ── Coupons ────────────────────────────────────────────────────────────

export async function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(createdById: number, input: { code: string; type: "PERCENT" | "FLAT"; value: number; minOrderAmount: number; maxUses?: number; expiresAt?: Date }) {
  const code = input.code.toUpperCase();
  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) throw new BadRequestError("A coupon with this code already exists");
  return prisma.coupon.create({ data: { ...input, code, createdById } });
}

export async function updateCoupon(id: number, input: Partial<{ code: string; type: "PERCENT" | "FLAT"; value: number; minOrderAmount: number; maxUses: number; expiresAt: Date; isActive: boolean }>) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new NotFoundError("Coupon not found");
  const data = { ...input, code: input.code ? input.code.toUpperCase() : undefined };
  return prisma.coupon.update({ where: { id }, data });
}

export async function deleteCoupon(id: number) {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) throw new NotFoundError("Coupon not found");
  await prisma.coupon.update({ where: { id }, data: { isActive: false } });
}

// ── Banners ────────────────────────────────────────────────────────────

export async function listBannersAdmin() {
  return prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createBanner(input: Record<string, unknown>) {
  return prisma.banner.create({ data: input as never });
}

export async function updateBanner(id: number, input: Record<string, unknown>) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new NotFoundError("Banner not found");
  return prisma.banner.update({ where: { id }, data: input as never });
}

export async function deleteBanner(id: number) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new NotFoundError("Banner not found");
  await prisma.banner.delete({ where: { id } });
}

// ── Content pages ─────────────────────────────────────────────────────

export async function listContentPages() {
  return prisma.contentPage.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function createContentPage(updatedById: number, input: { slug: string; title: string; bodyHtml: string }) {
  const existing = await prisma.contentPage.findUnique({ where: { slug: input.slug } });
  if (existing) throw new BadRequestError("A page with this slug already exists");
  return prisma.contentPage.create({ data: { ...input, updatedById } });
}

export async function updateContentPage(id: number, updatedById: number, input: Partial<{ slug: string; title: string; bodyHtml: string; isPublished: boolean }>) {
  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) throw new NotFoundError("Page not found");
  return prisma.contentPage.update({ where: { id }, data: { ...input, updatedById } });
}

export async function deleteContentPage(id: number) {
  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) throw new NotFoundError("Page not found");
  await prisma.contentPage.delete({ where: { id } });
}

export async function getPublishedPage(slug: string) {
  const page = await prisma.contentPage.findUnique({ where: { slug } });
  if (!page || !page.isPublished) throw new NotFoundError("Page not found");
  return page;
}

// ── Email campaigns ───────────────────────────────────────────────────

export async function listCampaigns() {
  return prisma.emailCampaign.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCampaign(
  createdById: number,
  input: { subject: string; bodyHtml: string; segment?: { accountType?: AccountType }; sendNow: boolean },
) {
  const where = input.segment?.accountType ? { role: "CUSTOMER" as const, accountType: input.segment.accountType } : { role: "CUSTOMER" as const };
  const recipients = await prisma.user.findMany({ where, select: { email: true } });
  const emails = recipients.map((r) => r.email).filter((e): e is string => !!e);

  const campaign = await prisma.emailCampaign.create({
    data: {
      subject: input.subject,
      bodyHtml: input.bodyHtml,
      segment: input.segment ?? {},
      status: input.sendNow ? "SENDING" : "DRAFT",
      recipientCount: emails.length,
      createdById,
    },
  });

  if (input.sendNow) {
    // Fire-and-forget: campaign sends run inline (no queue), so we don't block the API response on N emails.
    sendCampaignEmails(campaign.id, input.subject, input.bodyHtml, emails).catch((err) => {
      logger.error({ err, campaignId: campaign.id }, "Campaign send failed");
    });
  }

  return campaign;
}

async function sendCampaignEmails(campaignId: number, subject: string, bodyHtml: string, emails: string[]): Promise<void> {
  for (const to of emails) {
    try {
      await sendMail({ to, subject, html: bodyHtml });
    } catch (err) {
      logger.error({ err, to }, "Failed to send campaign email to recipient");
    }
  }
  await prisma.emailCampaign.update({ where: { id: campaignId }, data: { status: "SENT", sentAt: new Date() } });
}

// ── Store settings ─────────────────────────────────────────────────────

export async function getSettings() {
  const rows = await prisma.storeSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function updateSetting(key: string, value: unknown) {
  return prisma.storeSetting.upsert({
    where: { key },
    update: { value: value as never },
    create: { key, value: value as never },
  });
}
