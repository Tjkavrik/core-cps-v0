import { z } from "zod";
import { ok, fail, requireUser, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const schema = z.object({
  assignmentId: z.string().min(1),
  scheduledDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

/** POST /api/project/returns — a project user requests pickup of on-site equipment. */
export async function POST(req: Request) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const { assignmentId, scheduledDate, notes } = parsed.data;

  const assignment = await prisma.assetAssignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) return fail("Assignment not found", 404);

  const isOps =
    user.roles.includes("SYSTEM_ADMIN") ||
    user.roles.some((r) => ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER"].includes(r));
  if (!isOps && !user.projectIds.includes(assignment.projectId)) {
    return fail("You do not have access to this project", 403);
  }

  const existing = await prisma.return.findFirst({
    where: {
      assetId: assignment.assetId,
      status: { in: ["REQUESTED", "SCHEDULED", "IN_TRANSIT", "RECEIVED", "INSPECTING"] },
    },
  });
  if (existing) return fail("A pickup has already been requested for this equipment");

  const created = await prisma.return.create({
    data: {
      assetId: assignment.assetId,
      requestId: assignment.requestId,
      requestedBy: user.id,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      notes: notes || null,
      status: "REQUESTED",
    },
  });

  await audit({
    userId: user.id,
    action: "RETURN_REQUESTED",
    entityType: "Return",
    entityId: created.id,
    projectId: assignment.projectId,
    assetId: assignment.assetId,
    requestId: assignment.requestId,
    newValue: { status: "REQUESTED" },
  });

  return ok(created, 201);
}
