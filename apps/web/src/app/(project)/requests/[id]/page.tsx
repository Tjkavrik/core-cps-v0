import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { projectsForUser } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { projectFacingRequestStatus } from "@/lib/status";
import { fmtDate, fmtDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const sp = await searchParams;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      project: true,
      phaseCode: true,
      deliveryLocation: true,
      lineItems: { include: { class: { include: { category: true } } } },
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });
  if (!request) notFound();

  // Access control: project users may only view requests for their projects.
  const allowed = await projectsForUser(user);
  if (!allowed.some((p) => p.id === request.projectId)) redirect("/home");

  const projectQ = `?project=${sp.project ?? request.projectId}`;

  return (
    <>
      <PageHeader
        title={request.requestNumber}
        subtitle={`${request.project.code} — ${request.project.name}`}
        breadcrumbs={[
          { label: "Home", href: `/home${projectQ}` },
          { label: "My Requests", href: `/requests${projectQ}` },
          { label: request.requestNumber },
        ]}
        actions={<StatusBadge status={request.status} label={projectFacingRequestStatus(request.status)} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">{request.isFreeForm ? "Your description" : "Requested equipment"}</h2>
            </CardHeader>
            <CardBody>
              {request.isFreeForm ? (
                <p className="whitespace-pre-wrap text-sm text-slate-700">{request.freeFormText}</p>
              ) : request.lineItems.length === 0 ? (
                <p className="text-sm text-cps-slate">No line items.</p>
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH>Category</TH>
                      <TH>Equipment</TH>
                      <TH>Qty</TH>
                      <TH>Notes</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {request.lineItems.map((li) => (
                      <TR key={li.id}>
                        <TD>{li.class?.category.name ?? "—"}</TD>
                        <TD>{li.class?.name ?? li.description ?? "—"}</TD>
                        <TD>{li.quantity}</TD>
                        <TD>{li.unitNotes ?? "—"}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Progress</h2>
            </CardHeader>
            <CardBody>
              <ol className="relative space-y-4 border-l border-cps-gray200 pl-6">
                {request.statusHistory.length === 0 && (
                  <li className="text-sm text-cps-slate">No status updates yet.</li>
                )}
                {request.statusHistory.map((h) => (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-cps-blue ring-4 ring-white" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cps-navy">
                        {projectFacingRequestStatus(h.status)}
                      </span>
                      <span className="text-xs text-cps-slate">{fmtDateTime(h.changedAt)}</span>
                    </div>
                    {h.notes && <p className="mt-0.5 text-xs text-cps-slate">{h.notes}</p>}
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-cps-navy">Details</h2>
            </CardHeader>
            <CardBody>
              <dl className="space-y-3 text-sm">
                <Detail label="Phase / Cost Code" value={request.phaseCode?.code ?? "—"} />
                <Detail label="Delivery Location" value={request.deliveryLocation?.name ?? "—"} />
                <Detail label="Needed By" value={fmtDate(request.neededDate)} />
                <Detail label="Expected Return" value={fmtDate(request.expectedReturnDate)} />
                <Detail label="Submitted" value={fmtDate(request.submittedAt ?? request.createdAt)} />
              </dl>
              {request.notes && (
                <div className="mt-4 rounded-md bg-cps-gray100 p-3 text-sm text-slate-700">
                  <p className="mb-1 font-medium text-cps-navy">Your notes</p>
                  {request.notes}
                </div>
              )}
              <p className="mt-4 text-xs text-cps-slate">
                Need this back sooner or have a question?{" "}
                <Link href={`/requests${projectQ}`} className="text-cps-blue hover:underline">
                  Contact CPS Operations
                </Link>
                .
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-cps-slate">{label}</dt>
      <dd className="text-right font-medium text-cps-navy">{value}</dd>
    </div>
  );
}
