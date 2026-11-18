/**
 * Push schema and seed data to Turso cloud database.
 *
 * Usage:
 *   npx tsx scripts/push-to-turso.ts
 *
 * Make sure TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are set
 * in your environment or .env.production file.
 */

import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("❌ Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  console.error("   Set them in your terminal before running this script:");
  console.error('   $env:TURSO_DATABASE_URL="libsql://..."');
  console.error('   $env:TURSO_AUTH_TOKEN="..."');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log("🚀 Pushing schema to Turso...\n");

  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("  ✅ User table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Package (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      duration TEXT NOT NULL,
      durationDays INTEGER NOT NULL,
      price REAL,
      priceLabel TEXT,
      image TEXT,
      images TEXT,
      destinations TEXT NOT NULL,
      itinerary TEXT,
      inclusions TEXT,
      exclusions TEXT,
      seoTitle TEXT,
      seoDesc TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("  ✅ Package table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Destination (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      shortDesc TEXT,
      image TEXT,
      images TEXT,
      category TEXT NOT NULL,
      highlights TEXT,
      seoTitle TEXT,
      seoDesc TEXT,
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("  ✅ Destination table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Category (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Add columns if the Category table was created before they existed
  for (const col of ["description", "image"]) {
    try {
      await client.execute(`ALTER TABLE Category ADD COLUMN ${col} TEXT`);
    } catch {
      // column already exists
    }
  }
  // Backfill categories already used by existing destinations
  await client.execute(`
    INSERT OR IGNORE INTO Category (id, name)
    SELECT 'cat_' || lower(hex(randomblob(10))), category
    FROM (SELECT DISTINCT category FROM Destination WHERE category IS NOT NULL AND category <> '')
  `);
  console.log("  ✅ Category table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS Inquiry (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT,
      destinations TEXT NOT NULL,
      travelers INTEGER,
      dateFrom TEXT,
      dateTo TEXT,
      message TEXT,
      sentVia TEXT DEFAULT 'whatsapp',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("  ✅ Inquiry table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS SiteSetting (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    )
  `);
  console.log("  ✅ SiteSetting table created");

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ceylonauratours.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await hash(adminPassword, 12);

  // Check if admin exists
  const existing = await client.execute({
    sql: "SELECT id FROM User WHERE email = ?",
    args: [adminEmail],
  });

  if (existing.rows.length === 0) {
    const id = `cuid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await client.execute({
      sql: "INSERT INTO User (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)",
      args: [id, adminEmail, hashedPassword, "Admin", "admin"],
    });
    console.log(`\n  ✅ Admin user created: ${adminEmail}`);
  } else {
    console.log(`\n  ℹ️  Admin user already exists: ${adminEmail}`);
  }

  console.log("\n🎉 Done! Your Turso database is ready.\n");
}

main().catch(console.error);
