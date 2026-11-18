import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isMailConfigured, sendMail } from "@/lib/mailer";

const CODE_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Step 1: email a 6-digit code to the admin.
 * Always answers the same way whether or not the email exists, so the
 * form can't be used to discover admin addresses.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  if (!isMailConfigured()) {
    console.error("Password reset requested but SMTP_* environment variables are not set");
    return NextResponse.json(
      { error: "Password recovery email is not set up on the server yet." },
      { status: 503 }
    );
  }

  const ok = NextResponse.json({ success: true });

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return ok;

  const latest = await prisma.passwordReset.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
    return NextResponse.json(
      { error: `Please wait a minute before requesting another code.` },
      { status: 429 }
    );
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");

  // Only the newest code is valid.
  await prisma.passwordReset.deleteMany({ where: { email } });
  await prisma.passwordReset.create({
    data: {
      email,
      codeHash: await bcrypt.hash(code, 10),
      expiresAt: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000),
    },
  });

  try {
    await sendMail(
      user.email,
      "Your admin password reset code",
      `Your password reset code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes. If you didn't request this, you can ignore this email.`,
      `<div style="font-family:Arial,sans-serif;max-width:420px">
         <p>Use this code to reset your admin password:</p>
         <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:16px 0">${code}</p>
         <p style="color:#666">It expires in ${CODE_TTL_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
       </div>`
    );
  } catch (err) {
    console.error("Failed to send password reset email", err);
    await prisma.passwordReset.deleteMany({ where: { email } });
    return NextResponse.json({ error: "Could not send the email. Please try again later." }, { status: 502 });
  }

  return ok;
}
