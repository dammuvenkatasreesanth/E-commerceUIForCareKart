import { mysqlTable, int, varchar, text, boolean, datetime, decimal, json, mysqlEnum, index, uniqueIndex, primaryKey } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

// ── Enums (Prisma stores these as native MySQL ENUM columns) ──────────────
export const ROLE = ["CUSTOMER", "ADMIN", "EMPLOYEE"] as const;
export const USER_STATUS = ["PENDING_CLAIM", "ACTIVE", "BLOCKED", "SUSPENDED"] as const;
export const ACCOUNT_TYPE = ["RETAIL", "BUSINESS"] as const;
export const GST_STATUS = ["NONE", "PENDING", "APPROVED", "REJECTED"] as const;
export const ORDER_STATUS = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURN_REQUESTED", "RETURNED"] as const;
export const PAYMENT_METHOD = ["UPI", "CARD", "NETBANKING", "PHONEPE", "COD"] as const;
export const PAYMENT_STATUS = ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"] as const;
export const PAYMENT_PROVIDER = ["PHONEPE", "COD"] as const;
export const PAYMENT_TXN_STATUS = ["INITIATED", "PENDING", "SUCCESS", "FAILED"] as const;
export const REFUND_STATUS = ["REQUESTED", "APPROVED", "REJECTED", "PROCESSING", "COMPLETED", "FAILED"] as const;
export const RETURN_STATUS = ["REQUESTED", "APPROVED", "REJECTED", "PICKUP_SCHEDULED", "RECEIVED", "INSPECTED", "RESTOCKED", "WRITTEN_OFF", "REFUNDED"] as const;
export const COUPON_TYPE = ["PERCENT", "FLAT"] as const;
export const TICKET_STATUS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export const TICKET_PRIORITY = ["LOW", "MEDIUM", "HIGH"] as const;
export const CAMPAIGN_STATUS = ["DRAFT", "SCHEDULED", "SENDING", "SENT", "FAILED"] as const;
export const REVIEW_STATUS = ["PENDING", "APPROVED", "REJECTED"] as const;

const createdAt = () => datetime("createdAt", { fsp: 3 }).notNull().default(sql`CURRENT_TIMESTAMP(3)`);
// Prisma's @updatedAt is enforced client-side (no MySQL ON UPDATE clause exists on
// the live table) — callers must pass `updatedAt: new Date()` explicitly on every update.
const updatedAt = () => datetime("updatedAt", { fsp: 3 }).notNull();

// ── Identity ────────────────────────────────────────────────────────────
export const users = mysqlTable("User", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 191 }),
  email: varchar("email", { length: 191 }).unique(),
  passwordHash: varchar("passwordHash", { length: 191 }),
  emailVerified: boolean("emailVerified").notNull().default(false),
  emailVerifiedAt: datetime("emailVerifiedAt", { fsp: 3 }),
  googleId: varchar("googleId", { length: 191 }).unique(),
  facebookId: varchar("facebookId", { length: 191 }).unique(),
  avatarUrl: varchar("avatarUrl", { length: 191 }),
  role: mysqlEnum("role", ROLE).notNull().default("CUSTOMER"),
  status: mysqlEnum("status", USER_STATUS).notNull().default("ACTIVE"),
  name: varchar("name", { length: 191 }),
  accountType: mysqlEnum("accountType", ACCOUNT_TYPE).notNull().default("RETAIL"),
  gstin: varchar("gstin", { length: 191 }),
  gstStatus: mysqlEnum("gstStatus", GST_STATUS).notNull().default("NONE"),
  claimedAt: datetime("claimedAt", { fsp: 3 }),
  lastLoginAt: datetime("lastLoginAt", { fsp: 3 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("User_role_idx").on(t.role)]);

export const emailVerificationTokens = mysqlTable("EmailVerificationToken", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 191 }).notNull().unique(),
  expiresAt: datetime("expiresAt", { fsp: 3 }).notNull(),
  consumedAt: datetime("consumedAt", { fsp: 3 }),
  createdAt: createdAt(),
}, (t) => [index("EmailVerificationToken_userId_idx").on(t.userId)]);

