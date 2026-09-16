import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const OPS_ROLES = ["CPS_COORDINATOR", "CPS_WAREHOUSE", "CPS_MANAGER", "SYSTEM_ADMIN"];

/**
 * POST /api/ops/assets/[id]/[action]
 * Supported actions: meter, maintain, damage, transfer, inspect, receive-return, status
 * Each action records an audit event and, where relevant, immutable history.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  const user = await requireRole(OPS_ROLES);
  if (isResponse(user)) return user;
  const { id, action } = await params;

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return fail("Asset not found", 404);

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  switch (action) {
    case "meter": {
      const s = z.object({ reading: z.number().nonnegative(), unit: z.string().default("HOURS") }).safeParse(body);
      if (!s.success) return fail("A meter reading is required");
      const rec = await prisma.meterReading.create({
        data: { assetId: id, reading: s.data.reading, unit: s.data.unit, recordedBy: user.id, source: "MANUAL" },
      });
      await audit({ userId: user.id, action: "METER_READING_RECORDED", entityType: "MeterReading", entityId: rec.id, assetId: id, newValue: { reading: s.data.reading, unit: s.data.unit } });
      return ok(rec, 201);
    }

    case "maintain": {
      const s = z
        .object({
          type: z.string().default("CORRECTIVE"),
          description: z.string().min(1),
          priority: z.string().nullable().optional(),
          scheduledDate: z.string().nullable().optional(),
        })
        .safeParse(body);
      if (!s.success) return fail("A description is required");
      const rec = await prisma.$transaction(async (tx) => {
        const m = await tx.maintenanceRecord.create({
          data: {
            assetId: id,
            type: s.data.type,
            description: s.data.description,
            priority: s.data.priority || null,
            scheduledDate: s.data.scheduledDate ? new Date(s.data.scheduledDate) : null,
            status: "OPEN",
          },
        });
        await tx.asset.update({ where: { id }, data: { status: "MAINTENANCE" } });
        await tx.assetStatusHistory.create({
          data: { assetId: id, status: "MAINTENANCE", reason: "Maintenance opened", changedBy: user.id },
        });
        return m;
      });
      await audit({ userId: user.id, action: "MAINTENANCE_CREATED", entityType: "MaintenanceRecord", entityId: rec.id, assetId: id, newValue: { type: s.data.type } });
      return ok(rec, 201);
    }

    case "damage": {
      const s = z
        .object({ description: z.string().min(1), severity: z.string().nullable().optional() })
        .safeParse(body);
      if (!s.success) return fail("A description is required");
      const rec = await prisma.damageRecord.create({
        data: {
          assetId: id,
          description: s.data.description,
          severity: s.data.severity || null,
          discoveredBy: user.id,
          projectId: asset.currentProjectId,
          repairStatus: "PENDING",
        },
      });
      await audit({ userId: user.id, action: "DAMAGE_RECORDED", entityType: "DamageRecord", entityId: rec.id, assetId: id, newValue: { severity: s.data.severity } });
      return ok(rec, 201);
    }

    case "transfer": {
      const s = z
        .object({
          toLocationId: z.string().nullable().optional(),
          toProjectId: z.string().nullable().optional(),
          scheduledDate: z.string().nullable().optional(),
          notes: z.string().nullable().optional(),
        })
        .safeParse(body);
      if (!s.success) return fail("Invalid transfer");
      const rec = await prisma.$transaction(async (tx) => {
        const t = await tx.assetTransfer.create({
          data: {
            assetId: id,
            fromLocationId: asset.currentLocationId,
            toLocationId: s.data.toLocationId || null,
            fromProjectId: asset.currentProjectId,
            toProjectId: s.data.toProjectId || null,
            initiatedBy: user.id,
            scheduledDate: s.data.scheduledDate ? new Date(s.data.scheduledDate) : null,
            status: "IN_TRANSIT",
            notes: s.data.notes || null,
          },
        });
        await tx.asset.update({ where: { id }, data: { status: "IN_TRANSFER" } });
        await tx.assetStatusHistory.create({
          data: { assetId: id, status: "IN_TRANSFER", reason: "Transfer initiated", changedBy: user.id },
        });
        return t;
      });
      await audit({ userId: user.id, action: "ASSET_TRANSFERRED", entityType: "AssetTransfer", entityId: rec.id, assetId: id, newValue: { toProjectId: s.data.toProjectId, toLocationId: s.data.toLocationId } });
      return ok(rec, 201);
    }

    case "inspect": {
      const s = z
        .object({
          type: z.string().default("PERIODIC"),
          condition: z.string().nullable().optional(),
          passed: z.boolean().nullable().optional(),
          meterReading: z.number().nullable().optional(),
          notes: z.string().nullable().optional(),
        })
        .safeParse(body);
      if (!s.success) return fail("Invalid inspection");
      const rec = await prisma.inspection.create({
        data: {
          assetId: id,
          type: s.data.type,
          condition: s.data.condition || null,
          passed: s.data.passed ?? null,
          meterReading: s.data.meterReading ?? null,
          inspectedBy: user.id,
          notes: s.data.notes || null,
        },
      });
      await audit({ userId: user.id, action: "INSPECTION_COMPLETED", entityType: "Inspection", entityId: rec.id, assetId: id, newValue: { condition: s.data.condition, passed: s.data.passed } });
      return ok(rec, 201);
    }

    case "receive-return": {
      const s = z
        .object({
          returnId: z.string().min(1),
          condition: z.string().default("GOOD"),
          passed: z.boolean().default(true),
          meterReading: z.number().nullable().optional(),
          notes: z.string().nullable().optional(),
        })
        .safeParse(body);
      if (!s.success) return fail("A return and inspection result are required");
      const ret = await prisma.return.findUnique({ where: { id: s.data.returnId } });
      if (!ret || ret.assetId !== id) return fail("Return not found", 404);

      const result = await prisma.$transaction(async (tx) => {
        const inspection = await tx.inspection.create({
          data: {
            assetId: id,
            returnId: ret.id,
            type: "RETURN",
            condition: s.data.condition,
            passed: s.data.passed,
            meterReading: s.data.meterReading ?? null,
            inspectedBy: user.id,
            notes: s.data.notes || null,
          },
        });
        await tx.return.update({ where: { id: ret.id }, data: { status: "COMPLETE", actualDate: new Date(), pickedUpBy: user.id } });
        const newStatus = s.data.passed ? "AVAILABLE" : "MAINTENANCE";
        await tx.asset.update({ where: { id }, data: { status: newStatus, currentProjectId: null } });
        await tx.assetStatusHistory.create({
          data: { assetId: id, status: newStatus, reason: "Returned and inspected", changedBy: user.id },
        });
        await tx.assetAssignment.updateMany({
          where: { assetId: id, status: "ACTIVE" },
          data: { status: "RETURNED", actualEndDate: new Date() },
        });
        return inspection;
      });
      await audit({ userId: user.id, action: "RETURN_RECEIVED", entityType: "Return", entityId: ret.id, assetId: id, requestId: ret.requestId, newValue: { condition: s.data.condition, passed: s.data.passed } });
      await audit({ userId: user.id, action: "INSPECTION_COMPLETED", entityType: "Inspection", entityId: result.id, assetId: id, newValue: { condition: s.data.condition } });
      return ok(result, 201);
    }

    default:
      return fail(`Unknown action: ${action}`, 404);
  }
}
