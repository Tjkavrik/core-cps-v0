import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Transfer", value: "IN_TRANSFER" },
  { label: "Maintenance", value: "MAINTENANCE" },
];

export default async function OpsAssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";

  const assets = await prisma.asset.findMany({
    where: status ? { status } : {},
    orderBy: { assetNumber: "asc" },
    include: { class: { include: { category: true } }, currentLocation: true, currentProject: true },
  });

  return (
    <>
      <PageHeader title="Assets" subtitle="CPS-owned fleet — internal asset register (demo data)" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = status === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/ops/assets?status=${f.value}` : "/ops/assets"}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                active ? "bg-cps-blue text-white" : "bg-white text-cps-slate ring-1 ring-cps-gray200 hover:bg-cps-gray100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {assets.length === 0 ? (
        <EmptyState icon="🚜" title="No assets" message="Nothing matches this filter." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Asset #</TH>
              <TH>Class</TH>
              <TH>Category</TH>
              <TH>Location</TH>
              <TH>Project</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {assets.map((a) => (
              <TR key={a.id}>
                <TD>
                  <Link href={`/ops/assets/${a.id}`} className="font-mono font-medium text-cps-blue hover:underline">
                    {a.assetNumber}
                  </Link>
                </TD>
                <TD>{a.class.name}</TD>
                <TD>{a.class.category.name}</TD>
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
