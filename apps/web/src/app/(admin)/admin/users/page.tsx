import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { UserAdmin } from "@/components/admin/UserAdmin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, roles, projects] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        roles: { include: { role: true } },
        projectAccess: { include: { project: true } },
      },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findMany({ orderBy: { code: "asc" } }),
  ]);

  const usersData = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    isActive: u.isActive,
    roles: u.roles.map((r) => ({ role: { code: r.role.code, name: r.role.name } })),
    projectAccess: u.projectAccess.map((p) => ({
      project: { code: p.project.code },
      revokedAt: p.revokedAt ? p.revokedAt.toISOString() : null,
    })),
  }));

  const rolesData = roles.map((r) => ({ id: r.id, code: r.code, name: r.name }));
  const projectsData = projects.map((p) => ({ id: p.id, code: p.code, name: p.name }));

  return (
    <>
      <PageHeader title="Users" subtitle="Manage user accounts, roles, and project access" />
      <UserAdmin users={usersData} roles={rolesData} projects={projectsData} />
    </>
  );
}
