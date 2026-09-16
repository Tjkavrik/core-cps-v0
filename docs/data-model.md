# Data Model — CORE CPS V0.1

**Status:** Living document. The authoritative schema is
`packages/database/prisma/schema.prisma`; this document explains it.
**Audience:** Developers, CORE IT, data stakeholders.

---

## 1. Design Principles

1. **Normalized relational model.** PostgreSQL with foreign keys; reference data
   (categories, roles, permissions, locations, vendors) is separate from
   transactional data (requests, assignments, deliveries).
2. **Equipment class ≠ individual asset.** `EquipmentClass` is the *type* of
   machine shown in the catalog and priced on rate cards. `Asset` is an
   *individual serialized machine*. Many assets belong to one class.
3. **Rate cards attach to classes, not assets.** Pricing is a property of the
   class via `RateCardLine`, so individual assets do not carry prices.
4. **Immutable history.** Status changes, assignments, transfers, returns,
   inspections, meter readings, and audit events are recorded as **new rows**.
   History is never overwritten.
5. **Unverified rules are configuration, not constants.** Rate periods,
   fulfillment types, reason codes, numbering formats, and role permissions are
   data/config and flagged in [assumptions.md](./assumptions.md).

---

## 2. Entity Descriptions

### Identity & Access
- **User** — a person who can sign in. `passwordHash` is nullable (null for
  future OIDC users). Prototype demo users only; no real CORE identities.
- **Role** — named role with a stable `code` (e.g. `CPS_COORDINATOR`).
- **UserRole** — many-to-many join of users to roles.
- **Permission** — a discrete capability (`resource` + `action`, e.g.
  `REQUEST` + `APPROVE`).
- **RolePermission** — many-to-many join of roles to permissions.

### Projects
- **Project** — a CORE construction project. `code` format is provisional;
  `erpJobNumber` is reserved for future ERP linkage.
- **ProjectUserAccess** — which users may act on which projects (project-scoped
  authorization). `revokedAt` supports soft revocation.
