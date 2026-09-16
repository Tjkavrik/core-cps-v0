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
import { createHash } from "crypto";

import { roles, permissions, rolePermissions, users, DEMO_PASSWORD } from "./data/users";
import { categories, equipmentClasses, classRelations, assets, locations } from "./data/equipment";
import { projects, vendors } from "./data/projects";
import { rateCard, rateCardLines } from "./data/ratecards";

const prisma = new PrismaClient();

/**
 * NOTE: We intentionally do NOT hard-code bcrypt here to keep the seed package
 * dependency-light. The application uses a proper password hashing library
 * (see docs/security.md). For prototype seed users we store a clearly-marked
 * demo hash; login flow treats these as demo accounts only.
 * This is a prototype convenience, documented in docs/assumptions.md
 * (ASSUMPTION-001). Do NOT use this approach for real credentials.
 */
function demoHash(password: string): string {
  return "demo$" + createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding FICTIONAL prototype data (no real CORE data)...");

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
      update: { name: u.name },
      create: { email: u.email, name: u.name, passwordHash: demoHash(DEMO_PASSWORD) },
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
  for (const a of assets) {
    await prisma.asset.upsert({
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
  }

  // --- Vendors ---
  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { code: v.code },
      update: { name: v.name, contactName: v.contactName, phone: v.phone, email: v.email },
      create: v,
    });
  }

  // --- Projects (+ locations, phase codes, user access) ---
  for (const p of projects) {
    const { locations: locs, phaseCodes, ...projectData } = p;
    const proj = await prisma.project.upsert({
      where: { code: p.code },
      update: { name: p.name, status: p.status },
      create: projectData,
    });
    for (const loc of locs) {
      const existing = await prisma.projectLocation.findFirst({ where: { projectId: proj.id, name: loc.name } });
      if (!existing) {
        await prisma.projectLocation.create({
          data: { projectId: proj.id, name: loc.name, isDefault: (loc as { isDefault?: boolean }).isDefault ?? false },
        });
      }
    }
    for (const pc of phaseCodes) {
      await prisma.projectPhaseCode.upsert({
        where: { projectId_code: { projectId: proj.id, code: pc.code } },
        update: { description: pc.description },
        create: { projectId: proj.id, code: pc.code, description: pc.description },
      });
    }
    // Give the demo Project User access to all demo projects (prototype only).
    const projectUserId = userByEmail["project.user@example.test"];
    if (projectUserId) {
      await prisma.projectUserAccess.upsert({
        where: { projectId_userId: { projectId: proj.id, userId: projectUserId } },
        update: {},
        create: { projectId: proj.id, userId: projectUserId },
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
