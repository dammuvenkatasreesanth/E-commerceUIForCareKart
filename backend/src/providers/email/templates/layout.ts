// Shared branded shell for transactional emails — table-based layout with
// inline styles throughout, since many email clients (Outlook especially)
// strip <style> blocks and don't support modern CSS. Colors are hand-copied
// from frontend/src/styles/theme.css (--primary / --accent / --muted /
// --muted-foreground / --border) since email clients can't read that file.

const COLORS = {
  primary: "#1741B0",
  accent: "#0D9488",
  foreground: "#111827",
  muted: "#F3F6FB",
  mutedForeground: "#6B7280",
  border: "#E5E7EB",
  destructive: "#DC2626",
};

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function emailShell(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:${COLORS.muted}; font-family:${FONT_STACK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.muted}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 8px 20px;">
                <span style="font-size:22px; font-weight:800; color:${COLORS.primary}; letter-spacing:-0.02em;">Care<span style="color:${COLORS.accent};">Kart</span></span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff; border-radius:16px; padding:32px 28px; border:1px solid ${COLORS.border};">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0; text-align:center;">
                <p style="margin:0; font-size:12px; color:${COLORS.mutedForeground};">CareKart &middot; Medical-grade PPE, factory-direct.</p>
                <p style="margin:4px 0 0; font-size:11px; color:${COLORS.mutedForeground};">This is an automated email &mdash; please don't reply directly.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function emailHeading(text: string): string {
  return `<h1 style="margin:0 0 12px; font-size:20px; font-weight:800; color:${COLORS.foreground}; line-height:1.3;">${text}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:${COLORS.foreground};">${text}</p>`;
}

export function emailMuted(text: string): string {
  return `<p style="margin:0; font-size:12px; line-height:1.6; color:${COLORS.mutedForeground};">${text}</p>`;
}

export function emailButton(url: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
    <tr>
      <td style="border-radius:12px; background-color:${COLORS.primary};">
        <a href="${url}" style="display:inline-block; padding:13px 28px; font-size:14px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:12px;">${label}</a>
      </td>
    </tr>
  </table>
  <p style="margin:0 0 16px; font-size:12px; color:${COLORS.mutedForeground}; word-break:break-all;">Or paste this link into your browser:<br /><a href="${url}" style="color:${COLORS.primary};">${url}</a></p>`;
}

export function emailDivider(): string {
  return `<div style="height:1px; background-color:${COLORS.border}; margin:20px 0;"></div>`;
}

export function emailSummaryBox(rows: { label: string; value: string; emphasize?: boolean }[]): string {
  const rowsHtml = rows
    .map(
      (r) =>
        `<tr>
          <td style="padding:6px 0; font-size:13px; color:${r.emphasize ? COLORS.foreground : COLORS.mutedForeground}; font-weight:${r.emphasize ? 800 : 500};">${r.label}</td>
          <td style="padding:6px 0; font-size:13px; color:${COLORS.foreground}; font-weight:${r.emphasize ? 800 : 600}; text-align:right;">${r.value}</td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.muted}; border-radius:12px; padding:16px 18px; margin:0 0 20px;">${rowsHtml}</table>`;
}
