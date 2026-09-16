import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const OPS_ROLES = ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER", "SYSTEM_ADMIN"];

const REQUEST_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "FULFILLING",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "CANCELLED",
  "ON_HOLD",
] as const;

const patchSchema = z.object({
  status: z.enum(REQUEST_STATUSES).optional(),
  assignedTo: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;
  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      project: true,
      phaseCode: true,
      deliveryLocation: true,
      createdByUser: true,
      assignedToUser: true,
      lineItems: { include: { class: { include: { category: true } } } },
      statusHistory: { orderBy: { changedAt: "asc" } },
      assignments: { include: { asset: { include: { class: true } } } },
      externalRentals: { include: { vendor: true } },
    },
  });
  if (!request) return fail("Request not found", 404);
  return ok(request);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const { status, assignedTo, note } = parsed.data;

  const existing = await prisma.request.findUnique({ where: { id } });
  if (!existing) return fail("Request not found", 404);

  const updated = await prisma.request.update({
    where: { id },
    data: {
      status: status ?? undefined,
      assignedTo: assignedTo === undefined ? undefined : assignedTo,
      ...(status && status !== existing.status
        ? { statusHistory: { create: { status, changedBy: user.id, notes: note || null } } }
        : {}),
    },
  });

  if (status && status !== existing.status) {
    await audit({
      userId: user.id,
      action: "REQUEST_STATUS_CHANGED",
      entityType: "Request",
      entityId: id,
      projectId: existing.projectId,
      requestId: id,
      priorValue: { status: existing.status },
      newValue: { status },
    });
  }
  if (assignedTo !== undefined && assignedTo !== existing.assignedTo) {
    await audit({
      userId: user.id,
      action: "REQUEST_ASSIGNED",
      entityType: "Request",
      entityId: id,
      projectId: existing.projectId,
      requestId: id,
      priorValue: { assignedTo: existing.assignedTo },
      newValue: { assignedTo },
    });
  }

  return ok(updated);
}