export const staffInvites = mysqlTable("StaffInvite", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 191 }).notNull().unique(),
  expiresAt: datetime("expiresAt", { fsp: 3 }).notNull(),
  acceptedAt: datetime("acceptedAt", { fsp: 3 }),
  issuedById: int("issuedById").notNull(),
  createdAt: createdAt(),
}, (t) => [index("StaffInvite_userId_idx").on(t.userId)]);

export const passwordResetTokens = mysqlTable("PasswordResetToken", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 191 }).notNull().unique(),
  expiresAt: datetime("expiresAt", { fsp: 3 }).notNull(),
  consumedAt: datetime("consumedAt", { fsp: 3 }),
  createdAt: createdAt(),
}, (t) => [index("PasswordResetToken_userId_idx").on(t.userId)]);

export const refreshTokens = mysqlTable("RefreshToken", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 191 }).notNull().unique(),
  userAgent: varchar("userAgent", { length: 191 }),
  createdByIp: varchar("createdByIp", { length: 191 }),
  expiresAt: datetime("expiresAt", { fsp: 3 }).notNull(),
  revokedAt: datetime("revokedAt", { fsp: 3 }),
  replacedById: int("replacedById"),
  createdAt: createdAt(),
}, (t) => [index("RefreshToken_userId_idx").on(t.userId)]);

export const addresses = mysqlTable("Address", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 191 }),
  name: varchar("name", { length: 191 }).notNull(),
  line1: varchar("line1", { length: 191 }).notNull(),
  line2: varchar("line2", { length: 191 }),
  city: varchar("city", { length: 191 }).notNull(),
  state: varchar("state", { length: 191 }).notNull(),
  pincode: varchar("pincode", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 191 }).notNull(),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("Address_userId_idx").on(t.userId)]);

// ── Catalog ─────────────────────────────────────────────────────────────
export const categories = mysqlTable("Category", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  parentId: int("parentId"),
  imageUrl: varchar("imageUrl", { length: 191 }),
  isActive: boolean("isActive").notNull().default(true),
  showOnHomepage: boolean("showOnHomepage").notNull().default(false),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const products = mysqlTable("Product", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  name: varchar("name", { length: 191 }).notNull(),
  tagline: varchar("tagline", { length: 191 }),
  description: text("description").notNull(),
  categoryId: int("categoryId").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  mrp: decimal("mrp", { precision: 10, scale: 2 }).notNull(),
  material: varchar("material", { length: 191 }),
  badge: varchar("badge", { length: 191 }),
  videoUrl: varchar("videoUrl", { length: 191 }),
  features: json("features"),
  specs: json("specs"),
  moq: int("moq").notNull().default(1),
  gstRate: decimal("gstRate", { precision: 4, scale: 2 }).notNull().default("18.00"),
  hsnCode: varchar("hsnCode", { length: 191 }),
  isActive: boolean("isActive").notNull().default(true),
  inStock: boolean("inStock").notNull().default(true),
  ratingAvg: decimal("ratingAvg", { precision: 3, scale: 2 }).notNull().default("0.00"),
  ratingCount: int("ratingCount").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("Product_categoryId_idx").on(t.categoryId)]);

export const productImages = mysqlTable("ProductImage", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  url: varchar("url", { length: 191 }).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
}, (t) => [index("ProductImage_productId_idx").on(t.productId)]);

export const productSizes = mysqlTable("ProductSize", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  size: varchar("size", { length: 191 }).notNull(),
  sortOrder: int("sortOrder").notNull().default(0),
}, (t) => [uniqueIndex("ProductSize_productId_size_key").on(t.productId, t.size)]);

export const packPriceTiers = mysqlTable("PackPriceTier", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  tierIndex: int("tierIndex").notNull(),
  label: varchar("label", { length: 191 }).notNull(),
  packQty: int("packQty").notNull(),
  discountPct: decimal("discountPct", { precision: 5, scale: 2 }).notNull(),
  tag: varchar("tag", { length: 191 }),
}, (t) => [uniqueIndex("PackPriceTier_productId_tierIndex_key").on(t.productId, t.tierIndex)]);

