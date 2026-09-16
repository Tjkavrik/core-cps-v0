import { z } from "zod";
import bcrypt from "bcryptjs";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const ADMIN = ["SYSTEM_ADMIN"];

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  roleCodes: z.array(z.string()).default([]),
  projectIds: z.array(z.string()).default([]),
});

export async function GET() {
  const user = await requireRole(ADMIN);
  if (isResponse(user)) return user;
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { roles: { include: { role: true } }, projectAccess: { include: { project: true } } },
  });
  return ok(users);
}

export async function POST(req: Request) {
  const user = await requireRole(ADMIN);
  if (isResponse(user)) return user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid request");
  const d = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: d.email.toLowerCase() } });
  if (existing) return fail("A user with that email already exists");

  const roles = await prisma.role.findMany({ where: { code: { in: d.roleCodes } } });
  const created = await prisma.user.create({
    data: {
      email: d.email.toLowerCase(),
      name: d.name,
      passwordHash: await bcrypt.hash(d.password, 10),
      isActive: true,
      roles: { create: roles.map((r) => ({ roleId: r.id })) },
      projectAccess: { create: d.projectIds.map((pid) => ({ projectId: pid })) },
    },
  });

  await audit({ userId: user.id, action: "USER_CREATED", entityType: "User", entityId: created.id, newValue: { email: d.email, roleCodes: d.roleCodes } });
  return ok({ id: created.id, email: created.email }, 201);
}
