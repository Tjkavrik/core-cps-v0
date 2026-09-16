# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Initial repository setup
- Project structure: monorepo with apps/web and packages/database
- Complete Prisma schema (all entities from data model)
- Documentation suite: architecture, data model, security, API, assumptions, open questions, Illinois discovery, IT review, local development
- Blue Hat / JE Dunn public research evidence matrix
- Architecture Decision Records (ADR-001 through ADR-006)
- Docker Compose for local PostgreSQL
- .env.example with all required variables
- Makefile for common development commands
- CHANGELOG

### Added — V0.1 Prototype Application (Phase 4)
- **Authentication & RBAC**: NextAuth Credentials provider (JWT sessions), server-side auth guard on every API route and route-group layout, role-based landing routes, path-level access control.
- **Shared foundation**: display/format helpers, project scoping (`projectsForUser`/`resolveActiveProject`), request/PO sequence generators, `StorageProvider` abstraction (local filesystem, no Abacus dependency).
- **UI system**: CPS-branded component library (Button, Card, Table, Modal, Input/Select/Textarea/Label, StatusBadge/Badge, PageHeader, EmptyState, LoadingSpinner), responsive AppShell (sidebar + mobile drawer), non-dismissible DEMO banner, sample-rate warnings, demo-project badge.
- **Project User experience**: home dashboard, equipment catalog (category → class → item, no asset serials), catalog & free-form requests, request list/detail with project-facing status timeline, active equipment (class shown, not asset number) with pickup/return requests.
- **CPS Operations experience**: dashboard with live queues, request review & fulfillment (asset assignment, external rentals), asset register & lifecycle actions (meter, inspect, maintain, damage, transfer, receive return), assignments, transfers, returns, inspections, external rentals, maintenance, and reports.
- **Admin experience**: user management (create, roles, project access, activate/deactivate), project management, and read-only equipment, assets, vendors, rate cards (28-Day cycle labeling), and roles/permissions views.
- **Leadership (read-only) dashboard** with fleet and utilization summaries.
- **API routes**: requests (create/submit, scoped list), project returns, ops request review/assign, external rentals, asset lifecycle actions, admin users/projects, and document uploads — all with authorization and immutable audit events.
- Verified: `npm run build` passes with zero TypeScript errors; seed data loads; authenticated smoke tests confirm RBAC enforcement and that project users never see fulfillment types or asset numbers.

### Guardrails enforced
- All data is fictional and clearly labeled; no real CORE data.
- No hard-coded business rules; fulfillment types and asset numbers are CPS-internal only.
- "28-Day" terminology used instead of "Monthly"; sample-rate warnings shown wherever rates appear.
