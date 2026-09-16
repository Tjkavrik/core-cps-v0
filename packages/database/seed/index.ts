/**
 * ============================================================================
 * CORE CPS V0.1 — Database Seed (FICTIONAL SAMPLE DATA ONLY)
 * ============================================================================
 * This script loads FICTIONAL demonstration data. It contains NO real CORE
 * project, employee, asset, or financial data. The seed layer is intentionally
 * kept separate from application logic (see docs/architecture.md and
 * docs/assumptions.md, ASSUMPTION-012) so approved CORE data sources can
 * replace it wholesale without touching business code.
 *
 * Run with:  npm run seed   (from packages/database)  or  make seed  (from root)
 *
 * The script is idempotent: it upserts by natural/unique keys so it can be
 * re-run safely during development.
 * ============================================================================
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { roles, permissions, rolePermissions, users, DEMO_PASSWORD } from "./data/users";
import { categories, equipmentClasses, classRelations, assets, locations } from "./data/equipment";
import { projects, vendors } from "./data/projects";
import { rateCard, rateCardLines } from "./data/ratecards";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding FICTIONAL prototype data (no real CORE data)...");

  // Demo password hash (bcrypt). Prototype only — never a real credential.
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // --- Roles ---
  const roleByCode: Record<string, string> = {};
  for (const r of roles) {
    const rec = await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name, description: r.description, isSystem: r.isSystem },
      create: r,
    });
    roleByCode[r.code] = rec.id;
  }

  // --- Permissions ---
  const permByCode: Record<string, string> = {};
  for (const p of permissions) {
    const rec = await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, resource: p.resource, action: p.action },
      create: p,
    });
    permByCode[p.code] = rec.id;
  }

  // --- Role -> Permission ---
  for (const [roleCode, permCodes] of Object.entries(rolePermissions)) {
    for (const pc of permCodes) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: roleByCode[roleCode], permissionId: permByCode[pc] } },
        update: {},
        create: { roleId: roleByCode[roleCode], permissionId: permByCode[pc] },
      });
    }
  }

  // --- Users + role assignment ---
  const userByEmail: Record<string, string> = {};
  for (const u of users) {
    const rec = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, passwordHash },
      create: { email: u.email, name: u.name, passwordHash },
    });
    userByEmail[u.email] = rec.id;
    for (const rc of u.roleCodes) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: rec.id, roleId: roleByCode[rc] } },
        update: {},
        create: { userId: rec.id, roleId: roleByCode[rc] },
      });
    }
  }

  // --- Locations ---
  const locByCode: Record<string, string> = {};
  for (const l of locations) {
    const rec = await prisma.location.upsert({
      where: { code: l.code },
      update: { name: l.name, type: l.type, city: l.city, state: l.state },
      create: l,
    });
    locByCode[l.code] = rec.id;
  }

  // --- Equipment categories ---
  const catByCode: Record<string, string> = {};
  for (const c of categories) {
    const rec = await prisma.equipmentCategory.upsert({
      where: { code: c.code },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c,
    });
    catByCode[c.code] = rec.id;
  }

  // --- Equipment classes ---
  const classByCode: Record<string, string> = {};
  for (const ec of equipmentClasses) {
    const rec = await prisma.equipmentClass.upsert({
      where: { code: ec.code },
      update: { name: ec.name, description: ec.description, specifications: ec.specifications ?? undefined },
      create: {
        code: ec.code,
        name: ec.name,
        description: ec.description,
        specifications: ec.specifications ?? undefined,
        categoryId: catByCode[ec.categoryCode],
      },
    });
    classByCode[ec.code] = rec.id;
  }

  // --- Class relations ---
  for (const cr of classRelations) {
    await prisma.equipmentClassRelation.upsert({
      where: {
        sourceClassId_targetClassId_relationType: {
          sourceClassId: classByCode[cr.sourceCode],
          targetClassId: classByCode[cr.targetCode],
          relationType: cr.relationType,
        },
      },
      update: {},
      create: {
        sourceClassId: classByCode[cr.sourceCode],
        targetClassId: classByCode[cr.targetCode],
        relationType: cr.relationType,
      },
    });
  }

  // --- Assets ---
  const assetByNumber: Record<string, string> = {};
  for (const a of assets) {
    const rec = await prisma.asset.upsert({
      where: { assetNumber: a.assetNumber },
      update: { status: a.status, currentLocationId: locByCode[a.locationCode] },
      create: {
        assetNumber: a.assetNumber,
        classId: classByCode[a.classCode],
        serialNumber: a.serialNumber,
        make: a.make,
        model: a.model,
        year: a.year,
        status: a.status,
        currentLocationId: locByCode[a.locationCode],
      },
    });
    assetByNumber[a.assetNumber] = rec.id;
  }

  // --- Vendors ---
  const vendorByCode: Record<string, string> = {};
  for (const v of vendors) {
    const rec = await prisma.vendor.upsert({
      where: { code: v.code },
      update: { name: v.name, contactName: v.contactName, phone: v.phone, email: v.email },
      create: v,
    });
    vendorByCode[v.code] = rec.id;
  }

  // --- Projects (+ locations, phase codes) ---
  const projByCode: Record<string, string> = {};
  const projDefaultLocation: Record<string, string> = {};
  const projPhaseFirst: Record<string, string> = {};
  for (const p of projects) {
    const { locations: locs, phaseCodes, ...projectData } = p;
    const proj = await prisma.project.upsert({
      where: { code: p.code },
      update: { name: p.name, status: p.status },
      create: projectData,
    });
    projByCode[p.code] = proj.id;
    for (const loc of locs) {
      let existing = await prisma.projectLocation.findFirst({ where: { projectId: proj.id, name: loc.name } });
      if (!existing) {
        existing = await prisma.projectLocation.create({
          data: { projectId: proj.id, name: loc.name, isDefault: (loc as { isDefault?: boolean }).isDefault ?? false },
        });
      }
      if ((loc as { isDefault?: boolean }).isDefault) projDefaultLocation[p.code] = existing.id;
    }
    for (const pc of phaseCodes) {
      const rec = await prisma.projectPhaseCode.upsert({
        where: { projectId_code: { projectId: proj.id, code: pc.code } },
        update: { description: pc.description },
        create: { projectId: proj.id, code: pc.code, description: pc.description },
      });
      if (!projPhaseFirst[p.code]) projPhaseFirst[p.code] = rec.id;
    }
  }

  // --- Project user access (per-user, per Phase 4 decision) ---
  const allProjectCodes = projects.map((p) => p.code);
  for (const u of users) {
    const codes = u.projectCodes === "ALL" ? allProjectCodes : u.projectCodes;
    for (const code of codes) {
      const projectId = projByCode[code];
      const userId = userByEmail[u.email];
      if (!projectId || !userId) continue;
      await prisma.projectUserAccess.upsert({
        where: { projectId_userId: { projectId, userId } },
        update: {},
        create: { projectId, userId },
      });
    }
  }

  // --- Rate card (+ lines) ---
  let card = await prisma.rateCard.findFirst({ where: { name: rateCard.name } });
  if (!card) {
    card = await prisma.rateCard.create({ data: rateCard });
  }
  for (const line of rateCardLines) {
    const classId = classByCode[line.classCode];
    if (!classId) continue;
    await prisma.rateCardLine.upsert({
      where: { rateCardId_classId: { rateCardId: card.id, classId } },
      update: {
        dailyRate: line.dailyRate,
        weeklyRate: line.weeklyRate,
        monthlyRate: line.monthlyRate,
        includedHours: line.includedHours ?? null,
        overtimeHourRate: line.overtimeHourRate ?? null,
        deliveryCharge: line.deliveryCharge,
        pickupCharge: line.pickupCharge,
      },
      create: {
        rateCardId: card.id,
        classId,
        dailyRate: line.dailyRate,
        weeklyRate: line.weeklyRate,
        monthlyRate: line.monthlyRate,
        includedHours: line.includedHours ?? null,
        overtimeHourRate: line.overtimeHourRate ?? null,
        deliveryCharge: line.deliveryCharge,
        pickupCharge: line.pickupCharge,
      },
    });
  }

  // ==========================================================================
  // DEMO TRANSACTIONAL DATA (FICTIONAL) — requests, assignments, rentals, audit
  // Idempotent: keyed on deterministic requestNumbers so re-runs don't duplicate.
  // ==========================================================================
  const projectUserId = userByEmail["project.user@demo.cps"];
  const coordinatorId = userByEmail["coordinator@demo.cps"];
  const day = (offset: number) => new Date(Date.now() + offset * 86400000);

  async function ensureRequest(opts: {
    requestNumber: string;
    projectCode: string;
    status: string;
    isFreeForm?: boolean;
    freeFormText?: string;
    notes?: string;
    neededInDays?: number;
    lineItems?: { classCode?: string; description: string; quantity: number; unitNotes?: string }[];
    publicNote?: string;
    internalNote?: string;
  }) {
    const projectId = projByCode[opts.projectCode];
    if (!projectId) return null;
    const existing = await prisma.request.findUnique({ where: { requestNumber: opts.requestNumber } });
    if (existing) return existing;
    const req = await prisma.request.create({
      data: {
        requestNumber: opts.requestNumber,
        projectId,
        requestedBy: projectUserId,
        assignedTo: opts.status === "SUBMITTED" ? null : coordinatorId,
        status: opts.status,
        deliveryLocationId: projDefaultLocation[opts.projectCode] ?? null,
        phaseCodeId: projPhaseFirst[opts.projectCode] ?? null,
        neededDate: day(opts.neededInDays ?? 5),
        notes: opts.notes,
        isFreeForm: opts.isFreeForm ?? false,
        freeFormText: opts.freeFormText,
        submittedAt: new Date(),
        lineItems: opts.lineItems
          ? {
              create: opts.lineItems.map((li) => ({
                classId: li.classCode ? classByCode[li.classCode] : null,
                description: li.description,
                quantity: li.quantity,
                unitNotes: li.unitNotes,
              })),
            }
          : undefined,
      },
    });
    await prisma.requestStatusHistory.create({
      data: { requestId: req.id, status: opts.status, changedBy: projectUserId, notes: "Seed: initial status" },
    });
    if (opts.publicNote) {
      await prisma.note.create({ data: { requestId: req.id, content: opts.publicNote, isInternal: false, authorId: coordinatorId } });
    }
    if (opts.internalNote) {
      await prisma.note.create({ data: { requestId: req.id, content: opts.internalNote, isInternal: true, authorId: coordinatorId } });
    }
    await prisma.auditEvent.create({
      data: { userId: projectUserId, action: "REQUEST_SUBMITTED", entityType: "REQUEST", entityId: req.id, requestId: req.id, projectId },
    });
    return req;
  }

  const r1 = await ensureRequest({
    requestNumber: "REQ-DEMO-0001",
    projectCode: "DEMO-FL-001",
    status: "SUBMITTED",
    notes: "Need temporary power near the office trailers.",
    lineItems: [
      { classCode: "GEN-25KW", description: "25 kW Generator", quantity: 1, unitNotes: "240V outlets needed" },
      { classCode: "LT-4HEAD", description: "Light Tower (4-Head)", quantity: 2 },
    ],
  });
  const r2 = await ensureRequest({
    requestNumber: "REQ-DEMO-0002",
    projectCode: "DEMO-IL-001",
    status: "UNDER_REVIEW",
    lineItems: [{ classCode: "AWP-SCIS-40", description: "40 ft Scissor Lift", quantity: 1 }],
    publicNote: "Thanks — we're reviewing availability and will confirm shortly.",
    internalNote: "Check IL warehouse stock before committing fleet unit.",
  });
  await ensureRequest({
    requestNumber: "REQ-DEMO-0003",
    projectCode: "DEMO-FL-001",
    status: "FULFILLING",
    lineItems: [{ classCode: "AWP-BOOM-60", description: "60 ft Boom Lift", quantity: 1 }],
    internalNote: "Assigning CPS-AWP-0003 from IL warehouse.",
  });
  await ensureRequest({
    requestNumber: "REQ-DEMO-0004",
    projectCode: "DEMO-IL-001",
    status: "SUBMITTED",
    isFreeForm: true,
    freeFormText:
      "Need temporary power for two office trailers and some lighting for night work. Not sure exactly what size. Need it by next week if possible.",
  });

  // Active assignments (2) — tie assigned assets to fulfilling/active requests.
  async function ensureAssignment(assetNumber: string, projectCode: string, requestId: string | null, startInDays: number) {
    const assetId = assetByNumber[assetNumber];
    const projectId = projByCode[projectCode];
    if (!assetId || !projectId) return;
    const existing = await prisma.assetAssignment.findFirst({ where: { assetId, status: "ACTIVE" } });
    if (existing) return;
    await prisma.assetAssignment.create({
      data: {
        assetId,
        projectId,
        requestId,
        assignedBy: coordinatorId,
        startDate: day(startInDays),
        expectedEndDate: day(startInDays + 28),
        status: "ACTIVE",
      },
    });
    await prisma.auditEvent.create({
      data: { userId: coordinatorId, action: "ASSET_ASSIGNED", entityType: "ASSET", entityId: assetId, assetId, projectId },
    });
  }
  await ensureAssignment("CPS-GEN-0002", "DEMO-IL-001", r2?.id ?? null, -3);
  await ensureAssignment("CPS-AWP-0003", "DEMO-FL-001", r1?.id ?? null, -6);

  // One active external rental (FICTIONAL).
  const extProjectId = projByCode["DEMO-FL-002"];
  if (extProjectId) {
    const existingRental = await prisma.externalRental.findFirst({ where: { poNumber: "PO-DEMO-1001" } });
    if (!existingRental) {
      const rental = await prisma.externalRental.create({
        data: {
          projectId: extProjectId,
          vendorId: vendorByCode["VEND-001"],
          description: "80 ft boom lift (no fleet unit available) — FICTIONAL sample rental",
          reasonCode: "ALL_DEPLOYED",
          startDate: day(-10),
          expectedEndDate: day(18),
          dailyRate: 640,
          estimatedCost: 8960,
          poNumber: "PO-DEMO-1001",
        },
      });
      await prisma.auditEvent.create({
        data: { userId: coordinatorId, action: "EXTERNAL_RENTAL_CREATED", entityType: "RENTAL", entityId: rental.id, projectId: extProjectId },
      });
    }
  }

  console.log("Seed complete (FICTIONAL data).");
  console.log(`Demo users password: "${DEMO_PASSWORD}" (prototype only)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
