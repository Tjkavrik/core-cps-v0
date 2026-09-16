# ADR-002: Next.js with App Router for frontend and API

**Status:** Accepted
**Date:** September 2026

## Context
We need TypeScript, React, server-side rendering, and an API in one framework,
and the result must be portable to any Node.js host that CORE IT may choose.

## Decision
Use **Next.js 14+ (App Router)**. The API is implemented with **Route Handlers**.
The app is deployed as a standard **Node.js process** (standalone output).

## Consequences
- One well-known, widely supported stack for UI and API.
- Deployable on any Node.js host or container platform — no proprietary hosting
  dependency.
- Likely higher familiarity for CORE IT and future developers.
- Server Components/Route Handlers keep sensitive logic on the server.
