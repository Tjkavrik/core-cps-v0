import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { FreeFormRequestForm } from "@/components/FreeFormRequestForm";

export const dynamic = "force-dynamic";

export default async function FreeFormPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  const { active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  if (!active) {
    return (
      <>
        <PageHeader title="I Don't See What I Need" />
        <EmptyState icon="🏗️" title="No project selected" message="You need project access to create a request." />
      </>
    );
  }

  const [phaseCodes, locations] = await Promise.all([
    prisma.projectPhaseCode.findMany({ where: { projectId: active.id, isActive: true }, orderBy: { code: "asc" } }),
    prisma.projectLocation.findMany({ where: { projectId: active.id }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="I Don't See What I Need"
        subtitle="Describe it in your own words — CPS will source it for you."
        breadcrumbs={[{ label: "Home", href: `/home${projectQ}` }, { label: "Special Request" }]}
      />
      <FreeFormRequestForm
        projectId={active.id}
        phaseCodes={phaseCodes.map((p) => ({ id: p.id, code: p.code, description: p.description }))}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
      />
    </>
  );
}
