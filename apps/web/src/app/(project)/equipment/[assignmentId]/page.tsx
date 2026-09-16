import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { projectsForUser } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReturnRequestButton } from "@/components/ReturnRequestButton";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { assignmentId } = await params;
  const sp = await searchParams;

  const assignment = await prisma.assetAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      asset: { include: { class: { include: { category: true } } } },
      project: true,
      request: true,
    },
  });
  if (!assignment) notFound();

  const allowed = await projectsForUser(user);
  if (!allowed.some((p) => p.id === assignment.projectId)) redirect("/home");

  const projectQ = `?project=${sp.project ?? assignment.projectId}`;

  const openReturn = await prisma.return.findFirst({
    where: {
      assetId: assignment.assetId,
      status: { in: ["REQUESTED", "SCHEDULED", "IN_TRANSIT", "RECEIVED", "INSPECTING"] },
    },
  });

  const specs = (assignment.asset.class.specifications as Record<string, unknown> | null) ?? null;

  return (
    <>
      <PageHeader
        title={assignment.asset.class.name}
        subtitle={`${assignment.asset.class.category.name} · On site at ${assignment.project.code}`}
        breadcrumbs={[
          { label: "Home", href: `/home${projectQ}` },
          { label: "My Equipment", href: `/equipment${projectQ}` },
          { label: assignment.asset.class.name },
        ]}
        actions={
          assignment.status === "ACTIVE" ? (
            <ReturnRequestButton assignmentId={assignment.id} alreadyRequested={!!openReturn} />
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Specifications</h2>
            </CardHeader>
            <CardBody>
              {specs && Object.keys(specs).length > 0 ? (
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-cps-gray200 py-1.5 text-sm">
                      <dt className="capitalize text-cps-slate">{k.replace(/_/g, " ")}</dt>
                      <dd className="font-medium text-cps-navy">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-cps-slate">No published specifications.</p>
              )}
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">On-site details</h2>
            </CardHeader>
            <CardBody>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cps-slate">Status</dt>
                  <dd>
                    <StatusBadge status={openReturn ? "REQUESTED" : "ON_SITE"} label={openReturn ? "Pickup requested" : "On Site"} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cps-slate">On site since</dt>
                  <dd className="font-medium text-cps-navy">{fmtDate(assignment.startDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cps-slate">Expected return</dt>
                  <dd className="font-medium text-cps-navy">{fmtDate(assignment.expectedEndDate)}</dd>
                </div>
                {assignment.request && (
                  <div className="flex justify-between">
                    <dt className="text-cps-slate">From request</dt>
                    <dd className="font-medium text-cps-navy">{assignment.request.requestNumber}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 text-xs text-cps-slate">
                CPS manages the specific unit and its maintenance history internally.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
