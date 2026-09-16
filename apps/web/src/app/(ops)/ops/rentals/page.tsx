import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { RateWarning } from "@/components/ui/RateWarning";
import { fmtDate, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OpsRentalsPage() {
  const rentals = await prisma.externalRental.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: true,
      vendor: true,
      request: true,
    },
  });

  return (
    <>
      <PageHeader title="External Rentals" subtitle="Equipment sourced from third-party vendors" />

      <RateWarning className="mb-4" />

      {rentals.length === 0 ? (
        <EmptyState icon="🏢" title="No external rentals" message="No third-party rentals have been recorded." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Description</TH>
              <TH>Project</TH>
              <TH>Vendor</TH>
              <TH>Request</TH>
              <TH>PO #</TH>
              <TH>Daily Rate</TH>
              <TH>Est. Cost</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {rentals.map((r) => (
              <TR key={r.id}>
                <TD>{r.description}</TD>
                <TD>{r.project.code}</TD>
                <TD>{r.vendor?.name ?? "—"}</TD>
                <TD>
                  {r.request ? (
                    <Link href={`/ops/requests/${r.requestId}`} className="font-mono text-cps-blue hover:underline">
                      {r.request.requestNumber}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TD>
                <TD className="font-mono">{r.poNumber ?? "—"}</TD>
                <TD>{money(r.dailyRate)}</TD>
                <TD>{money(r.estimatedCost)}</TD>
                <TD>
                  <StatusBadge status={r.actualEndDate ? "COMPLETE" : "ACTIVE"} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