// ── Cart / Wishlist / Reviews ──────────────────────────────────────────
export const cartItems = mysqlTable("CartItem", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  sizeLabel: varchar("sizeLabel", { length: 191 }).notNull(),
  tierIndex: int("tierIndex").notNull().default(0),
  quantity: int("quantity").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [uniqueIndex("CartItem_userId_productId_sizeLabel_tierIndex_key").on(t.userId, t.productId, t.sizeLabel, t.tierIndex)]);

export const wishlistItems = mysqlTable("WishlistItem", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("WishlistItem_userId_productId_key").on(t.userId, t.productId)]);

export const reviews = mysqlTable("Review", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 191 }),
  body: text("body").notNull(),
  isVerifiedPurchase: boolean("isVerifiedPurchase").notNull().default(false),
  status: mysqlEnum("status", REVIEW_STATUS).notNull().default("APPROVED"),
  helpfulCount: int("helpfulCount").notNull().default(0),
  createdAt: createdAt(),
}, (t) => [index("Review_productId_idx").on(t.productId)]);

// ── Coupons ─────────────────────────────────────────────────────────────
export const coupons = mysqlTable("Coupon", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 191 }).notNull().unique(),
  type: mysqlEnum("type", COUPON_TYPE).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").notNull().default(0),
  isActive: boolean("isActive").notNull().default(true),
  expiresAt: datetime("expiresAt", { fsp: 3 }),
  createdById: int("createdById"),
  createdAt: createdAt(),
});

export const couponRedemptions = mysqlTable("CouponRedemption", {
  id: int("id").autoincrement().primaryKey(),
  couponId: int("couponId").notNull(),
  orderId: int("orderId").notNull(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: createdAt(),
}, (t) => [index("CouponRedemption_couponId_idx").on(t.couponId)]);

// ── Orders / Payments / Returns ────────────────────────────────────────
export const orders = mysqlTable("Order", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 191 }).notNull().unique(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ORDER_STATUS).notNull().default("PENDING"),
  paymentMethod: mysqlEnum("paymentMethod", PAYMENT_METHOD).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", PAYMENT_STATUS).notNull().default("PENDING"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discountAmount", { precision: 12, scale: 2 }).notNull().default("0.00"),
  shippingAmount: decimal("shippingAmount", { precision: 12, scale: 2 }).notNull().default("0.00"),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }).notNull().default("0.00"),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  couponId: int("couponId"),
  shipName: varchar("shipName", { length: 191 }).notNull(),
  shipPhone: varchar("shipPhone", { length: 191 }).notNull(),
  shipLine1: varchar("shipLine1", { length: 191 }).notNull(),
  shipLine2: varchar("shipLine2", { length: 191 }),
  shipCity: varchar("shipCity", { length: 191 }).notNull(),
  shipState: varchar("shipState", { length: 191 }).notNull(),
  shipPincode: varchar("shipPincode", { length: 191 }).notNull(),
  billingGstin: varchar("billingGstin", { length: 191 }),
  billingAccountType: mysqlEnum("billingAccountType", ACCOUNT_TYPE).notNull().default("RETAIL"),
  trackingId: varchar("trackingId", { length: 191 }),
  carrier: varchar("carrier", { length: 191 }),
  cancelReason: varchar("cancelReason", { length: 191 }),
  cancelledAt: datetime("cancelledAt", { fsp: 3 }),
  placedAt: createdAt(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("Order_userId_idx").on(t.userId), index("Order_status_idx").on(t.status)]);

export const orderItems = mysqlTable("OrderItem", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId"),
  productName: varchar("productName", { length: 191 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 191 }),
  sizeLabel: varchar("sizeLabel", { length: 191 }).notNull(),
  tierIndex: int("tierIndex").notNull().default(0),
  packQty: int("packQty").notNull().default(1),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  lineTotal: decimal("lineTotal", { precision: 12, scale: 2 }).notNull(),
  gstRate: decimal("gstRate", { precision: 4, scale: 2 }).notNull(),
  hsnCode: varchar("hsnCode", { length: 191 }),
}, (t) => [index("OrderItem_orderId_idx").on(t.orderId)]);

