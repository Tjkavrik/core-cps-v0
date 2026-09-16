import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const ADMIN = ["SYSTEM_ADMIN"];

const createSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  status: z.string().default("ACTIVE"),
});

export async function GET() {
  const user = await requireRole(ADMIN);
  if (isResponse(user)) return user;
  const projects = await prisma.project.findMany({
    orderBy: { code: "asc" },
    include: { _count: { select: { requests: true, userAccess: true, locations: true } } },
  });
  return ok(projects);
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

  const existing = await prisma.project.findUnique({ where: { code: d.code } });
  if (existing) return fail("A project with that code already exists");

  const created = await prisma.project.create({
    data: {
      code: d.code,
      name: d.name,
      description: d.description || null,
      city: d.city || null,
      state: d.state || null,
      status: d.status,
    },
  });

  await audit({ userId: user.id, action: "PROJECT_CREATED", entityType: "Project", entityId: created.id, projectId: created.id, newValue: { code: d.code } });
  return ok(created, 201);
}
