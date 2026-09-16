# CORE CPS — Construction Project Services (V0.1 Prototype)

> **Discovery-phase prototype. Not for production use.**
> Contains only fictional sample data — no real CORE project, employee, asset, or
> financial data. Rates and business rules are placeholders/assumptions.

CORE Construction's Construction Project Services (CPS) prototype: a portable,
discovery-driven web application for browsing an equipment catalog, submitting
requests, and running CPS operations (assets, fulfillment, deliveries, returns,
inspections, external rentals). It is built to ask better questions before the
Illinois CPS visit — as much a discovery tool as a product.

## Why this exists
- Establish a portable foundation CORE IT can eventually own and host anywhere.
- Capture research, assumptions, and open questions as **living documents**.
- Avoid hard-coding unverified business rules — make them configurable.

## Tech stack
- **Next.js (App Router, TypeScript)** — frontend + API (`apps/web`)
- **PostgreSQL + Prisma ORM** — data model, migrations, seed (`packages/database`)
- **Docker Compose** — local PostgreSQL and full-stack dev
- Portable by design: no proprietary hosting dependencies in business logic.

## Repository layout
```
core-cps-v0/
├── apps/web/            # Next.js app (frontend + API route handlers)
├── packages/database/   # Prisma schema, migrations, fictional seed data
├── docs/                # Architecture, data model, security, API, research, ADRs
├── docker-compose.yml   # Local PostgreSQL
├── docker-compose.dev.yml
├── Makefile             # dev / migrate / seed / reset / studio / build
└── .env.example
```

## Quick start
```bash
cp .env.example .env            # then edit values (generate NEXTAUTH_SECRET)
docker-compose up -d postgres   # start PostgreSQL
npm install                     # install monorepo deps
make migrate                    # apply database migrations
make seed                       # load FICTIONAL sample data
make dev                        # start http://localhost:3000
```
Full instructions: [docs/local-development.md](./docs/local-development.md).

## Documentation
- [Docs index](./docs/README.md)
- [Architecture](./docs/architecture.md) · [Data Model](./docs/data-model.md) ·
  [Security](./docs/security.md) · [API](./docs/api.md)
- [Assumptions](./docs/assumptions.md) · [Open Questions](./docs/open-questions.md)
- [Illinois Discovery](./docs/illinois-discovery.md) · [IT Review](./docs/it-review.md)
- [Blue Hat Public Research](./docs/research/bluehat-research.md)
- [Architecture Decision Records](./docs/decisions/)
- [CHANGELOG](./CHANGELOG.md)

## Status
V0.1 establishes the portable foundation, data model, migrations, and
documentation. Primary user/operations workflows are built in subsequent phases
(see [docs/README.md](./docs/README.md) capabilities checklist).

## License / use
Internal CORE Construction prototype. Not licensed for external or production use.
