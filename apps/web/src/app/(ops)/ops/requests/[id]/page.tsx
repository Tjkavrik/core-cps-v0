import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DemoProjectBadge } from "@/components/ui/DemoProjectBadge";
import { OpsRequestReview } from "@/components/ops/OpsRequestReview";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { fmtDate, fmtDateTime, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OpsRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      project: true,
      phaseCode: true,
      deliveryLocation: true,
      createdByUser: true,
      assignedToUser: true,
      lineItems: { include: { class: { include: { category: true } } } },
      assignments: { include: { asset: true } },
      statusHistory: { orderBy: { changedAt: "asc" } },
      externalRentals: { include: { vendor: true } },
    },
  });
  if (!request) notFound();

  const availableAssets = await prisma.asset.findMany({
    where: { status: "AVAILABLE" },
    include: { class: true },
    orderBy: { assetNumber: "asc" },
  });
  const vendors = await prisma.vendor.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  const lineItemsView = request.lineItems.map((li) => ({
    id: li.id,
    name: li.class?.name ?? li.description ?? "—",
    classId: li.classId,
    quantity: li.quantity,
    unitNotes: li.unitNotes,
    fulfillmentType: li.fulfillmentType,
    status: li.status,
    assignedAssetNumbers: request.assignments
      .filter((a) => a.lineItemId === li.id)
      .map((a) => a.asset.assetNumber),
  }));

  return (
    <>
      <PageHeader
        title={request.requestNumber}
        subtitle={request.isFreeForm ? "Special (free-form) request" : "Catalog request"}
        breadcrumbs={[{ label: "Requests", href: "/ops/requests" }, { label: request.requestNumber }]}
        actions={<StatusBadge status={request.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {request.isFreeForm && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="font-semibold text-cps-navy">Requester description</h2>
              </CardHeader>
              <CardBody>
                <p className="whitespace-pre-wrap text-sm text-slate-700">{request.freeFormText}</p>
              </CardBody>
            </Card>
          )}

          <OpsRequestReview
            requestId={request.id}
            projectId={request.projectId}
            currentStatus={request.status}
            lineItems={lineItemsView}
            availableAssets={availableAssets.map((a) => ({
              id: a.id,
              assetNumber: a.assetNumber,
              classId: a.classId,
              label: `${a.assetNumber} — ${a.class.name}`,
            }))}
            vendors={vendors.map((v) => ({ id: v.id, name: v.name }))}
          />

          {request.externalRentals.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <h2 className="font-semibold text-cps-navy">External rentals</h2>
              </CardHeader>
              <CardBody className="space-y-2">
                {request.externalRentals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span>
                      {r.poNumber} · {r.vendor?.name ?? "Vendor"} · {r.description}
                    </span>
                    <span className="text-cps-slate">{money(r.dailyRate)}/day</span>
                  </div>
                ))}
                <p className="text-xs text-cps-orange">
                  ⚠ SAMPLE RATES ONLY — Not actual CORE rates. Rate methodology to be established.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Details</h2>
            </CardHeader>
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Project">
                  {request.project.code}
                  <DemoProjectBadge />
                </Row>
                <Row label="Phase">{request.phaseCode?.code ?? "—"}</Row>
                <Row label="Delivery">{request.deliveryLocation?.name ?? "—"}</Row>
                <Row label="Requested by">{request.createdByUser?.name ?? "—"}</Row>
                <Row label="Assigned to">{request.assignedToUser?.name ?? "Unassigned"}</Row>
                <Row label="Needed by">{fmtDate(request.neededDate)}</Row>
                <Row label="Expected return">{fmtDate(request.expectedReturnDate)}</Row>
                <Row label="Submitted">{fmtDate(request.submittedAt ?? request.createdAt)}</Row>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">History (immutable)</h2>
            </CardHeader>
            <CardBody>
              <ol className="relative space-y-4 border-l border-cps-gray200 pl-6">
                {request.statusHistory.map((h) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-cps-blue ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cps-navy">{h.status.replace(/_/g, " ")}</span>
                      <span className="text-xs text-cps-slate">{fmtDateTime(h.changedAt)}</span>
                    </div>
                    {h.notes && <p className="mt-0.5 text-xs text-cps-slate">{h.notes}</p>}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-cps-slate">{label}</dt>
      <dd className="flex items-center text-right font-medium text-cps-navy">{children}</dd>
    </div>
  );
}
