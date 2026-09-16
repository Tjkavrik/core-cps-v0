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

/**
 * Route-prefix -> allowed role codes. Enforced by middleware for client
 * navigation AND checked server-side in API routes. SYSTEM_ADMIN can access
 * every experience for prototype demonstration.
 */
export const ROLE_ROUTES: Record<string, string[]> = {
  "/ops": ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER", "SYSTEM_ADMIN"],
  "/admin": ["SYSTEM_ADMIN"],
  "/viewer": ["READ_ONLY", "CPS_MANAGER", "SYSTEM_ADMIN"],
  "/home": ["PROJECT_USER", "SYSTEM_ADMIN"],
  "/catalog": ["PROJECT_USER", "SYSTEM_ADMIN"],
  "/request": ["PROJECT_USER", "SYSTEM_ADMIN"],
  "/requests": ["PROJECT_USER", "SYSTEM_ADMIN"],
  "/equipment": ["PROJECT_USER", "SYSTEM_ADMIN"],
};

/** Returns the allowed roles for a given pathname, or null if unprotected. */
export function allowedRolesForPath(pathname: string): string[] | null {
  const match = Object.keys(ROLE_ROUTES)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
  return match ? ROLE_ROUTES[match] : null;
}

/** True if any of the user's roles is allowed for the path. */
export function canAccessPath(roles: string[], pathname: string): boolean {
  const allowed = allowedRolesForPath(pathname);
  if (!allowed) return true;
  return roles.some((r) => allowed.includes(r));
}

/** Default landing route after login, based on the user's primary role. */
export function landingRouteForRoles(roles: string[]): string {
  if (roles.includes("PROJECT_USER")) return "/home";
  if (roles.includes("CPS_COORDINATOR") || roles.includes("CPS_WAREHOUSE") || roles.includes("CPS_MANAGER"))
    return "/ops/dashboard";
  if (roles.includes("READ_ONLY")) return "/viewer/dashboard";
  if (roles.includes("SYSTEM_ADMIN")) return "/admin/users";
  return "/home";
}
