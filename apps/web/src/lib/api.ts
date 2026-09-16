/**
 * API route helpers — consistent JSON envelope, auth/role guards, and audit.
 *
 * Every API route uses these so responses are uniform:
 *   success: { data: <payload>, error: null }
 *   failure: { data: null, error: "message" }
 *
 * Authorization is ALWAYS enforced server-side here (see docs/security.md).
 */
import { NextResponse } from "next/server";
import { getCurrentUser, type SessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

/** Require an authenticated session. Returns the user or a 401 response. */
export async function requireUser(): Promise<SessionUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);
  return user;
}

/** Require the user to hold at least one of the given roles. */
export async function requireRole(roles: string[]): Promise<SessionUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);
  if (!user.roles.some((r) => roles.includes(r))) return fail("Forbidden", 403);
  return user;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}

/** Record an audit event. Best-effort — never throws into the request path. */
export async function audit(opts: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  projectId?: string | null;
  assetId?: string | null;
  requestId?: string | null;
  priorValue?: unknown;
  newValue?: unknown;
  metadata?: unknown;
}) {
  try {
    await prisma.auditEvent.create({
      data: {
        userId: opts.userId ?? null,
        action: opts.action,
        entityType: opts.entityType,
        entityId: opts.entityId,
        projectId: opts.projectId ?? null,
        assetId: opts.assetId ?? null,
        requestId: opts.requestId ?? null,
        priorValue: opts.priorValue === undefined ? undefined : (opts.priorValue as object),
        newValue: opts.newValue === undefined ? undefined : (opts.newValue as object),
        metadata: opts.metadata === undefined ? undefined : (opts.metadata as object),
      },
    });
  } catch (e) {
    console.error("audit event failed", e);
  }
}
