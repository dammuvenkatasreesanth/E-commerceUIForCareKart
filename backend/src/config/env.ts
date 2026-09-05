import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_BASE_PATH: z.string().default("/api/v1"),
  // Comma-separated — e.g. "https://mycarekart.com,https://www.mycarekart.com".
  // A single fixed origin here broke every API call (including login) for
  // anyone reaching the site via a URL variant not in the list: the "cors"
  // package echoes back exactly this string as Access-Control-Allow-Origin
  // regardless of the request's actual Origin header, and the browser
  // rejects the response the moment that doesn't match the page's own
  // origin — surfacing as a generic "Failed to fetch" with no CORS-specific
  // detail. www.mycarekart.com fully resolves and serves the site, so it
  // needs to be an allowed origin too, not just the bare domain.
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(30),

  BOOTSTRAP_ADMIN_EMAIL: z.string().email().default("admin@carekart.local"),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(6).default("ChangeMe123!"),
  BOOTSTRAP_ADMIN_NAME: z.string().default("CareKart Admin"),

  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  FACEBOOK_APP_ID: z.string().optional().default(""),
  FACEBOOK_APP_SECRET: z.string().optional().default(""),

  // Product/category/banner images and product videos — free-tier Cloudinary,
  // chosen over local disk storage specifically because Hostinger's redeploy
  // process doesn't guarantee the app's working directory survives between
  // deploys (see backend/DEPLOY.md), and over R2 because it needs no card on
  // file to activate. Uploads 400 with a clear message until these are set.
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),

  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  SMTP_FROM: z.string().default("CareKart <no-reply@carekart.example>"),

  // V1 "Standard Checkout" (Salt Key + Salt Index) — this merchant account is
  // provisioned on V1, not the newer V2 (Client ID/Secret) flow.
  PHONEPE_MERCHANT_ID: z.string().optional().default(""),
  PHONEPE_SALT_KEY: z.string().optional().default(""),
  PHONEPE_SALT_INDEX: z.coerce.number().default(1),
  PHONEPE_ENV: z.enum(["UAT", "PROD"]).default("UAT"),

  // Delhivery ("Authorization: Token X" REST API) — auto-creates a shipment
  // when an order is confirmed, and tracks it. pickup_location must exactly
  // match (case-sensitive) a warehouse name already registered on the account.
  DELHIVERY_API_TOKEN: z.string().optional().default(""),
  DELHIVERY_PICKUP_LOCATION: z.string().optional().default(""),
  DELHIVERY_SELLER_GST_TIN: z.string().optional().default(""),
  DELHIVERY_ENV: z.enum(["STAGING", "PROD"]).default("STAGING"),

  // Our own backend's publicly reachable base URL — PhonePe redirects the browser
  // here (GET) and calls back here (server-to-server POST) after payment.
  PUBLIC_API_BASE_URL: z.string().default("http://localhost:4000/api/v1"),
  FRONTEND_ORDER_CONFIRMATION_URL: z.string().default("http://localhost:5173/order-confirmation"),

  STAFF_APP_URL: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
