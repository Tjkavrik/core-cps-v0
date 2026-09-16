# Architecture — CORE CPS V0.1

**Status:** Living document. Updated as the prototype develops.
**Audience:** CORE IT, future developers, CPS stakeholders.

---

## 1. Overview

CORE CPS is organized as a **monorepo** containing a Next.js web application and a
shared database package. Portability is a **first-class concern**: Abacus AI
hosting is treated as *prototype hosting only*. No Abacus-specific service,
runtime, or API appears in application or business logic. A developer must be
able to clone the repository, configure environment variables, provision
PostgreSQL, run migrations, seed data, and run the application on any Node.js +
PostgreSQL environment (local, on-prem, or another cloud).

```
core-cps-v0/
├── apps/web/            # Next.js frontend + API (Route Handlers)
├── packages/database/   # Prisma schema, migrations, seed (shared)
└── docs/                # Documentation, ADRs, research
```

Key principles:

- **Portable by default** — everything external is configured via environment
  variables; see [ADR-005](./decisions/ADR-005-portable-architecture.md).
- **Replaceable interfaces** — storage, authentication, and (future) ERP/identity
  integrations sit behind interfaces so the prototype's implementation can be
  swapped without touching business logic.
- **Discovery-driven** — unverified business rules are configuration or open
  questions, never hard-coded constants.

---

## 2. Application Layers

### 2.1 Presentation Layer
- **Next.js App Router** with React and TypeScript.
- **Tailwind CSS** for styling with a neutral construction-operations palette
  (not Blue Hat branding).
- Server Components by default; Client Components only where interactivity
  requires it.
- UI may hide unauthorized actions for UX, but is **never** the authority for
  access control.

### 2.2 API Layer
- **Next.js Route Handlers** under `apps/web/src/app/api/**` provide REST-style
  endpoints (see [api.md](./api.md)).
- Server-side **authentication middleware** resolves the current user and roles
  on every protected request.
- Input validation with **Zod** at the boundary of each handler.

### 2.3 Business Logic Layer
- Service modules encapsulate domain operations (request lifecycle, fulfillment,
  asset movements, rate resolution).
- Business logic is **isolated from the framework** — services accept plain
  inputs and the resolved user, and depend on the data layer and abstraction
  interfaces, not on Next.js internals. This keeps logic testable and portable.

### 2.4 Data Layer
- **Prisma ORM** over **PostgreSQL**.
- Schema and **migrations are committed to source control** as the single source
  of truth ([ADR-003](./decisions/ADR-003-database-prisma.md)).
- A shared, singleton Prisma client is exported from `packages/database`.

### 2.5 File Storage
- Abstracted behind a **`StorageProvider`** interface
  (`apps/web/src/lib/storage`).
- Prototype uses the **local filesystem**; production can use an S3-compatible or
  Azure Blob backend selected by `FILE_UPLOAD_PROVIDER` — no code change to
  business logic.

### 2.6 Authentication
- **Session-based prototype auth** with an **OIDC-ready `AuthProvider`
  interface** (`apps/web/src/lib/auth`).
- No real CORE passwords are stored. Demo users use throwaway credentials.
- The interface is designed so an enterprise identity provider (OIDC / SAML /
  Entra ID) can replace the credentials provider without changing feature code
  ([ADR-004](./decisions/ADR-004-authentication-approach.md)).

---

## 3. Portability Principles

1. **Environment variables for all external configuration** — database, auth
   secret, file storage, app metadata. See `.env.example`.
2. **No Abacus-specific APIs in business logic** — nothing in `apps/web/src`
   imports a proprietary hosting SDK.
3. **Docker Compose for local dev** — `docker-compose.yml` provisions PostgreSQL;
   `docker-compose.dev.yml` can run the full stack in containers.
4. **Migration-based schema** — schema changes are versioned SQL migrations,
   reproducible on any PostgreSQL 15+ instance.
5. **Standalone build output** — the Next.js app builds to a standalone Node
   server that runs on any Node.js host or container platform.

---

## 4. Integration Points (Future / Configurable)

All integrations below are **future** and represented behind configuration or
interface stubs. None are implemented against a specific vendor yet, because the
authoritative systems are unknown (see [it-review.md](./it-review.md) and
[open-questions.md](./open-questions.md)).

| Integration | Purpose | Prototype behavior |
|-------------|---------|--------------------|
| Enterprise identity (OIDC / SAML / Entra ID) | Single sign-on, user identity | `AuthProvider` interface; prototype credentials provider |
| ERP / CMiC project data | Authoritative projects & job/phase codes | Manual seed data; `Project.erpJobNumber` field reserved |
| Accounting system | Cost posting, billing | Not implemented; fields reserved, no calculations |
| ERP cost codes | Phase/cost code validation | `ProjectPhaseCode` seeded manually |
| Telematics | Meter/GPS data | `MeterReading.source = TELEMATICS` reserved; manual entry for now |

---

## 5. Security Architecture

- **Server-side RBAC** enforced in the API layer (`apps/web/src/lib/rbac`).
- **Least privilege** — roles map to explicit permission codes; project-scoped
  access via `ProjectUserAccess`.
- **Input validation** at every API boundary (Zod).
- **Audit trail** — append-only `AuditEvent` records for important actions.
- See [security.md](./security.md) for the full model and prototype limitations.

---

## 6. File Handling

- Upload **size limit** via `FILE_UPLOAD_MAX_MB`.
- **Type allowlist** enforced server-side (documents, images, PDFs, drawings).
- Storage behind the `StorageProvider` interface.
- A **virus-scan interface stub** is defined as a future hook; the prototype does
  not perform real scanning and this limitation is documented in
  [security.md](./security.md).

---

## 7. Deployment Topology

### 7.1 Current (Abacus prototype)
- Next.js standalone server + PostgreSQL.
- Abacus provides compute/preview only; **no Abacus service is a hard dependency**.
- File storage on local/attached filesystem.

### 7.2 Future (customer-managed or cloud)
- Container image (see `apps/web/Dockerfile`) deployable to any orchestrator.
- Managed PostgreSQL (RDS / Azure Database / Cloud SQL / on-prem).
- Object storage (S3 / Azure Blob) via `StorageProvider`.
- Enterprise identity via OIDC/SAML.
- CORE IT decides the final hosting model (see [it-review.md](./it-review.md)).
