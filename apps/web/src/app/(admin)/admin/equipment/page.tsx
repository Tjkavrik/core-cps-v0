import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

export default async function AdminEquipmentPage() {
  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      classes: {
        orderBy: { name: "asc" },
        include: { _count: { select: { assets: true } } },
      },
    },
  });

  return (
    <>
      <PageHeader title="Equipment Catalog" subtitle="Categories and equipment classes (read-only in V0.1)" />

      {categories.length === 0 ? (
        <EmptyState icon="🔧" title="No categories" message="No equipment categories are configured." />
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-cps-navy">
                    {cat.name} <span className="font-mono text-xs text-cps-slate">({cat.code})</span>
                  </h2>
                  {!cat.isActive && <Badge color="gray">Inactive</Badge>}
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {cat.classes.length === 0 ? (
                  <p className="px-5 py-4 text-sm text-cps-slate">No classes in this category.</p>
                ) : (
                  <Table>
                    <THead>
                      <TR>
                        <TH>Code</TH>
                        <TH>Class Name</TH>
                        <TH>Assets</TH>
                        <TH>Status</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {cat.classes.map((cls) => (
                        <TR key={cls.id}>
                          <TD className="font-mono">{cls.code}</TD>
                          <TD>{cls.name}</TD>
                          <TD>{cls._count.assets}</TD>
                          <TD>
                            <Badge color={cls.isActive ? "green" : "gray"}>
                              {cls.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
