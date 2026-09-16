/**
 * Application database client.
 *
 * Re-exports the single shared Prisma client from the @core-cps/database
 * package so the whole app uses one connection pool. Keeping the client in the
 * shared package avoids duplicate PrismaClient instances across the monorepo.
 */
export { prisma } from "@core-cps/database";
export type * from "@core-cps/database";
