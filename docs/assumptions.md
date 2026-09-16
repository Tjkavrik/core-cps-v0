# Assumptions Register — CORE CPS V0.1

**Status:** Living document. Every item is a **temporary prototype assumption**
made so the prototype can function for discovery. None represents confirmed CORE
policy. Each assumption should be validated (Illinois visit, Accounting, IT,
Leadership) and then either confirmed, changed, or removed.

**How assumptions are handled in code:** where reasonable, assumptions are made
**configurable** (reference data / environment / config) rather than hard-coded,
so they can change without a code rewrite. Related unknowns are tracked in
[open-questions.md](./open-questions.md).

---

## Authentication & Identity
- **ASSUMPTION-001:** Session-based auth with a demo password hash is used for the
  prototype only. Production should use enterprise identity (OIDC/SAML).
- **ASSUMPTION-002:** User-to-project authorization is managed manually by System
  Admin in the prototype. Production source of truth is TBD.

## Equipment & Rates
- **ASSUMPTION-003:** Rate cards use a daily/weekly/28-day structure (inspired by
  Blue Hat research). Actual CPS rate methodology is to be established.
- **ASSUMPTION-004:** Sample rates are fictional placeholders. No rate represents
  an actual CORE rate.
- **ASSUMPTION-005:** Equipment class taxonomy is derived from general
  construction practice. Actual CPS classifications to be validated in Illinois.

## Workflow
- **ASSUMPTION-006:** Request approval is single-stage (CPS Coordinator review).
  The actual approval chain is unknown.
- **ASSUMPTION-007:** Billing start = delivery date. The actual billing trigger is
  unknown — needs Accounting/CPS input.
- **ASSUMPTION-008:** Billing stop = CPS receipt at return + inspection complete.
  The actual billing-stop event is unknown.
- **ASSUMPTION-009:** Transportation charges exist as fields but amounts are
  fictional. The actual charge structure is unknown.

## Roles
- **ASSUMPTION-010:** Six prototype roles (Project User, CPS Coordinator,
  Warehouse/Logistics, CPS Manager, Leadership, System Admin). Actual CORE roles
  to be defined.
- **ASSUMPTION-011:** A Project User can request any catalog item. Actual
  authorization rules are unknown.

## Data
- **ASSUMPTION-012:** All seed data is fictional. No real CORE projects,
  employees, assets, or financial data.
- **ASSUMPTION-013:** Asset numbering format `CPS-{TYPE}-{NNNN}` is provisional.
  The actual CPS numbering standard is unknown.

## External Rentals
- **ASSUMPTION-014:** CPS may fulfill requests via external rental. Actual CPS
  procurement authority is unknown.
- **ASSUMPTION-015:** External rental reason codes are provisional. Actual CPS
  practice is unknown.

## Financial
- **ASSUMPTION-016:** No cost calculations or financial reporting are implemented.
  Financial treatment of CPS assets, internal billing, and owner reimbursement are
  all unknown.
