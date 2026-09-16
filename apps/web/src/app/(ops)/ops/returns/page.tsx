import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { ReceiveReturnButton } from "@/components/ops/ReceiveReturnButton";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OpsReturnsPage() {
  const returns = await prisma.return.findMany({
    orderBy: { requestedAt: "desc" },
    include: { asset: { include: { class: true } }, request: { include: { project: true } } },
  });

  const open = returns.filter((r) => !["COMPLETE", "CANCELLED"].includes(r.status));
  const done = returns.filter((r) => ["COMPLETE", "CANCELLED"].includes(r.status));

  return (
    <>
      <PageHeader title="Returns" subtitle="Pickup requests, receiving, and inspection" />

      <h2 className="mb-3 text-lg font-semibold text-cps-navy">Open</h2>
      {open.length === 0 ? (
        <EmptyState icon="↩️" title="No open returns" message="Nothing awaiting pickup or inspection." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset</TH>
              <TH>Class</TH>
              <TH>Project</TH>
              <TH>Requested</TH>
              <TH>Scheduled</TH>
              <TH>Status</TH>
              <TH />
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
                <TD>{r.request?.project.code ?? "—"}</TD>
                <TD>{fmtDate(r.requestedAt)}</TD>
                <TD>{fmtDate(r.scheduledDate)}</TD>
                <TD>
                  <StatusBadge status={r.status} />
                </TD>
                <TD>
                  <ReceiveReturnButton assetId={r.assetId} returnId={r.id} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {done.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-lg font-semibold text-cps-navy">Completed</h2>
          <Table>
            <THead>
              <TR>
                <TH>Asset</TH>
                <TH>Class</TH>
                <TH>Completed</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {done.map((r) => (
                <TR key={r.id}>
                  <TD className="font-mono">{r.asset.assetNumber}</TD>
                  <TD>{r.asset.class.name}</TD>
                  <TD>{fmtDate(r.actualDate)}</TD>
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
