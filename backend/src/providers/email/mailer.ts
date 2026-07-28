import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    })
  : null;

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  if (!transporter) {
    logger.warn(
      { to: options.to, subject: options.subject, html: options.html },
      `[DEV EMAIL] SMTP not configured — logging instead of sending`,
    );
    return;
  }
  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  });
}
