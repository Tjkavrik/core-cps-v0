// Shared Prisma client for the CORE CPS prototype.
// Import this from apps to get a single, typed database client.
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __cpsPrisma: PrismaClient | undefined;
}

export const prisma =
  global.__cpsPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__cpsPrisma = prisma;
}

export * from "@prisma/client";
export default prisma;
