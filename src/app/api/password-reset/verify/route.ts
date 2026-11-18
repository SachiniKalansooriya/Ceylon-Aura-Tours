import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordError } from "@/lib/password-rules";

const MAX_ATTEMPTS = 5;

/** Step 2: check the emailed code and set the new password. */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your email." }, { status: 400 });
  }
  const ruleError = passwordError(password);
  if (ruleError) {
    return NextResponse.json({ error: ruleError }, { status: 400 });
  }

  const invalid = NextResponse.json(
    { error: "That code is invalid or has expired. Request a new one." },
    { status: 400 }
  );

  const reset = await prisma.passwordReset.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
  if (!reset || reset.expiresAt < new Date() || reset.attempts >= MAX_ATTEMPTS) return invalid;

  const matches = await bcrypt.compare(code, reset.codeHash);
  if (!matches) {
    const updated = await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { attempts: { increment: 1 } },
    });
    const left = MAX_ATTEMPTS - updated.attempts;
    return NextResponse.json(
      {
        error:
          left > 0
            ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`
            : "Too many incorrect attempts. Request a new code.",
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return invalid;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(password, 12) },
    }),
    prisma.passwordReset.deleteMany({ where: { email } }),
  ]);

  return NextResponse.json({ success: true });
}
