import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_BASE_PATH: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().default(30),

  BOOTSTRAP_ADMIN_EMAIL: z.string().email().default("admin@carekart.local"),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(6).default("ChangeMe123!"),
  BOOTSTRAP_ADMIN_NAME: z.string().default("CareKart Admin"),

  SMS_PROVIDER: z.enum(["console", "msg91"]).default("console"),
  MSG91_AUTH_KEY: z.string().optional().default(""),
  MSG91_TEMPLATE_ID: z.string().optional().default(""),
  MSG91_SENDER_ID: z.string().optional().default("CAREKT"),

  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  SMTP_FROM: z.string().default("CareKart <no-reply@carekart.example>"),

  PHONEPE_MERCHANT_ID: z.string().optional().default(""),
  PHONEPE_SALT_KEY: z.string().optional().default(""),
  PHONEPE_SALT_INDEX: z.coerce.number().default(1),
  PHONEPE_ENV: z.enum(["UAT", "PROD"]).default("UAT"),

  // Our own backend's publicly reachable base URL — PhonePe redirects the browser
  // here (GET) and calls back here (server-to-server POST) after payment.
  PUBLIC_API_BASE_URL: z.string().default("http://localhost:4000/api/v1"),
  FRONTEND_ORDER_CONFIRMATION_URL: z.string().default("http://localhost:5173/order-confirmation"),

  UPLOAD_DIR: z.string().default("uploads"),
  PUBLIC_UPLOAD_BASE_URL: z.string().default("http://localhost:4000/uploads"),

  STAFF_APP_URL: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
