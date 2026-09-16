import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { RateWarning } from "@/components/ui/RateWarning";

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

export default async function OpsReportsPage() {
  const [
    totalAssets,
    availableAssets,
    assignedAssets,
    maintenanceAssets,
    openRequests,
    activeAssignments,
    openReturns,
    externalRentals,
    assetsByClass,
    requestsByStatus,
  ] = await Promise.all([
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.asset.count({ where: { status: "ASSIGNED" } }),
    prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    prisma.request.count({ where: { status: { notIn: ["COMPLETE", "CANCELLED", "CLOSED"] } } }),
    prisma.assetAssignment.count({ where: { status: "ACTIVE" } }),
    prisma.return.count({ where: { status: { notIn: ["COMPLETE", "CANCELLED"] } } }),
    prisma.externalRental.count(),
    prisma.asset.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.request.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const utilization = totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

  return (
    <>
      <PageHeader title="Reports" subtitle="Fleet summary and operational metrics (demo data)" />

      <RateWarning className="mb-4" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Assets" value={totalAssets} />
        <StatCard label="Available" value={availableAssets} />
        <StatCard label="Assigned" value={assignedAssets} />
        <StatCard label="In Maintenance" value={maintenanceAssets} />
        <StatCard label="Utilization" value={`${utilization}%`} />
        <StatCard label="Open Requests" value={openRequests} />
        <StatCard label="Active Assignments" value={activeAssignments} />
        <StatCard label="Open Returns" value={openReturns} />
        <StatCard label="External Rentals" value={externalRentals} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-cps-navy">Assets by Status</h2>
          </CardHeader>
          <CardBody className="p-0">
            <Table>
              <THead>
                <TR>
                  <TH>Status</TH>
                  <TH>Count</TH>
                </TR>
              </THead>
              <TBody>
                {assetsByClass.map((row) => (
                  <TR key={row.status}>
                    <TD>{row.status}</TD>
                    <TD>{row._count._all}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-cps-navy">Requests by Status</h2>
          </CardHeader>
          <CardBody className="p-0">
            <Table>
              <THead>
                <TR>
                  <TH>Status</TH>
                  <TH>Count</TH>
                </TR>
              </THead>
              <TBody>
                {requestsByStatus.map((row) => (
                  <TR key={row.status}>
                    <TD>{row.status}</TD>
                    <TD>{row._count._all}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
