# ADR-006: Equipment class / individual asset separation and immutable history

**Status:** Accepted
**Date:** September 2026

## Context
CPS manages both a catalog of equipment *types* and a fleet of *individual*
serialized assets, and operational history must not be lost.

## Decision
- Separate **`EquipmentClass`** (the type, carrying catalog + rate identity) from
  **`Asset`** (the individual machine).
- Attach rates to classes via **`RateCardLine`**, not to individual assets.
- Record all status/assignment/movement changes as **new history records**.
- Version rate cards with **effective dates**; never delete historical rates.
- Keep **`AuditEvent`** append-only.

## Consequences
- Full, auditable history is always available per asset.
- Rate methodology can change without losing historical rates.
- Individual asset performance and utilization are traceable.
- Slightly more write volume (history rows), accepted for auditability.
