import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardBody>
        <div className="text-3xl font-bold text-cps-navy">{value}</div>
        <div className="mt-1 text-sm text-cps-slate">{label}</div>
      </CardBody>
    </Card>
  );
}

export default async function ViewerDashboardPage() {
  const [totalAssets, assignedAssets, activeProjects, openRequests, recentRequests] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "ASSIGNED" } }),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.request.count({ where: { status: { notIn: ["COMPLETE", "CANCELLED", "CLOSED"] } } }),
    prisma.request.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { project: true },
    }),
  ]);

  const utilization = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  return (
    <>
      <PageHeader title="Leadership Dashboard" subtitle="Read-only overview of demo operations" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Assets" value={totalAssets} />
        <StatCard label="Assets Deployed" value={assignedAssets} />
        <StatCard label="Utilization" value={`${utilization}%`} />
        <StatCard label="Active Projects" value={activeProjects} />
        <StatCard label="Open Requests" value={openRequests} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="text-base font-semibold text-cps-navy">Recent Requests</h2>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <THead>
              <TR>
                <TH>Request #</TH>
                <TH>Project</TH>
                <TH>Created</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {recentRequests.map((r) => (
                <TR key={r.id}>
                  <TD className="font-mono">{r.requestNumber}</TD>
                  <TD>{r.project.code}</TD>
                  <TD>{fmtDate(r.createdAt)}</TD>
                  <TD>
                    <StatusBadge status={r.status} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
}
