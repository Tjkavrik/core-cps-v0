# Security — CORE CPS V0.1

**Status:** Living document. Prototype security posture and the hardening
required before any production use.
**Audience:** CORE IT security, developers.

> **Prototype notice:** This is a discovery prototype. Several controls below are
> intentionally simplified and are called out as **prototype limitations** that
> must be addressed before production.

---

## 1. Authentication

- **Prototype:** session-based authentication with a credentials provider.
  Demo user passwords are throwaway values for local development only.
- **No real CORE passwords** are stored anywhere in this repository or database.
- **OIDC-ready interface:** all feature code depends on the `AuthProvider`
  interface (`apps/web/src/lib/auth`), so the credentials provider can be
  replaced by an enterprise identity provider (OIDC / SAML / Entra ID) without
  changing business logic (see [ADR-004](./decisions/ADR-004-authentication-approach.md)).
- **Prototype limitation:** no MFA, no password policy, no account lockout.
  Production must delegate authentication to CORE's identity provider.

## 2. Authorization

- **Server-side RBAC** is the source of truth (`apps/web/src/lib/rbac`). The
  client never decides access; it may only hide actions for UX.
- **Roles → permissions:** roles map to explicit permission codes; a user's
  effective permissions are the union across their roles.
- **Project-scoped access:** `ProjectUserAccess` limits which projects a user can
  act on.
- **Role definitions (prototype, provisional — ASSUMPTION-010):** Project User,
  CPS Coordinator, Warehouse/Logistics, CPS Manager, Leadership, System Admin.
- **Prototype limitation:** segregation-of-duties rules and approval thresholds
  are not enforced yet (open questions).

## 3. File Handling

- **Type allowlist** enforced server-side (documents, images, PDFs, drawings).
- **Size limit** via `FILE_UPLOAD_MAX_MB` (default 25 MB).
- **Storage abstraction:** files go through the `StorageProvider` interface;
  prototype uses the local filesystem with path-traversal protection.
- **Virus-scan interface stub:** a scan hook is defined as a future integration
  point. **Prototype limitation:** no real malware scanning is performed.

## 4. API Security

- **Server-side validation** of all inputs at the API boundary (Zod).
- **Authentication middleware** resolves the user for protected routes.
- **CORS:** default same-origin; cross-origin access is not enabled in the
  prototype.
- **Rate limiting:** not implemented in the prototype; noted as a production
  requirement (e.g. gateway or middleware-based).

## 5. Secrets Management

- Secrets are provided via **environment variables**; `.env` is **git-ignored**.
- `.env.example` contains **placeholders only** — never real secrets.
- `NEXTAUTH_SECRET` must be generated per environment
  (`openssl rand -hex 32`).
- **Never** commit credentials, tokens, or real connection strings.

## 6. Audit Logging

- **What is logged:** important state changes (request submission/status change,
  asset assignment/transfer/delivery/return, inspection, rate card changes,
  admin actions).
- **Format:** `AuditEvent` rows with actor, action, entity type/id, optional
  prior/new value JSON snapshots, and request metadata (IP, user agent).
- **Retention:** to be defined with CORE IT/Legal (open question).

## 7. Data Policy

- **Fictional seed data only.** No real CORE project, employee, asset, or
  financial data is present. The seed layer is isolated so it can be replaced by
  approved CORE sources (see [assumptions.md](./assumptions.md), ASSUMPTION-012).

## 8. Known Prototype Limitations & Production Hardening

| Area | Prototype | Production requirement |
|------|-----------|------------------------|
| Authentication | Credentials + session | Enterprise SSO (OIDC/SAML), MFA |
| Passwords | Demo hash | No local passwords; IdP-managed |
| Rate limiting | None | Gateway/middleware rate limits |
| Malware scanning | Stub only | Real AV scanning on upload |
| Secrets | `.env` | Managed secret store (Vault/Key Vault/SM) |
| Transport | Local HTTP | Enforced HTTPS/TLS |
| Backups/DR | None | Managed backups + tested restore |
| Pen testing | None | Security review + pen test before go-live |

## 9. Common Vulnerability Protections

- **SQL injection:** prevented by Prisma parameterized queries; no string-built
  SQL.
- **XSS:** React escapes output by default; avoid `dangerouslySetInnerHTML`;
  validate/encode any rendered user input.
- **CSRF:** authenticated state-changing requests use the session framework's
  CSRF protections; prefer same-site cookies. To be verified per final auth
  provider.
- **Path traversal:** local storage resolves and confines paths to the upload
  base directory.
- **Mass assignment / over-posting:** inputs are validated and whitelisted with
  Zod before hitting the data layer.
