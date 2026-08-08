import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { banners, contentPages, coupons, emailCampaigns, storeSettings, users, type ACCOUNT_TYPE } from "../../db/schema";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import { sendMail } from "../../providers/email/mailer";
import { logger } from "../../lib/logger";

type AccountType = (typeof ACCOUNT_TYPE)[number];

function definedEntries<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) (result as Record<string, unknown>)[k] = v;
  }
  return result;
}

// ── Coupons ────────────────────────────────────────────────────────────

export async function listCoupons() {
  return db.query.coupons.findMany({ orderBy: [desc(coupons.createdAt)] });
}

export async function createCoupon(createdById: number, input: { code: string; type: "PERCENT" | "FLAT"; value: number; minOrderAmount: number; maxUses?: number; expiresAt?: Date }) {
  const code = input.code.toUpperCase();
  const existing = await db.query.coupons.findFirst({ where: eq(coupons.code, code) });
  if (existing) throw new BadRequestError("A coupon with this code already exists");
  const [{ id }] = await db
    .insert(coupons)
    .values({ code, type: input.type, value: String(input.value), minOrderAmount: String(input.minOrderAmount), maxUses: input.maxUses, expiresAt: input.expiresAt, createdById })
    .$returningId();
  const created = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!created) throw new NotFoundError("Coupon not found");
  return created;
}

export async function updateCoupon(id: number, input: Partial<{ code: string; type: "PERCENT" | "FLAT"; value: number; minOrderAmount: number; maxUses: number; expiresAt: Date; isActive: boolean }>) {
  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!coupon) throw new NotFoundError("Coupon not found");
  const data = definedEntries({
    code: input.code ? input.code.toUpperCase() : undefined,
    type: input.type,
    value: input.value !== undefined ? String(input.value) : undefined,
    minOrderAmount: input.minOrderAmount !== undefined ? String(input.minOrderAmount) : undefined,
    maxUses: input.maxUses,
    expiresAt: input.expiresAt,
    isActive: input.isActive,
  });
  await db.update(coupons).set(data).where(eq(coupons.id, id));
  const updated = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!updated) throw new NotFoundError("Coupon not found");
  return updated;
}

export async function deleteCoupon(id: number) {
  const coupon = await db.query.coupons.findFirst({ where: eq(coupons.id, id) });
  if (!coupon) throw new NotFoundError("Coupon not found");
  await db.update(coupons).set({ isActive: false }).where(eq(coupons.id, id));
}

// ── Banners ────────────────────────────────────────────────────────────

interface BannerInput {
  badge?: string;
  headline: string;
  subheadline?: string;
  subtext?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  bgGradient?: string;
  imageUrl?: string;
  sortOrder?: number;
  startsAt?: Date;
  endsAt?: Date;
}

export async function listBannersAdmin() {
  return db.query.banners.findMany({ orderBy: [asc(banners.sortOrder)] });
}

export async function createBanner(input: BannerInput) {
  const [{ id }] = await db.insert(banners).values(input).$returningId();
  const created = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!created) throw new NotFoundError("Banner not found");
  return created;
}

export async function updateBanner(id: number, input: Partial<BannerInput> & { isActive?: boolean }) {
  const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!banner) throw new NotFoundError("Banner not found");
  await db.update(banners).set(definedEntries(input)).where(eq(banners.id, id));
  const updated = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!updated) throw new NotFoundError("Banner not found");
  return updated;
}

export async function deleteBanner(id: number) {
  const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
  if (!banner) throw new NotFoundError("Banner not found");
  await db.delete(banners).where(eq(banners.id, id));
}

// ── Content pages ─────────────────────────────────────────────────────

export async function listContentPages() {
  return db.query.contentPages.findMany({ orderBy: [desc(contentPages.updatedAt)] });
}

export async function createContentPage(updatedById: number, input: { slug: string; title: string; bodyHtml: string }) {
  const existing = await db.query.contentPages.findFirst({ where: eq(contentPages.slug, input.slug) });
  if (existing) throw new BadRequestError("A page with this slug already exists");
  const [{ id }] = await db.insert(contentPages).values({ ...input, updatedById, updatedAt: new Date() }).$returningId();
  const created = await db.query.contentPages.findFirst({ where: eq(contentPages.id, id) });
  if (!created) throw new NotFoundError("Page not found");
  return created;
}

export async function updateContentPage(id: number, updatedById: number, input: Partial<{ slug: string; title: string; bodyHtml: string; isPublished: boolean }>) {
  const page = await db.query.contentPages.findFirst({ where: eq(contentPages.id, id) });
  if (!page) throw new NotFoundError("Page not found");
  await db.update(contentPages).set({ ...definedEntries(input), updatedById, updatedAt: new Date() }).where(eq(contentPages.id, id));
  const updated = await db.query.contentPages.findFirst({ where: eq(contentPages.id, id) });
  if (!updated) throw new NotFoundError("Page not found");
  return updated;
}

export async function deleteContentPage(id: number) {
  const page = await db.query.contentPages.findFirst({ where: eq(contentPages.id, id) });
  if (!page) throw new NotFoundError("Page not found");
  await db.delete(contentPages).where(eq(contentPages.id, id));
}

export async function getPublishedPage(slug: string) {
  const page = await db.query.contentPages.findFirst({ where: eq(contentPages.slug, slug) });
  if (!page || !page.isPublished) throw new NotFoundError("Page not found");
  return page;
}

// ── Email campaigns ───────────────────────────────────────────────────

export async function listCampaigns() {
  return db.query.emailCampaigns.findMany({ orderBy: [desc(emailCampaigns.createdAt)] });
}

export async function createCampaign(
  createdById: number,
  input: { subject: string; bodyHtml: string; segment?: { accountType?: AccountType }; sendNow: boolean },
) {
  const where = input.segment?.accountType
    ? and(eq(users.role, "CUSTOMER"), eq(users.accountType, input.segment.accountType))
    : eq(users.role, "CUSTOMER");

  const recipients = await db.query.users.findMany({ where, columns: { email: true } });
  const emails = recipients.map((r) => r.email).filter((e): e is string => !!e);

  const [{ id: campaignId }] = await db
    .insert(emailCampaigns)
    .values({
      subject: input.subject,
      bodyHtml: input.bodyHtml,
      segment: input.segment ?? {},
      status: input.sendNow ? "SENDING" : "DRAFT",
      recipientCount: emails.length,
      createdById,
    })
    .$returningId();
  const campaign = await db.query.emailCampaigns.findFirst({ where: eq(emailCampaigns.id, campaignId) });
  if (!campaign) throw new NotFoundError("Campaign not found");

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
  await db.update(emailCampaigns).set({ status: "SENT", sentAt: new Date() }).where(eq(emailCampaigns.id, campaignId));
}

// ── Store settings ─────────────────────────────────────────────────────

export async function getSettings() {
  const rows = await db.select().from(storeSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function updateSetting(key: string, value: unknown) {
  await db
    .insert(storeSettings)
    .values({ key, value, updatedAt: new Date() })
    .onDuplicateKeyUpdate({ set: { value, updatedAt: new Date() } });
  const updated = await db.query.storeSettings.findFirst({ where: eq(storeSettings.key, key) });
  if (!updated) throw new NotFoundError("Setting not found");
  return updated;
}
