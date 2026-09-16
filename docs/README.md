# CORE CPS — Construction Project Services Prototype

**Version:** V0.1 (Discovery Prototype)
**Status:** Pre-production prototype — not for operational use
**Purpose:** Discovery and stakeholder demonstration for CORE Construction's CPS operation

## What This Is

This is an early working prototype for CORE Construction's Construction Project Services (CPS) operation. 
It is a tool for discovery as much as a software product. The goal before the Illinois CPS visit is to have 
enough of a working system to ask much better questions about what CPS actually needs.

## What This Is NOT

- This is NOT a production system
- This is NOT a clone of Blue Hat or any other platform
- Prototype rates are NOT actual CORE rates
- Seed data is fictional — no real CORE project, employee, or financial data is included
- Business rules not yet confirmed with CORE stakeholders are marked as assumptions and made configurable

## Current Capabilities (V0.1)

- [ ] Project user: browse catalog, search, submit requests, upload documents, view request status
- [ ] Free-form requests for items not in catalog
- [ ] CPS operations dashboard: pending requests, active assignments, equipment by project/location
- [ ] CPS request review: assign asset, choose fulfillment type, record external rental
- [ ] Asset tracking: delivery, transfer, return, inspection, meter readings
- [ ] External rental tracking
- [ ] Configurable rate cards (sample data only)
- [ ] Role-based access: Project User, CPS Coordinator, Warehouse/Logistics, CPS Manager, Leadership, Admin
- [ ] Audit trail for important actions
- [ ] Basic reporting: equipment by project/location, pending requests, upcoming returns

## Quick Start

See [docs/local-development.md](./local-development.md) for full local setup instructions.

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up -d postgres
make migrate
make seed
make dev
```

## Repository Structure

| Path | Contents |
|------|----------|
| `apps/web/` | Next.js application (frontend + API) |
| `packages/database/` | Prisma schema, migrations, seed data |
| `docs/` | All project documentation |
| `docs/research/` | Blue Hat / JE Dunn research findings |
| `docs/decisions/` | Architecture Decision Records |

## Key Documentation

- [Architecture](./architecture.md)
- [Data Model](./data-model.md)
- [Security](./security.md)
- [API](./api.md)
- [Local Development](./local-development.md)
- [Open Questions](./open-questions.md)
- [Illinois Discovery Questions](./illinois-discovery.md)
- [IT Review Questions](./it-review.md)
- [Assumptions Register](./assumptions.md)
- [Blue Hat Research](./research/bluehat-research.md)

## Stakeholder Contacts

> TODO: Add CORE stakeholder contacts before Illinois visit

## Discovery Status

This prototype is designed to support discovery with:
- Illinois CPS operation team
- Florida CPS operation
- CORE Accounting
- CORE Leadership
- CORE IT

See [open-questions.md](./open-questions.md) for the full list of unresolved questions.
