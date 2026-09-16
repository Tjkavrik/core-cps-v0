import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OpsAssetActions } from "@/components/ops/OpsAssetActions";
import { fmtDate, fmtDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

type TimelineItem = { at: Date; kind: string; title: string; detail?: string };

export default async function OpsAssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      class: { include: { category: true } },
      currentLocation: true,
      currentProject: true,
      statusHistory: true,
      meterReadings: true,
      inspections: true,
      maintenanceRecords: true,
      damageRecords: true,
      transfers: true,
      assignments: { include: { project: true } },
    },
  });
  if (!asset) notFound();

  const [projects, locations] = await Promise.all([
    prisma.project.findMany({ orderBy: { code: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  const timeline: TimelineItem[] = [
    ...asset.statusHistory.map((h) => ({
      at: h.changedAt,
      kind: "Status",
      title: `Status → ${h.status.replace(/_/g, " ")}`,
      detail: h.reason ?? undefined,
    })),
    ...asset.meterReadings.map((m) => ({
      at: m.readingDate,
      kind: "Meter",
      title: `Meter reading ${m.reading} ${m.unit}`,
    })),
    ...asset.inspections.map((i) => ({
      at: i.inspectedAt,
      kind: "Inspection",
      title: `${i.type} inspection — ${i.condition ?? "n/a"}`,
      detail: i.passed === false ? "Failed" : i.passed ? "Passed" : undefined,
    })),
    ...asset.maintenanceRecords.map((m) => ({
      at: m.createdAt,
      kind: "Maintenance",
      title: `${m.type} — ${m.status}`,
      detail: m.description,
    })),
    ...asset.damageRecords.map((d) => ({
      at: d.discoveredAt,
      kind: "Damage",
      title: `Damage (${d.severity ?? "n/a"})`,
      detail: d.description,
    })),
    ...asset.transfers.map((t) => ({
      at: t.initiatedAt,
      kind: "Transfer",
      title: `Transfer — ${t.status}`,
    })),
    ...asset.assignments.map((a) => ({
      at: a.assignedAt,
      kind: "Assignment",
      title: `Assigned to ${a.project.code} — ${a.status}`,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  const specs = (asset.class.specifications as Record<string, unknown> | null) ?? null;

  return (
    <>
      <PageHeader
        title={asset.assetNumber}
        subtitle={`${asset.class.name} · ${asset.class.category.name}`}
        breadcrumbs={[{ label: "Assets", href: "/ops/assets" }, { label: asset.assetNumber }]}
        actions={<StatusBadge status={asset.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Actions</h2>
            </CardHeader>
            <CardBody>
              <OpsAssetActions
                assetId={asset.id}
                projects={projects.map((p) => ({ id: p.id, code: p.code, name: p.name }))}
                locations={locations.map((l) => ({ id: l.id, name: l.name }))}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Full history (immutable audit trail)</h2>
            </CardHeader>
            <CardBody>
              {timeline.length === 0 ? (
                <p className="text-sm text-cps-slate">No history recorded.</p>
              ) : (
                <ol className="relative space-y-4 border-l border-cps-gray200 pl-6">
                  {timeline.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-cps-blue ring-4 ring-white" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-cps-navy">
                          <span className="mr-2 rounded bg-cps-gray100 px-1.5 py-0.5 text-[10px] uppercase text-cps-slate">
                            {t.kind}
                          </span>
                          {t.title}
                        </span>
                        <span className="whitespace-nowrap text-xs text-cps-slate">{fmtDateTime(t.at)}</span>
                      </div>
                      {t.detail && <p className="mt-0.5 text-xs text-cps-slate">{t.detail}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Register</h2>
            </CardHeader>
            <CardBody>
              <dl className="space-y-2 text-sm">
                <Row label="Serial #">{asset.serialNumber ?? "—"}</Row>
                <Row label="Make">{asset.make ?? "—"}</Row>
                <Row label="Model">{asset.model ?? "—"}</Row>
                <Row label="Year">{asset.year ?? "—"}</Row>
                <Row label="Location">{asset.currentLocation?.name ?? "—"}</Row>
                <Row label="Project">{asset.currentProject?.code ?? "—"}</Row>
              </dl>
            </CardBody>
          </Card>

          {specs && Object.keys(specs).length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-cps-navy">Specifications</h2>
              </CardHeader>
              <CardBody>
                <dl className="space-y-2 text-sm">
                  {Object.entries(specs).map(([k, v]) => (
                    <Row key={k} label={k.replace(/_/g, " ")}>
                      {String(v)}
                    </Row>
                  ))}
                </dl>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="capitalize text-cps-slate">{label}</dt>
      <dd className="text-right font-medium text-cps-navy">{children}</dd>
    </div>
  );
}
