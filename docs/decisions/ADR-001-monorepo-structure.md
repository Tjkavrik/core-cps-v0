# ADR-001: Monorepo with `apps/` and `packages/` structure

**Status:** Accepted
**Date:** September 2026

## Context
We need to organize the Next.js application and the Prisma database layer so they
can share TypeScript types and a single migration source, and so additional
services can be added later without restructuring.

## Decision
Use a Turbo-style monorepo with npm workspaces:
- `apps/web` — the Next.js application (frontend + API).
- `packages/database` — the Prisma schema, migrations, seed data, and a shared,
  typed database client.

## Consequences
- Shared, generated Prisma types are available to the app via `@core-cps/database`.
- A single source of truth for schema and migrations.
- Easy to add more apps/packages (e.g. a worker or a second app) later.
- Slightly more tooling setup than a single package, accepted for portability and
  clarity.
