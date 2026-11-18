import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@demo.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@demo.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  console.log("Admin user created");

  // Destinations, packages and categories are managed from the admin panel.
  console.log("\nSeed complete!");
  console.log(`Admin login: ${process.env.ADMIN_EMAIL || "admin@demo.com"} / ${process.env.ADMIN_PASSWORD || "admin123"}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
