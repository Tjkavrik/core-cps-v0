/**
 * Authentication abstraction — OIDC-ready boundary.
 *
 * The prototype authenticates with a simple session/credentials flow. The rest
 * of the application depends ONLY on the AuthProvider interface and the
 * AuthenticatedUser shape below, so the provider can later be replaced with an
 * enterprise identity provider (OIDC / SAML / Entra ID) WITHOUT changing
 * business logic. See ADR-004 and docs/security.md.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: string[];       // role codes, e.g. ["CPS_COORDINATOR"]
  permissions: string[]; // resolved permission codes
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthProvider {
  /** Prototype credential login. Future OIDC providers implement the same shape. */
  authenticate(credentials: Credentials): Promise<AuthenticatedUser | null>;
  /** Resolve the current user from a request/session token. */
  getCurrentUser(sessionToken: string | undefined): Promise<AuthenticatedUser | null>;
}

/**
 * NOTE: The concrete prototype provider (credentials + session) will be wired
 * with NextAuth in a later commit. This interface is committed first so all
 * feature code can depend on the abstraction from day one.
 */
