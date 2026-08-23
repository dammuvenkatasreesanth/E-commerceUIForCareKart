import type { Order } from "./order";
import type { Role, AccountType, GstStatus } from "./user";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type StaffStatus = "ACTIVE" | "BLOCKED" | "SUSPENDED";

// ─── Shipping ─────────────────────────────────────────────────────────────
export interface BoxSize {
  id: number;
  boxCount: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface BoxSizeInput {
  boxCount: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

// ─── Catalog ──────────────────────────────────────────────────────────────
export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  imageUrl: string | null;
  isActive: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
}

export interface AdminProductImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface AdminProductSize {
  id: number;
  size: string;
  sortOrder: number;
}

export interface AdminPackTier {
  id: number;
  tierIndex: number;
  label: string;
  packQty: number;
  discountPct: string;
  tag: string | null;
}

export interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  categoryId: number;
  category: AdminCategory;
  price: string;
  mrp: string;
  material: string | null;
  badge: string | null;
  videoUrl: string | null;
  features: string[];
  specs: Record<string, string>;
  moq: number;
  gstRate: string;
  hsnCode: string | null;
  weightGrams: number | null;
  isActive: boolean;
  inStock: boolean;
  ratingAvg: string;
  ratingCount: number;
  images: AdminProductImage[];
  sizes: AdminProductSize[];
  packTiers: AdminPackTier[];
  createdAt: string;
}

export interface AdminProductInput {
  name: string;
  tagline?: string;
  description: string;
  categoryId: number;
  price: number;
  mrp: number;
  material?: string;
  badge?: string;
  videoUrl?: string;
  features?: string[];
  specs?: Record<string, string>;
  moq?: number;
  gstRate?: number;
  hsnCode?: string;
  weightGrams?: number;
  sizes: string[];
  packTiers?: { tierIndex: number; label: string; packQty: number; discountPct: number; tag?: string }[];
  isActive?: boolean;
  inStock?: boolean;
}

// ─── Orders ───────────────────────────────────────────────────────────────
export interface AdminOrderCustomer {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface AdminOrder extends Order {
  user: AdminOrderCustomer;
}

export interface AdminOrderNote {
  id: number;
  orderId: number;
  authorId: number;
  isInternal: boolean;
  note: string;
  createdAt: string;
}

export interface AdminOrderDetail extends AdminOrder {
  notes: AdminOrderNote[];
  payments: { id: number; provider: string; status: string; amount: string; createdAt: string }[];
  refunds: { id: number; amount: string; reason: string | null; status: string; createdAt: string }[];
  returns: { id: number; reason: string; requestedQty: number; status: string; createdAt: string }[];
}

// ─── Customers ────────────────────────────────────────────────────────────
export interface AdminCustomerListItem {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  accountType: AccountType;
  gstin: string | null;
  gstStatus: GstStatus;
  status: StaffStatus;
  createdAt: string;
  _count: { orders: number };
}

export interface AdminCustomerDetail extends AdminCustomerListItem {
  addresses: { id: number; label: string | null; name: string; line1: string; city: string; state: string; pincode: string; phone: string; isDefault: boolean }[];
  // Note: getCustomer() includes orders scoped to this user only (no `user` relation loaded), unlike AdminOrder.
  orders: Order[];
}

// ─── Staff ────────────────────────────────────────────────────────────────
export interface StaffMember {
  id: number;
  name: string | null;
  email: string | null;
  role: Role;
  status: StaffStatus;
  claimedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: number;
  actorId: number | null;
  actor: { id: number; name: string | null; email: string | null; role: Role } | null;
  action: string;
  entityType: string | null;
  entityId: number | null;
  metadata: unknown;
  ipAddress: string | null;
  createdAt: string;
}

// ─── Marketing ────────────────────────────────────────────────────────────
export interface AdminCoupon {
  id: number;
  code: string;
  type: "PERCENT" | "FLAT";
  value: string;
  minOrderAmount: string;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface AdminBanner {
  id: number;
  badge: string | null;
  headline: string;
  subheadline: string | null;
  subtext: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryLink: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryLink: string | null;
  bgGradient: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
}

export interface ContentPage {
  id: number;
  slug: string;
  title: string;
  bodyHtml: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Campaign {
  id: number;
  subject: string;
  bodyHtml: string;
  segment: unknown;
  sentAt: string | null;
  recipientCount: number;
  createdAt: string;
}

export interface AdminSetting {
  key: string;
  value: unknown;
}

// ─── Reports / Dashboard ──────────────────────────────────────────────────
export interface DashboardKpis {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  thisMonthRevenue: number;
  thisMonthOrders: number;
  revenueGrowthPct: number | null;
  ordersToday: number;
  pendingOrders: number;
}

export interface SalesTrendPoint {
  date: string;
  orders: number;
  revenue: number;
}

export interface PendingOrderAlert {
  id: number;
  orderNumber: string;
  totalAmount: string;
  createdAt: string;
  user: { name: string | null; phone: string | null };
}
