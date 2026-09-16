# ADR-003: PostgreSQL with Prisma ORM

**Status:** Accepted
**Date:** September 2026

## Context
We need a normalized relational database with migrations and TypeScript type
safety, portable across environments.

## Decision
Use **PostgreSQL 15+** with **Prisma ORM**. Migrations are committed to source
control as the single source of truth for schema evolution.

## Consequences
- Standard SQL database, portable to managed or on-prem PostgreSQL.
- Prisma generates a fully typed client shared across the monorepo.
- Migration history is auditable and reproducible on any instance.
- Parameterized queries reduce SQL-injection risk by default.
