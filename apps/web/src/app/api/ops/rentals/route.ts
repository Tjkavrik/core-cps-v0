import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";
import { nextPoNumber } from "@/lib/sequences";

const OPS_ROLES = ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER", "SYSTEM_ADMIN"];

const schema = z.object({
  projectId: z.string().min(1),
  vendorId: z.string().min(1),
  requestId: z.string().nullable().optional(),
  description: z.string().min(1),
  reasonCode: z.string().nullable().optional(),
  dailyRate: z.number().nonnegative().nullable().optional(),
  estimatedCost: z.number().nonnegative().nullable().optional(),
  startDate: z.string().nullable().optional(),
  expectedEndDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET() {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;
  const rentals = await prisma.externalRental.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendor: true, project: true, request: true },
  });
  return ok(rentals);
}

/** POST /api/ops/rentals — create an external rental (EXTERNAL fulfillment). */
export async function POST(req: Request) {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const d = parsed.data;

  const poNumber = await nextPoNumber();
  const created = await prisma.externalRental.create({
    data: {
      projectId: d.projectId,
      vendorId: d.vendorId,
      requestId: d.requestId || null,
      description: d.description,
      reasonCode: d.reasonCode || null,
      dailyRate: d.dailyRate ?? null,
      estimatedCost: d.estimatedCost ?? null,
      startDate: d.startDate ? new Date(d.startDate) : null,
      expectedEndDate: d.expectedEndDate ? new Date(d.expectedEndDate) : null,
      notes: d.notes || null,
      poNumber,
    },
  });

  await audit({
    userId: user.id,
    action: "EXTERNAL_RENTAL_CREATED",
    entityType: "ExternalRental",
    entityId: created.id,
    projectId: d.projectId,
    requestId: d.requestId || null,
    newValue: { poNumber, vendorId: d.vendorId },
  });

  return ok(created, 201);
}
