import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { externalRentals: true } } },
  });

  return (
    <>
      <PageHeader title="Vendors" subtitle="Third-party rental vendors (demo data)" />

      {vendors.length === 0 ? (
        <EmptyState icon="🏢" title="No vendors" message="No vendors are configured." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Code</TH>
              <TH>Name</TH>
              <TH>Contact</TH>
              <TH>Phone</TH>
              <TH>Email</TH>
              <TH>Rentals</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {vendors.map((v) => (
              <TR key={v.id}>
                <TD className="font-mono">{v.code}</TD>
                <TD className="font-medium text-cps-navy">{v.name}</TD>
                <TD>{v.contactName ?? "—"}</TD>
                <TD>{v.phone ?? "—"}</TD>
                <TD>{v.email ?? "—"}</TD>
                <TD>{v._count.externalRentals}</TD>
                <TD>
                  <Badge color={v.isActive ? "green" : "gray"}>{v.isActive ? "Active" : "Inactive"}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