export const orderStatusHistory = mysqlTable("OrderStatusHistory", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  fromStatus: mysqlEnum("fromStatus", ORDER_STATUS),
  toStatus: mysqlEnum("toStatus", ORDER_STATUS).notNull(),
  changedById: int("changedById"),
  note: varchar("note", { length: 191 }),
  createdAt: createdAt(),
}, (t) => [index("OrderStatusHistory_orderId_idx").on(t.orderId)]);

export const orderNotes = mysqlTable("OrderNote", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  authorId: int("authorId").notNull(),
  isInternal: boolean("isInternal").notNull().default(true),
  note: text("note").notNull(),
  createdAt: createdAt(),
}, (t) => [index("OrderNote_orderId_idx").on(t.orderId)]);

export const payments = mysqlTable("Payment", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  provider: mysqlEnum("provider", PAYMENT_PROVIDER).notNull(),
  merchantTransactionId: varchar("merchantTransactionId", { length: 191 }).notNull().unique(),
  providerTransactionId: varchar("providerTransactionId", { length: 191 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", PAYMENT_TXN_STATUS).notNull().default("INITIATED"),
  rawResponse: json("rawResponse"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("Payment_orderId_idx").on(t.orderId)]);

export const refunds = mysqlTable("Refund", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  paymentId: int("paymentId"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  reason: varchar("reason", { length: 191 }),
  status: mysqlEnum("status", REFUND_STATUS).notNull().default("REQUESTED"),
  initiatedById: int("initiatedById"),
  providerRefundId: varchar("providerRefundId", { length: 191 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("Refund_orderId_idx").on(t.orderId)]);

export const returnRequests = mysqlTable("ReturnRequest", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  orderItemId: int("orderItemId"),
  userId: int("userId").notNull(),
  reason: varchar("reason", { length: 191 }).notNull(),
  requestedQty: int("requestedQty").notNull(),
  status: mysqlEnum("status", RETURN_STATUS).notNull().default("REQUESTED"),
  inspectionNotes: varchar("inspectionNotes", { length: 191 }),
  resolvedById: int("resolvedById"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("ReturnRequest_orderId_idx").on(t.orderId)]);

// ── Marketing / Content / Settings ─────────────────────────────────────
export const banners = mysqlTable("Banner", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 191 }),
  headline: varchar("headline", { length: 191 }).notNull(),
  subheadline: varchar("subheadline", { length: 191 }),
  subtext: varchar("subtext", { length: 191 }),
  ctaPrimaryText: varchar("ctaPrimaryText", { length: 191 }),
  ctaPrimaryLink: varchar("ctaPrimaryLink", { length: 191 }),
  ctaSecondaryText: varchar("ctaSecondaryText", { length: 191 }),
  ctaSecondaryLink: varchar("ctaSecondaryLink", { length: 191 }),
  bgGradient: varchar("bgGradient", { length: 191 }),
  imageUrl: varchar("imageUrl", { length: 191 }),
  isActive: boolean("isActive").notNull().default(true),
  sortOrder: int("sortOrder").notNull().default(0),
  startsAt: datetime("startsAt", { fsp: 3 }),
  endsAt: datetime("endsAt", { fsp: 3 }),
  createdAt: createdAt(),
});

export const contentPages = mysqlTable("ContentPage", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 191 }).notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  isPublished: boolean("isPublished").notNull().default(true),
  updatedById: int("updatedById"),
  updatedAt: updatedAt(),
  createdAt: createdAt(),
});

export const storeSettings = mysqlTable("StoreSetting", {
  key: varchar("key", { length: 191 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: updatedAt(),
});

export const emailCampaigns = mysqlTable("EmailCampaign", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 191 }).notNull(),
  bodyHtml: text("bodyHtml").notNull(),
  segment: json("segment"),
  status: mysqlEnum("status", CAMPAIGN_STATUS).notNull().default("DRAFT"),
  scheduledAt: datetime("scheduledAt", { fsp: 3 }),
  sentAt: datetime("sentAt", { fsp: 3 }),
  recipientCount: int("recipientCount").notNull().default(0),
  createdById: int("createdById"),
  createdAt: createdAt(),
});

