export function verifyEmailEmail(name: string, verifyUrl: string): { subject: string; html: string } {
  return {
    subject: "Verify your CareKart email address",
    html: `<p>Hi ${name || "there"},</p>
<p>Thanks for signing up with CareKart. Click below to verify your email address and activate your account:</p>
<p><a href="${verifyUrl}">${verifyUrl}</a></p>
<p>If you didn't create this account, you can safely ignore this email. This link expires in 24 hours.</p>`,
  };
}

export function customerPasswordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your CareKart password",
    html: `<p>Hi ${name || "there"},</p>
<p>We received a request to reset your CareKart password. Click below to choose a new one:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>`,
  };
}
