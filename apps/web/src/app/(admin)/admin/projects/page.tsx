import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectAdmin } from "@/components/admin/ProjectAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { code: "asc" },
    include: { _count: { select: { requests: true, userAccess: true, locations: true } } },
  });

  const data = projects.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    city: p.city,
    state: p.state,
    status: p.status,
    _count: p._count,
  }));

  return (
    <>
      <PageHeader title="Projects" subtitle="Manage demo projects and their configuration" />
      <ProjectAdmin projects={data} />
    </>
  );
}
