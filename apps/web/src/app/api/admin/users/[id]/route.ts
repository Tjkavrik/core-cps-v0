import { z } from "zod";
import { ok, fail, requireRole, isResponse, audit } from "@/lib/api";
import { prisma } from "@/lib/db";

const ADMIN = ["SYSTEM_ADMIN"];

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(ADMIN);
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

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return fail("User not found", 404);

  const updated = await prisma.user.update({
    where: { id },
    data: { name: parsed.data.name ?? undefined, isActive: parsed.data.isActive ?? undefined },
  });

  await audit({
    userId: user.id,
    action: "USER_UPDATED",
    entityType: "User",
    entityId: id,
    priorValue: { isActive: existing.isActive, name: existing.name },
    newValue: { isActive: updated.isActive, name: updated.name },
  });
  return ok({ id: updated.id, isActive: updated.isActive });
}