// ── Support / Audit ─────────────────────────────────────────────────────
export const supportTickets = mysqlTable("SupportTicket", {
  id: int("id").autoincrement().primaryKey(),
  ticketNumber: varchar("ticketNumber", { length: 191 }).notNull().unique(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  subject: varchar("subject", { length: 191 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", TICKET_STATUS).notNull().default("OPEN"),
  priority: mysqlEnum("priority", TICKET_PRIORITY).notNull().default("MEDIUM"),
  assignedToId: int("assignedToId"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (t) => [index("SupportTicket_userId_idx").on(t.userId), index("SupportTicket_status_idx").on(t.status)]);

export const ticketNotes = mysqlTable("TicketNote", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  authorId: int("authorId").notNull(),
  isInternal: boolean("isInternal").notNull().default(false),
  note: text("note").notNull(),
  createdAt: createdAt(),
}, (t) => [index("TicketNote_ticketId_idx").on(t.ticketId)]);

export const auditLogs = mysqlTable("AuditLog", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId"),
  action: varchar("action", { length: 191 }).notNull(),
  entityType: varchar("entityType", { length: 191 }).notNull(),
  entityId: int("entityId"),
  metadata: json("metadata"),
  ipAddress: varchar("ipAddress", { length: 191 }),
  createdAt: createdAt(),
}, (t) => [index("AuditLog_entityType_entityId_idx").on(t.entityType, t.entityId), index("AuditLog_actorId_idx").on(t.actorId)]);

// ── Relations (mirrors prisma's include/relation graph) ────────────────
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  refreshTokens: many(refreshTokens),
  emailVerifications: many(emailVerificationTokens),
  passwordResets: many(passwordResetTokens),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  reviews: many(reviews),
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  sizes: many(productSizes),
  packTiers: many(packPriceTiers),
  reviews: many(reviews),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  product: one(products, { fields: [productSizes.productId], references: [products.id] }),
}));

export const packPriceTiersRelations = relations(packPriceTiers, ({ one }) => ({
  product: one(products, { fields: [packPriceTiers.productId], references: [products.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
  product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
}));

export const couponsRelations = relations(coupons, ({ many }) => ({
  redemptions: many(couponRedemptions),
  orders: many(orders),
}));

export const couponRedemptionsRelations = relations(couponRedemptions, ({ one }) => ({
  coupon: one(coupons, { fields: [couponRedemptions.couponId], references: [coupons.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  coupon: one(coupons, { fields: [orders.couponId], references: [coupons.id] }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  notes: many(orderNotes),
  payments: many(payments),
  refunds: many(refunds),
  returns: many(returnRequests),
  reviews: many(reviews),
  tickets: many(supportTickets),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, { fields: [orderStatusHistory.orderId], references: [orders.id] }),
}));

export const orderNotesRelations = relations(orderNotes, ({ one }) => ({
  order: one(orders, { fields: [orderNotes.orderId], references: [orders.id] }),
  author: one(users, { fields: [orderNotes.authorId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, { fields: [refunds.orderId], references: [orders.id] }),
  initiatedBy: one(users, { fields: [refunds.initiatedById], references: [users.id] }),
}));

export const returnRequestsRelations = relations(returnRequests, ({ one }) => ({
  order: one(orders, { fields: [returnRequests.orderId], references: [orders.id] }),
  user: one(users, { fields: [returnRequests.userId], references: [users.id] }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, { fields: [supportTickets.userId], references: [users.id] }),
  order: one(orders, { fields: [supportTickets.orderId], references: [orders.id] }),
  assignedTo: one(users, { fields: [supportTickets.assignedToId], references: [users.id] }),
  notes: many(ticketNotes),
}));

export const ticketNotesRelations = relations(ticketNotes, ({ one }) => ({
  ticket: one(supportTickets, { fields: [ticketNotes.ticketId], references: [supportTickets.id] }),
  author: one(users, { fields: [ticketNotes.authorId], references: [users.id] }),
}));
