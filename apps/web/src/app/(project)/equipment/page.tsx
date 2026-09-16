import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EquipmentListPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  const { projects, active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  if (!active) {
    return (
      <>
        <PageHeader title="My Equipment" />
        <EmptyState icon="🏗️" title="No project selected" message="You need project access to view equipment." />
      </>
    );
  }

  // Project users see the equipment CLASS on site — never the internal asset serial.
  const assignments = await prisma.assetAssignment.findMany({
    where: { projectId: active.id, status: "ACTIVE" },
    orderBy: { startDate: "desc" },
    include: { asset: { include: { class: { include: { category: true } } } } },
  });

  return (
    <>
      <PageHeader
        title="My Equipment"
        subtitle={`On site at ${active.code} — ${active.name}`}
        breadcrumbs={[{ label: "Home", href: `/home${projectQ}` }, { label: "My Equipment" }]}
        actions={projects.length > 1 ? <ProjectSwitcher projects={projects} activeId={active.id} /> : undefined}
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon="🏗️"
          title="No equipment on site"
          message="Equipment assigned to this project will appear here."
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Category</TH>
              <TH>Equipment</TH>
              <TH>On site since</TH>
              <TH>Expected return</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {assignments.map((a) => (
              <TR key={a.id}>
                <TD>{a.asset.class.category.name}</TD>
                <TD>
                  <Link href={`/equipment/${a.id}${projectQ}`} className="font-medium text-cps-blue hover:underline">
                    {a.asset.class.name}
                  </Link>
                </TD>
                <TD>{fmtDate(a.startDate)}</TD>
                <TD>{fmtDate(a.expectedEndDate)}</TD>
                <TD>
                  <StatusBadge status="ON_SITE" label="On Site" />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
