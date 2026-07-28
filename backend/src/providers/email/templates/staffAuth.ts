export function staffInviteEmail(name: string, acceptUrl: string): { subject: string; html: string } {
  return {
    subject: "You've been invited to CareKart",
    html: `<p>Hi ${name || "there"},</p>
<p>An administrator has created a staff account for you on CareKart. Click below to set your password and activate your account:</p>
<p><a href="${acceptUrl}">${acceptUrl}</a></p>
<p>This link expires in 48 hours.</p>`,
  };
}

export function passwordResetEmail(name: string, resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your CareKart password",
    html: `<p>Hi ${name || "there"},</p>
<p>We received a request to reset your CareKart password. Click below to choose a new one:</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>If you didn't request this, you can safely ignore this email. This link expires in 1 hour.</p>`,
  };
}
