import { z } from "zod";
import { ok, fail, requireUser, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";
import { nextRequestNumber } from "@/lib/sequences";

const lineItemSchema = z.object({
  classId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
  unitNotes: z.string().nullable().optional(),
});

const createSchema = z.object({
  projectId: z.string().min(1),
  phaseCodeId: z.string().nullable().optional(),
  deliveryLocationId: z.string().nullable().optional(),
  neededDate: z.string().nullable().optional(),
  expectedReturnDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  isFreeForm: z.boolean().optional(),
  freeFormText: z.string().nullable().optional(),
  lineItems: z.array(lineItemSchema).optional(),
});

/** GET /api/requests — requests visible to the current user (their projects). */
export async function GET() {
  const user = await requireUser();
  if (isResponse(user)) return user;

  const isOps =
    user.roles.includes("SYSTEM_ADMIN") ||
    user.roles.some((r) => ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER"].includes(r));

  const requests = await prisma.request.findMany({
    where: isOps ? {} : { projectId: { in: user.projectIds } },
    orderBy: { createdAt: "desc" },
    include: { project: true, phaseCode: true, _count: { select: { lineItems: true } } },
  });
  return ok(requests);
}

/** POST /api/requests — create + submit a request (catalog or free-form). */
export async function POST(req: Request) {
  const user = await requireUser();
  if (isResponse(user)) return user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const data = parsed.data;

  // Authorization: project users may only create for their own projects.
  const isOps =
    user.roles.includes("SYSTEM_ADMIN") ||
    user.roles.some((r) => ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER"].includes(r));
  if (!isOps && !user.projectIds.includes(data.projectId)) {
    return fail("You do not have access to this project", 403);
  }

  if (data.isFreeForm) {
    if (!data.freeFormText || data.freeFormText.trim().length === 0) {
      return fail("Please describe what you need");
    }
  } else if (!data.lineItems || data.lineItems.length === 0) {
    return fail("Add at least one equipment item");
  }

  // Resolve equipment class names for line-item descriptions (description is required).
  const classNameById = new Map<string, string>();
  if (!data.isFreeForm && data.lineItems && data.lineItems.length > 0) {
    const classes = await prisma.equipmentClass.findMany({
      where: { id: { in: data.lineItems.map((li) => li.classId) } },
      select: { id: true, name: true },
    });
    for (const c of classes) classNameById.set(c.id, c.name);
  }

  const requestNumber = await nextRequestNumber();
  const now = new Date();

  const created = await prisma.request.create({
    data: {
      requestNumber,
      projectId: data.projectId,
      phaseCodeId: data.phaseCodeId || null,
      deliveryLocationId: data.deliveryLocationId || null,
      requestedBy: user.id,
      neededDate: data.neededDate ? new Date(data.neededDate) : null,
      expectedReturnDate: data.expectedReturnDate ? new Date(data.expectedReturnDate) : null,
      notes: data.notes || null,
      isFreeForm: !!data.isFreeForm,
      freeFormText: data.isFreeForm ? data.freeFormText : null,
      status: "SUBMITTED",
      submittedAt: now,
      lineItems:
        !data.isFreeForm && data.lineItems
          ? {
              create: data.lineItems.map((li) => ({
                classId: li.classId,
                description: classNameById.get(li.classId) ?? "Equipment item",
                quantity: li.quantity,
                unitNotes: li.unitNotes || null,
                status: "PENDING",
              })),
            }
          : undefined,
      statusHistory: {
        create: { status: "SUBMITTED", changedBy: user.id, notes: "Request submitted" },
      },
    },
  });

  await audit({
    userId: user.id,
    action: "REQUEST_SUBMITTED",
    entityType: "Request",
    entityId: created.id,
    projectId: created.projectId,
    requestId: created.id,
    newValue: { requestNumber, status: "SUBMITTED" },
  });

  return ok(created, 201);
}
