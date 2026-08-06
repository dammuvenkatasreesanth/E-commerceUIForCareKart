import { emailShell, emailHeading, emailParagraph, emailButton, emailMuted } from "./layout";

export function staffInviteEmail(name: string, acceptUrl: string): { subject: string; html: string } {
  const html = emailShell(`
    ${emailHeading(`Hi ${name || "there"},`)}
    ${emailParagraph("An administrator has created a staff account for you on CareKart. Set your password to activate it:")}
    ${emailButton(acceptUrl, "Set Your Password")}
    ${emailMuted("This link expires in 48 hours.")}
  `);
  return { subject: "You've been invited to CareKart", html };
}

export function passwordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  const html = emailShell(`
    ${emailHeading(`Hi ${name || "there"},`)}
    ${emailParagraph("We received a request to reset your CareKart staff password. Choose a new one:")}
    ${emailButton(resetUrl, "Reset Password")}
    ${emailMuted("If you didn't request this, you can safely ignore this email. This link expires in 1 hour.")}
  `);
  return { subject: "Reset your CareKart password", html };
}
