import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/** Bump when the Prisma schema changes so dev hot-reload picks up a new client. */
const PRISMA_CLIENT_VERSION = "20260607160000-acceptance-letter-published-at";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaClientVersion?: string;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.prisma &&
    globalForPrisma.prismaClientVersion !== PRISMA_CLIENT_VERSION
  ) {
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prismaClientVersion = PRISMA_CLIENT_VERSION;
    }
  }

  return globalForPrisma.prisma;
}

export const prisma = getPrismaClient();
