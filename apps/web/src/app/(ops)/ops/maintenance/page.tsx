import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fmtDate } from "@/lib/format";
import { humanizeStatus } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function OpsMaintenancePage() {
  const records = await prisma.maintenanceRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: { asset: { include: { class: true } } },
  });

  const open = records.filter((r) => !["COMPLETE", "CLOSED", "CANCELLED"].includes(r.status));
  const closed = records.filter((r) => ["COMPLETE", "CLOSED", "CANCELLED"].includes(r.status));

  return (
    <>
      <PageHeader title="Maintenance" subtitle="Service, repair, and maintenance work orders" />

      <h2 className="mb-3 text-lg font-semibold text-cps-navy">Open ({open.length})</h2>
      {open.length === 0 ? (
        <EmptyState icon="🛠️" title="No open work orders" message="No maintenance is currently in progress." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset</TH>
              <TH>Class</TH>
              <TH>Type</TH>
              <TH>Description</TH>
              <TH>Priority</TH>
              <TH>Scheduled</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {open.map((r) => (
              <TR key={r.id}>
                <TD>
                  <Link href={`/ops/assets/${r.assetId}`} className="font-mono text-cps-blue hover:underline">
                    {r.asset.assetNumber}
                  </Link>
                </TD>
                <TD>{r.asset.class.name}</TD>
                <TD>{humanizeStatus(r.type)}</TD>
                <TD className="max-w-xs truncate">{r.description}</TD>
                <TD>{r.priority ? humanizeStatus(r.priority) : "—"}</TD>
                <TD>{fmtDate(r.scheduledDate)}</TD>
                <TD>
                  <StatusBadge status={r.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {closed.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-semibold text-cps-navy">Completed ({closed.length})</h2>
          <Table>
            <THead>
              <TR>
                <TH>Asset</TH>
                <TH>Class</TH>
                <TH>Type</TH>
                <TH>Completed</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {closed.map((r) => (
                <TR key={r.id}>
                  <TD className="font-mono">{r.asset.assetNumber}</TD>
                  <TD>{r.asset.class.name}</TD>
                  <TD>{humanizeStatus(r.type)}</TD>
                  <TD>{fmtDate(r.completedAt)}</TD>
                  <TD>
                    <StatusBadge status={r.status} />
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
