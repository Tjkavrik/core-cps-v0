# API — CORE CPS V0.1 (Planned Structure)

**Status:** Living document. Defines the planned REST-style API implemented as
Next.js Route Handlers under `apps/web/src/app/api/**`. Endpoints are added
incrementally; this document is the contract reference.
**Conventions:** JSON request/response; server-side auth + RBAC on every
protected route; input validated with Zod; errors return `{ error, details? }`
with appropriate HTTP status.

---

## Authentication & Authorization

- All endpoints except `GET /api/health` require an authenticated session.
- Authorization is enforced server-side by permission code (see
  [security.md](./security.md)).
- Project-scoped endpoints additionally check `ProjectUserAccess`.

---

## Project User APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/catalog` | Browse/search catalog (query, filters, pagination) |
| GET | `/api/catalog/categories` | Category tree |
| GET | `/api/catalog/items/:id` | Equipment class (item) detail |
| GET | `/api/projects` | Authorized projects for the current user |
| POST | `/api/requests` | Submit a request (catalog or free-form) |
| GET | `/api/requests` | Current user's requests |
| GET | `/api/requests/:id` | Request detail |
| POST | `/api/requests/:id/return` | Request a return |
| GET | `/api/assignments` | Active equipment on the user's projects |
| POST | `/api/uploads` | Upload a document |

## CPS Operations APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/ops/requests` | All requests (with filters) |
| GET | `/api/ops/requests/:id` | Request detail with full history |
| PUT | `/api/ops/requests/:id/review` | Add internal notes, change status |
| POST | `/api/ops/requests/:id/fulfill` | Fulfillment decision |
| GET | `/api/ops/assets` | Asset list |
| GET | `/api/ops/assets/:id` | Asset detail + full history |
| POST | `/api/ops/assets/:id/assign` | Assign to a request |
| POST | `/api/ops/assets/:id/transfer` | Record a transfer |
| POST | `/api/ops/assets/:id/deliver` | Record a delivery |
| POST | `/api/ops/assets/:id/return` | Process a return |
| POST | `/api/ops/assets/:id/inspect` | Record an inspection |
| POST | `/api/ops/assets/:id/meter` | Record a meter reading |
| POST | `/api/ops/assets/:id/maintain` | Create a maintenance record |
| GET | `/api/ops/rentals` | External rentals |
| POST | `/api/ops/rentals` | Create an external rental record |

## Admin APIs

CRUD endpoints (under `/api/admin/**`) for reference and configuration data:

- Projects, Users, Roles
- Equipment Categories, Equipment Classes, Assets
- Locations, Vendors
- Rate Cards (and lines)
- Fulfillment types / reason codes (configurable reference data)

Each admin resource follows: `GET` (list), `POST` (create), `GET /:id` (read),
`PUT /:id` (update), `DELETE /:id` (soft-delete/deactivate where applicable).

---

## Future Integration Points (documented stubs)

These are **not implemented** yet; the authoritative systems are unknown (see
[it-review.md](./it-review.md)). They are listed so the API surface anticipates
them behind configuration/interfaces:

| Stub | Purpose |
|------|---------|
| Project / cost code sync from ERP | Populate `Project` and `ProjectPhaseCode` from CMiC/Procore/other |
| User–project authorization from identity/ERP | Populate `ProjectUserAccess` from authoritative source |
| Cost posting to accounting | Post charges/usage to the accounting system |
| Meter data from telematics | Ingest `MeterReading` with `source = TELEMATICS` |

---

## Health

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Liveness check (no auth, no proprietary deps) |
