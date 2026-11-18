/**
 * Change the admin login email and password.
 *
 * Usage:
 *   npm run set-admin -- <email> <password>
 *
 * Runs against the local SQLite database by default. To update the live
 * Turso database instead, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN first.
 *
 * If an admin with <email> exists its password is changed. Otherwise the
 * existing admin account is renamed to <email> (or one is created if none exist).
 */

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { passwordError } from "../src/lib/password-rules";

const [emailArg, password] = process.argv.slice(2);
const email = (emailArg ?? "").trim().toLowerCase();

if (!email || !password) {
  console.error("Usage: npm run set-admin -- <email> <password>");
  process.exit(1);
}

const weak = passwordError(password);
if (weak) {
  console.warn(`Warning: this password doesn't meet the admin password rules (${weak}) It will still be set.`);
}

const turso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;
const prisma = turso
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      }),
    })
  : new PrismaClient();

async function main() {
  console.log(`Updating ${turso ? "LIVE Turso" : "local"} database...`);
  const hashed = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { password: hashed } });
    console.log(`Password updated for ${email}`);
    return;
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  if (users.length === 0) {
    await prisma.user.create({ data: { email, password: hashed, name: "Admin", role: "admin" } });
    console.log(`Admin created: ${email}`);
    return;
  }
  if (users.length > 1) {
    console.error(
      `Found ${users.length} admin accounts (${users.map((u) => u.email).join(", ")}). ` +
        "Not sure which one to rename, so nothing was changed."
    );
    process.exitCode = 1;
    return;
  }

  await prisma.user.update({ where: { id: users[0].id }, data: { email, password: hashed } });
  console.log(`Admin login changed from ${users[0].email} to ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
