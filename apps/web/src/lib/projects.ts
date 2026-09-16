import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

/**
 * Resolve the demo projects a user may act on. Users with the "ALL" marker in
 * seed data are granted access to every project; project users get the explicit
 * set stored on their session (projectIds).
 */
export async function projectsForUser(user: SessionUser) {
  const isAdminLike =
    user.roles.includes("SYSTEM_ADMIN") ||
    user.roles.includes("CPS_COORDINATOR") ||
    user.roles.includes("CPS_MANAGER") ||
    user.roles.includes("CPS_WAREHOUSE") ||
    user.roles.includes("READ_ONLY");

  if (isAdminLike) {
    return prisma.project.findMany({ orderBy: { code: "asc" } });
  }
  return prisma.project.findMany({
    where: { id: { in: user.projectIds } },
    orderBy: { code: "asc" },
  });
}

/**
 * Pick the "active" project for a project user given an optional ?project=<id>
 * search param, falling back to their first accessible project.
 */
export async function resolveActiveProject(user: SessionUser, requestedId?: string) {
  const projects = await projectsForUser(user);
  if (projects.length === 0) return { projects, active: null };
  const active = requestedId ? projects.find((p) => p.id === requestedId) ?? projects[0] : projects[0];
  return { projects, active };
}
