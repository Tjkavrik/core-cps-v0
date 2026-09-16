import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";
import { fmtDate } from "@/lib/format";
import { humanizeStatus } from "@/lib/status";

export const dynamic = "force-dynamic";

export default async function OpsInspectionsPage() {
  const inspections = await prisma.inspection.findMany({
    orderBy: { inspectedAt: "desc" },
    include: {
      asset: { include: { class: true } },
      damageRecords: true,
    },
  });

  return (
    <>
      <PageHeader title="Inspections" subtitle="Condition checks and inspection history" />

      {inspections.length === 0 ? (
        <EmptyState icon="🔍" title="No inspections" message="No inspections have been recorded." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset</TH>
              <TH>Class</TH>
              <TH>Type</TH>
              <TH>Inspected</TH>
              <TH>Condition</TH>
              <TH>Meter</TH>
              <TH>Result</TH>
              <TH>Damage</TH>
            </TR>
          </THead>
          <TBody>
            {inspections.map((i) => (
              <TR key={i.id}>
                <TD>
                  <Link href={`/ops/assets/${i.assetId}`} className="font-mono text-cps-blue hover:underline">
                    {i.asset.assetNumber}
                  </Link>
                </TD>
                <TD>{i.asset.class.name}</TD>
                <TD>{humanizeStatus(i.type)}</TD>
                <TD>{fmtDate(i.inspectedAt)}</TD>
                <TD>{i.condition ? humanizeStatus(i.condition) : "—"}</TD>
                <TD>{i.meterReading != null ? `${i.meterReading} hrs` : "—"}</TD>
                <TD>
                  {i.passed == null ? (
                    <Badge color="gray">Pending</Badge>
                  ) : i.passed ? (
                    <Badge color="green">Passed</Badge>
                  ) : (
                    <Badge color="red">Failed</Badge>
                  )}
                </TD>
                <TD>{i.damageRecords.length > 0 ? <Badge color="orange">{i.damageRecords.length}</Badge> : "—"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
