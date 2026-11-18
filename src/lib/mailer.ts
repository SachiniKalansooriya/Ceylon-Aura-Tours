import nodemailer from "nodemailer";

/**
 * Sends email through SMTP. For Gmail use:
 *   SMTP_HOST=smtp.gmail.com  SMTP_PORT=465
 *   SMTP_USER=<gmail address> SMTP_PASS=<16-character Google App Password>
 */
export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(to: string, subject: string, text: string, html: string) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Admin";
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"${siteName}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
