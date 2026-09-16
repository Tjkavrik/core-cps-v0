import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OpsAssignmentsPage() {
  const assignments = await prisma.assetAssignment.findMany({
    orderBy: { assignedAt: "desc" },
    include: {
      asset: { include: { class: true } },
      project: true,
      request: true,
    },
  });

  const active = assignments.filter((a) => a.status === "ACTIVE");
  const past = assignments.filter((a) => a.status !== "ACTIVE");

  return (
    <>
      <PageHeader title="Assignments" subtitle="Assets currently deployed to projects" />

      <h2 className="mb-3 text-lg font-semibold text-cps-navy">Active ({active.length})</h2>
      {active.length === 0 ? (
        <EmptyState icon="🔗" title="No active assignments" message="No assets are currently assigned to a project." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset</TH>
              <TH>Class</TH>
              <TH>Project</TH>
              <TH>Request</TH>
              <TH>Assigned</TH>
              <TH>Expected End</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {active.map((a) => (
              <TR key={a.id}>
                <TD>
                  <Link href={`/ops/assets/${a.assetId}`} className="font-mono text-cps-blue hover:underline">
                    {a.asset.assetNumber}
                  </Link>
                </TD>
                <TD>{a.asset.class.name}</TD>
                <TD>{a.project.code}</TD>
                <TD>
                  {a.request ? (
                    <Link href={`/ops/requests/${a.requestId}`} className="font-mono text-cps-blue hover:underline">
                      {a.request.requestNumber}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TD>
                <TD>{fmtDate(a.assignedAt)}</TD>
                <TD>{fmtDate(a.expectedEndDate)}</TD>
                <TD>
                  <StatusBadge status={a.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-semibold text-cps-navy">Past ({past.length})</h2>
          <Table>
            <THead>
              <TR>
                <TH>Asset</TH>
                <TH>Class</TH>
                <TH>Project</TH>
                <TH>Assigned</TH>
                <TH>Ended</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {past.map((a) => (
                <TR key={a.id}>
                  <TD className="font-mono">{a.asset.assetNumber}</TD>
                  <TD>{a.asset.class.name}</TD>
                  <TD>{a.project.code}</TD>
                  <TD>{fmtDate(a.assignedAt)}</TD>
                  <TD>{fmtDate(a.actualEndDate)}</TD>
                  <TD>
                    <StatusBadge status={a.status} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </>
      )}
    </>
  );
}
