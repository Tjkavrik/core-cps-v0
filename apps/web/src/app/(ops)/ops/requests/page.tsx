import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fulfillmentLabel } from "@/lib/fulfillment";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const FILTERS = [
  { label: "All", value: "" },
  { label: "New", value: "SUBMITTED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Fulfilling", value: "FULFILLING" },
  { label: "Fulfilled", value: "FULFILLED" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default async function OpsRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";

  const requests = await prisma.request.findMany({
    where: status ? { status } : {},
    orderBy: [{ status: "asc" }, { submittedAt: "desc" }],
    include: {
      project: true,
      phaseCode: true,
      assignedToUser: true,
      lineItems: true,
      _count: { select: { lineItems: true, assignments: true } },
    },
  });

  return (
    <>
      <PageHeader title="Requests" subtitle="Review, fulfill, and track equipment requests" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/ops/requests?status=${f.value}` : "/ops/requests"}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                active ? "bg-cps-blue text-white" : "bg-white text-cps-slate ring-1 ring-cps-gray200 hover:bg-cps-gray100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {requests.length === 0 ? (
        <EmptyState icon="📋" title="No requests" message="Nothing matches this filter." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Request #</TH>
              <TH>Project</TH>
              <TH>Items</TH>
              <TH>Fulfillment</TH>
              <TH>Needed</TH>
              <TH>Assigned to</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {requests.map((r) => {
              const types = Array.from(
                new Set(r.lineItems.map((li) => li.fulfillmentType).filter(Boolean) as string[])
              );
              return (
                <TR key={r.id}>
                  <TD>
                    <Link href={`/ops/requests/${r.id}`} className="font-medium text-cps-blue hover:underline">
                      {r.requestNumber}
                    </Link>
                  </TD>
                  <TD>{r.project.code}</TD>
                  <TD>{r.isFreeForm ? "Special" : r._count.lineItems}</TD>
                  <TD className="text-xs">
                    {types.length ? types.map((t) => fulfillmentLabel(t)).join(", ") : "—"}
                  </TD>
                  <TD>{fmtDate(r.neededDate)}</TD>
                  <TD>{r.assignedToUser?.name ?? "—"}</TD>
                  <TD>
                    <StatusBadge status={r.status} />
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </>
  );
}