- **ProjectLocation** — named delivery/drop points within a project (e.g. "Main
  Gate", "Crane Pad").
- **ProjectPhaseCode** — phase/cost codes available on a project; unique per
  project. Source of truth for real codes is an open question.

### Equipment Catalog
- **EquipmentCategory** — hierarchical catalog categories (self-referencing
  `parentId`).
- **EquipmentClass** — the equipment *type* (catalog + rate level), with flexible
  `specifications` JSON.
- **EquipmentClassRelation** — relationships between classes (`ACCESSORY`,
  `COMMONLY_USED_WITH`, `REQUIRES`).

### Individual Assets
- **Asset** — an individual serialized machine belonging to a class. Tracks
  `status`, current location, and current project. `assetNumber` format is
  provisional.
- **AssetStatusHistory** — append-only record of every status change with reason,
  actor, location, and project context.

### Locations & Vendors
- **Location** — warehouses, yards, project sites, or external locations.
- **Vendor** — external rental suppliers (for EXTERNAL fulfillment).

### Rate Cards
- **RateCard** — an effective-dated set of rates. Marked FICTIONAL in seed data.
- **RateCardLine** — per-class rates: daily/weekly/28-day, included hours,
  overtime, delivery/pickup charges. Unique per (rate card, class).

### Requests
- **Request** — a requisition against a project. Supports catalog line items and
  free-form text (`isFreeForm`/`freeFormText`). Carries status, needed/return
  dates, delivery location, and assignment to a CPS coordinator.
- **RequestLineItem** — a requested class (or free-form line), quantity, and a
  per-line `fulfillmentType`.
- **RequestStatusHistory** — append-only status transitions.

### Fulfillment & Asset Movement
- **AssetAssignment** — an asset assigned to a request/project for a period.
- **AssetTransfer** — movement of an asset between locations/projects.
- **Delivery** — scheduled/actual delivery of an asset to a project location.
- **Return** — the return lifecycle (requested → scheduled → received →
  inspecting → complete).
- **Inspection** — condition assessment (return, periodic, pre-delivery,
  post-maintenance) with optional meter reading and pass/fail.
- **MeterReading** — hours/miles reading with a `source` (manual, telematics,
  inspection).
- **DamageRecord** — damage found, severity, repair status.
- **MaintenanceRecord** — preventive/corrective maintenance with labor/parts.

### External Rentals
- **ExternalRental** — demand fulfilled via an outside vendor. Included to
  support demand tracking and discovery; CPS procurement authority is
  unconfirmed. Reason codes are provisional.

### Saved Lists
- **SavedList / SavedListItem** — reusable sets of classes (e.g. "Project
  Startup"), optionally shared.

### Documents
- **Document** — an uploaded file linked polymorphically to a request, asset,
  delivery, inspection, external rental, damage record, or maintenance record.
  `storagePath` is relative; the actual location depends on the `StorageProvider`.

### Notes & Audit
- **Note** — free-text comments; `isInternal` hides CPS-only notes from project
  users.
- **AuditEvent** — append-only audit trail with actor, action, entity, and
  optional prior/new value snapshots. Indexed for query.

---

## 3. Key Relationships (described)

- A **User** has many **Roles** (via UserRole); each **Role** has many
  **Permissions** (via RolePermission). Effective permissions = union across the
  user's roles.
- A **User** is granted access to many **Projects** (via ProjectUserAccess), and a
  **Project** has many authorized users.
- An **EquipmentCategory** contains many **EquipmentClasses**; an
  **EquipmentClass** has many **Assets**. Rates live on **RateCardLine**, which
  links a **RateCard** to an **EquipmentClass**.
- A **Request** belongs to a **Project**, is created by a **User**, may be
  assigned to a CPS **User**, and has many **RequestLineItems**. Each line item
  may reference an **EquipmentClass** (or be free-form).
- Fulfilling a request produces **AssetAssignments**, **Deliveries**, and/or
  **ExternalRentals**. An **Asset** accumulates **AssetStatusHistory**,
  **Transfers**, **Deliveries**, **Returns**, **Inspections**, **MeterReadings**,
  **DamageRecords**, and **MaintenanceRecords** over its life.
- A **Return** has at most one **Inspection**; an **Inspection** may produce
  **DamageRecords**.
- **Documents** attach to many entity types; **AuditEvents** reference the actor
  and, where relevant, the asset/request/project.

---

## 4. Fulfillment Model

Four fulfillment types are supported **conceptually** on `RequestLineItem` and
`AssetAssignment`. Actual CPS organizational responsibility for each is
**unconfirmed** (see [open-questions.md](./open-questions.md)).

| Type | Meaning |
|------|---------|
| `CPS_OWNED` | Fulfilled from CPS-owned fleet at a warehouse/yard. |
| `CPS_TRANSFER` | Fulfilled by transferring an asset from another project/location. |
| `EXTERNAL` | Fulfilled by renting from an outside vendor (`ExternalRental`). |
| `OTHER_DIRECT` | Handled directly outside CPS (e.g. project procures directly). |

The rules CPS uses to *choose* among these (allocation precedence) are an open
question and are not hard-coded.

---

## 5. Asset History Model

Asset history is **preserved, never overwritten**:

- The current snapshot lives on `Asset` (status, current location/project).
- Every change appends an `AssetStatusHistory` row (status, reason, actor,
  timestamp, location, project).
- Movements and events (`AssetTransfer`, `Delivery`, `Return`, `Inspection`,
  `MeterReading`, `DamageRecord`, `MaintenanceRecord`) are independent, additive
  records.
- This gives a complete, auditable timeline for each individual machine.

---

## 6. Rate Card Versioning

- `RateCard.effectiveDate` (and optional `expirationDate`) define validity.
- New pricing is a **new rate card / new lines**, not an edit of historical
  rates — historical rates are never deleted, so past decisions remain
  explainable.
- Which rate card applies to a given transaction (by date/customer/project) is a
  resolution rule to be validated with CPS/Accounting.

---

## 7. Audit Design

- `AuditEvent` is **append-only**.
- Triggered by important state changes: request submission/status change, asset
  assignment/transfer/delivery/return, inspection, rate card changes, and
  administrative actions.
- Captures actor (`userId`), `action`, `entityType`/`entityId`, optional
  `projectId`/`assetId`/`requestId`, optional `priorValue`/`newValue` JSON
  snapshots, and request metadata (`ipAddress`, `userAgent`).
- Indexed by entity, user, asset, request, and time for efficient review.
- Retention policy is an open question for CORE IT/Legal.
