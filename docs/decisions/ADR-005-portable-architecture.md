# ADR-005: Portable architecture — no proprietary hosting dependencies in business logic

**Status:** Accepted
**Date:** September 2026

## Context
The prototype runs on Abacus AI hosting, but it must be movable. CORE IT will
eventually decide the hosting model, and the application must not be locked in.

## Decision
- Abstract file storage behind a **`StorageProvider`** interface.
- Use **environment variables** for all external configuration.
- Provide **Docker Compose** for local dev and a **standalone container build**.
- Keep **no Abacus-specific APIs** in application/business code.

## Consequences
- The app can be deployed to any Node.js + PostgreSQL environment by setting
  `.env`.
- Storage/identity backends are swappable by configuration.
- Treating Abacus as prototype-only hosting is enforced by architecture, not just
  by convention.
