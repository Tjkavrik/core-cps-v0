import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { projectFacingRequestStatus } from "@/lib/status";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RequestsListPage({
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
        <PageHeader title="My Requests" />
        <EmptyState icon="📋" title="No project selected" message="You need project access to see requests." />
      </>
    );
  }

  const requests = await prisma.request.findMany({
    where: { projectId: active.id },
    orderBy: { createdAt: "desc" },
    include: { phaseCode: true, _count: { select: { lineItems: true } } },
  });

  return (
    <>
      <PageHeader
        title="My Requests"
        subtitle={`${active.code} — ${active.name}`}
        breadcrumbs={[{ label: "Home", href: `/home${projectQ}` }, { label: "My Requests" }]}
        actions={
          <div className="flex items-center gap-3">
            {projects.length > 1 && <ProjectSwitcher projects={projects} activeId={active.id} />}
            <Link href={`/request/new${projectQ}`}>
              <Button>New request</Button>
            </Link>
          </div>
        }
      />

      {requests.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No requests yet"
          message="Create a request and it will appear here."
          action={
            <Link href={`/request/new${projectQ}`}>
              <Button>New request</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Request #</TH>
              <TH>Type</TH>
              <TH>Items</TH>
              <TH>Needed</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {requests.map((r) => (
              <TR key={r.id}>
                <TD>
                  <Link href={`/requests/${r.id}${projectQ}`} className="font-medium text-cps-blue hover:underline">
                    {r.requestNumber}
                  </Link>
                </TD>
                <TD>{r.isFreeForm ? "Special request" : r.phaseCode?.code ?? "—"}</TD>
                <TD>{r.isFreeForm ? "—" : r._count.lineItems}</TD>
                <TD>{fmtDate(r.neededDate)}</TD>
                <TD>
                  <StatusBadge status={r.status} label={projectFacingRequestStatus(r.status)} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
