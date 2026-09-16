# ADR-004: Prototype session auth with an OIDC-ready interface

**Status:** Accepted
**Date:** September 2026

## Context
The prototype needs authentication, but we cannot assume CORE's production
identity provider yet, and we must not store real CORE passwords.

## Decision
Use **NextAuth.js with a Credentials provider** for the prototype. Design an
`AuthProvider` interface (and `AuthenticatedUser` shape) so the credentials
provider can be replaced by **OIDC/SAML** (e.g. Entra ID) without changing
business logic.

## Consequences
- No real CORE passwords are stored; demo users use throwaway credentials.
- Feature code depends on the auth abstraction, not on a specific provider.
- Future CORE IT can swap in an approved identity provider with minimal changes.
- Prototype limitations (no MFA/password policy) are documented in security.md.
