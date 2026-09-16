import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { RequestForm } from "@/components/RequestForm";

export const dynamic = "force-dynamic";

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; class?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  const { active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  if (!active) {
    return (
      <>
        <PageHeader title="Request Equipment" />
        <EmptyState icon="🏗️" title="No project selected" message="You need project access to create a request." />
      </>
    );
  }

  const [classes, phaseCodes, locations] = await Promise.all([
    prisma.equipmentClass.findMany({
      where: { isActive: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { code: "asc" }],
      include: { category: true },
    }),
    prisma.projectPhaseCode.findMany({ where: { projectId: active.id, isActive: true }, orderBy: { code: "asc" } }),
    prisma.projectLocation.findMany({ where: { projectId: active.id }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Request Equipment"
        subtitle={`For ${active.code} — ${active.name}`}
        breadcrumbs={[{ label: "Home", href: `/home${projectQ}` }, { label: "Request Equipment" }]}
        actions={
          <Link href={`/request/new/freeform${projectQ}`}>
            <Button variant="outline">Don&apos;t see what you need?</Button>
          </Link>
        }
      />
      <RequestForm
        projectId={active.id}
        initialClassId={sp.class}
        classes={classes.map((c) => ({
          id: c.id,
          code: c.code,
          name: c.name,
          categoryName: c.category.name,
        }))}
        phaseCodes={phaseCodes.map((p) => ({ id: p.id, code: p.code, description: p.description }))}
        locations={locations.map((l) => ({ id: l.id, name: l.name }))}
      />
    </>
  );
}
