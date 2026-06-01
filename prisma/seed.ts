import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PROGRAMME_SEED_ENTRIES } from "../src/lib/college-programmes";
import { ensureDefaultSystemSettings } from "../src/lib/system-settings";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file before seeding.");
}

const pool = new Pool({ connectionString, max: 2 });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@transitcollege.sl";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "System Administrator";

const SAMPLE_PROGRAMMES = PROGRAMME_SEED_ENTRIES;

async function withRetry<T>(label: string, fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < attempts) {
        console.warn(`  ↻ ${label} failed (attempt ${i}/${attempts}), retrying…`);
        await new Promise((r) => setTimeout(r, 1500 * i));
      }
    }
  }
  throw lastError;
}

async function main() {
  console.log("🌱 Seeding Transit College admission database...\n");

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await withRetry("Admin upsert", () =>
    prisma.admin.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        fullname: ADMIN_NAME,
        password: hashedPassword,
        status: "active",
        role: "super_admin",
      },
      create: {
        fullname: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: "+232 76 000 0000",
        password: hashedPassword,
        role: "super_admin",
        status: "active",
      },
    })
  );

  console.log("✓ Admin account ready");
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`  Role:     ${admin.role}\n`);

  let programmeCount = 0;
  for (const programme of SAMPLE_PROGRAMMES) {
    await withRetry(`Programme "${programme.programmeName}"`, async () => {
      const existing = await prisma.programme.findFirst({
        where: { programmeName: programme.programmeName },
      });

      if (!existing) {
        await prisma.programme.create({ data: programme });
        programmeCount++;
      }
    });
  }

  console.log(
    `✓ Programmes seeded (${programmeCount} new, ${SAMPLE_PROGRAMMES.length} checked)\n`
  );

  await withRetry("System settings", () => ensureDefaultSystemSettings());
  console.log("✓ System settings ready\n");

  const testPinCode = (process.env.SEED_TEST_PIN ?? "TC-TEST-001").toUpperCase();

  await withRetry("Test PIN", async () => {
    await prisma.pin.upsert({
      where: { pinCode: testPinCode },
      update: {
        status: "unused",
        usedByStudentId: null,
        usedAt: null,
        generatedById: admin.id,
        receiptNumber: "RCP-SEED-001",
        amount: 450,
      },
      create: {
        pinCode: testPinCode,
        receiptNumber: "RCP-SEED-001",
        amount: 450,
        status: "unused",
        generatedById: admin.id,
      },
    });
    console.log("✓ Test admission PIN ready (reset to unused)");
    console.log(`  PIN: ${testPinCode}\n`);
  });

  console.log("Done. Login at /auth/admin/login with the admin credentials above.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
