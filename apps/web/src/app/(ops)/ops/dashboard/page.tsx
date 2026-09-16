import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function Stat({ label, value, href, accent }: { label: string; value: number; href: string; accent?: string }) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardBody>
          <div className={`text-3xl font-bold ${accent ?? "text-cps-navy"}`}>{value}</div>
          <div className="mt-1 text-sm text-cps-slate">{label}</div>
        </CardBody>
      </Card>
    </Link>
  );
}

export default async function OpsDashboardPage() {
  const [
    newRequests,
    underReview,
    fulfilling,
    activeAssignments,
    pendingReturns,
    inMaintenance,
    availableAssets,
    openRentals,
    queue,
  ] = await Promise.all([
    prisma.request.count({ where: { status: "SUBMITTED" } }),
    prisma.request.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.request.count({ where: { status: { in: ["FULFILLING", "PARTIALLY_FULFILLED"] } } }),
    prisma.assetAssignment.count({ where: { status: "ACTIVE" } }),
    prisma.return.count({ where: { status: { in: ["REQUESTED", "SCHEDULED", "IN_TRANSIT"] } } }),
    prisma.asset.count({ where: { status: "MAINTENANCE" } }),
    prisma.asset.count({ where: { status: "AVAILABLE" } }),
    prisma.externalRental.count({ where: { actualEndDate: null } }),
    prisma.request.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      orderBy: { submittedAt: "asc" },
      take: 8,
      include: { project: true, phaseCode: true, _count: { select: { lineItems: true } } },
    }),
  ]);

  return (
    <>
      <PageHeader title="Operations Dashboard" subtitle="Live queue and fleet status (demo data)" />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="New requests" value={newRequests} href="/ops/requests?status=SUBMITTED" accent="text-cps-blue" />
        <Stat label="Under review" value={underReview} href="/ops/requests?status=UNDER_REVIEW" accent="text-cps-orange" />
        <Stat label="Being fulfilled" value={fulfilling} href="/ops/requests?status=FULFILLING" />
        <Stat label="Pending returns" value={pendingReturns} href="/ops/returns" accent="text-cps-orange" />
        <Stat label="Active on site" value={activeAssignments} href="/ops/assignments" />
        <Stat label="Available assets" value={availableAssets} href="/ops/assets?status=AVAILABLE" accent="text-green-700" />
        <Stat label="In maintenance" value={inMaintenance} href="/ops/maintenance" accent="text-cps-orange" />
        <Stat label="Open rentals" value={openRentals} href="/ops/rentals" />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-cps-navy">Incoming request queue</h2>
        </CardHeader>
        <CardBody>
          {queue.length === 0 ? (
            <EmptyState icon="✅" title="Queue is clear" message="No requests awaiting review." />
          ) : (
            <div className="divide-y divide-cps-gray200">
              {queue.map((r) => (
                <Link
                  key={r.id}
                  href={`/ops/requests/${r.id}`}
                  className="flex items-center justify-between py-3 hover:bg-cps-gray100"
                >
                  <div>
                    <span className="font-medium text-cps-blue">{r.requestNumber}</span>
                    <span className="ml-2 text-sm text-cps-slate">
                      {r.project.code} · {r.isFreeForm ? "Special request" : `${r._count.lineItems} item(s)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-cps-slate">
                    <span className="hidden sm:inline">Needed {fmtDate(r.neededDate)}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <p className="mt-4 text-xs text-cps-slate">
        Fulfillment options available to CPS: {" "}
        {["CPS_OWNED", "CPS_TRANSFER", "EXTERNAL", "OTHER_DIRECT"].map((t) => fulfillmentLabel(t)).join(" · ")}
      </p>
    </>
  );
}
