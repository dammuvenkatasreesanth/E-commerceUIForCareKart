import { emailShell, emailHeading, emailParagraph, emailButton, emailMuted } from "./layout";

export function verifyEmailEmail(name: string, verifyUrl: string): { subject: string; html: string } {
  const html = emailShell(`
    ${emailHeading(`Hi ${name || "there"},`)}
    ${emailParagraph("Thanks for signing up with CareKart. Verify your email address to activate your account:")}
    ${emailButton(verifyUrl, "Verify Email Address")}
    ${emailMuted("If you didn't create this account, you can safely ignore this email. This link expires in 24 hours.")}
  `);
  return { subject: "Verify your CareKart email address", html };
}

export function customerPasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  const html = emailShell(`
    ${emailHeading(`Hi ${name || "there"},`)}
    ${emailParagraph("We received a request to reset your CareKart password. Choose a new one:")}
    ${emailButton(resetUrl, "Reset Password")}
    ${emailMuted("If you didn't request this, you can safely ignore this email. This link expires in 1 hour.")}
  `);
  return { subject: "Reset your CareKart password", html };
}
