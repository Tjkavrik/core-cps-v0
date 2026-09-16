import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

export default async function AdminAssetsPage() {
  const assets = await prisma.asset.findMany({
    orderBy: { assetNumber: "asc" },
    include: {
      class: { include: { category: true } },
      currentProject: true,
      currentLocation: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Assets"
        subtitle="CPS-owned asset register — internal asset numbers are never shown to project users"
      />

      {assets.length === 0 ? (
        <EmptyState icon="🚜" title="No assets" message="No assets are registered." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset #</TH>
              <TH>Class</TH>
              <TH>Category</TH>
              <TH>Make / Model</TH>
              <TH>Location</TH>
              <TH>Project</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {assets.map((a) => (
              <TR key={a.id}>
                <TD>
                  <Link href={`/ops/assets/${a.id}`} className="font-mono text-cps-blue hover:underline">
                    {a.assetNumber}
                  </Link>
                </TD>
                <TD>{a.class.name}</TD>
                <TD>{a.class.category.name}</TD>
                <TD>{[a.make, a.model].filter(Boolean).join(" ") || "—"}</TD>
                <TD>{a.currentLocation?.name ?? "—"}</TD>
                <TD>{a.currentProject?.code ?? "—"}</TD>
                <TD>
                  <StatusBadge status={a.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
