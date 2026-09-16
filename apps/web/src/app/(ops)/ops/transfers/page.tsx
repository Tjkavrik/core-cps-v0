import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OpsTransfersPage() {
  const transfers = await prisma.assetTransfer.findMany({
    orderBy: { initiatedAt: "desc" },
    include: {
      asset: { include: { class: true } },
      fromLocation: true,
      toLocation: true,
    },
  });

  return (
    <>
      <PageHeader title="Transfers" subtitle="Asset movements between locations and projects" />

      {transfers.length === 0 ? (
        <EmptyState icon="🔄" title="No transfers" message="No asset transfers have been recorded." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset</TH>
              <TH>Class</TH>
              <TH>From</TH>
              <TH>To</TH>
              <TH>Initiated</TH>
              <TH>Completed</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {transfers.map((t) => (
              <TR key={t.id}>
                <TD>
                  <Link href={`/ops/assets/${t.assetId}`} className="font-mono text-cps-blue hover:underline">
                    {t.asset.assetNumber}
                  </Link>
                </TD>
                <TD>{t.asset.class.name}</TD>
                <TD>{t.fromLocation?.name ?? "—"}</TD>
                <TD>{t.toLocation?.name ?? "—"}</TD>
                <TD>{fmtDate(t.initiatedAt)}</TD>
                <TD>{fmtDate(t.completedAt)}</TD>
                <TD>
                  <StatusBadge status={t.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
