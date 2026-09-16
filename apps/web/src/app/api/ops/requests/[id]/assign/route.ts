import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";
import { FULFILLMENT_TYPES } from "@/lib/fulfillment";

const OPS_ROLES = ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER", "SYSTEM_ADMIN"];

const schema = z.object({
  lineItemId: z.string().min(1),
  assetId: z.string().min(1),
  fulfillmentType: z.enum(FULFILLMENT_TYPES).default("CPS_OWNED"),
  startDate: z.string().nullable().optional(),
  expectedEndDate: z.string().nullable().optional(),
});

/** POST /api/ops/requests/[id]/assign — assign a CPS asset to a request line item. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const { lineItemId, assetId, fulfillmentType, startDate, expectedEndDate } = parsed.data;

  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) return fail("Request not found", 404);

  const lineItem = await prisma.requestLineItem.findUnique({ where: { id: lineItemId } });
  if (!lineItem || lineItem.requestId !== id) return fail("Line item not found", 404);

  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) return fail("Asset not found", 404);
  if (asset.status !== "AVAILABLE") return fail(`Asset ${asset.assetNumber} is not available`);

  const result = await prisma.$transaction(async (tx) => {
    const assignment = await tx.assetAssignment.create({
      data: {
        assetId,
        requestId: id,
        projectId: request.projectId,
        lineItemId,
        assignedBy: user.id,
        startDate: startDate ? new Date(startDate) : new Date(),
        expectedEndDate: expectedEndDate ? new Date(expectedEndDate) : request.expectedReturnDate,
        status: "ACTIVE",
      },
    });

    await tx.asset.update({
      where: { id: assetId },
      data: { status: "ASSIGNED", currentProjectId: request.projectId },
    });
    await tx.assetStatusHistory.create({
      data: {
        assetId,
        status: "ASSIGNED",
        reason: "Assigned to request",
        changedBy: user.id,
        projectId: request.projectId,
      },
    });

    await tx.requestLineItem.update({
      where: { id: lineItemId },
      data: { fulfillmentType, status: "FULFILLED" },
    });

    // Advance request to fulfilling if still in an earlier state.
    if (["SUBMITTED", "UNDER_REVIEW", "APPROVED"].includes(request.status)) {
      await tx.request.update({
        where: { id },
        data: {
          status: "FULFILLING",
          statusHistory: { create: { status: "FULFILLING", changedBy: user.id, notes: "Assignment created" } },
        },
      });
    }

    return assignment;
  });

  await audit({
    userId: user.id,
    action: "ASSET_ASSIGNED",
    entityType: "AssetAssignment",
    entityId: result.id,
    projectId: request.projectId,
    assetId,
    requestId: id,
    newValue: { fulfillmentType, lineItemId },
  });

  return ok(result, 201);
}
