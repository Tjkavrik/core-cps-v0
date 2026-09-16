/**
 * Server-side RBAC helpers.
 *
 * Authorization is ALWAYS enforced on the server (see docs/security.md).
 * Client UI may hide actions for UX, but the server is the source of truth.
 *
 * Role and permission codes are prototype placeholders (ASSUMPTION-010) and
 * are treated as configurable reference data, not hard-coded business rules.
 */
import type { AuthenticatedUser } from "../auth";

export function hasRole(user: AuthenticatedUser | null, roleCode: string): boolean {
  return !!user?.roles.includes(roleCode);
}

export function hasPermission(user: AuthenticatedUser | null, permissionCode: string): boolean {
  return !!user?.permissions.includes(permissionCode);
}

export function requirePermission(user: AuthenticatedUser | null, permissionCode: string): void {
  if (!hasPermission(user, permissionCode)) {
    throw new AuthorizationError(`Missing required permission: ${permissionCode}`);
  }
}

export class AuthorizationError extends Error {
  readonly status = 403;
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
