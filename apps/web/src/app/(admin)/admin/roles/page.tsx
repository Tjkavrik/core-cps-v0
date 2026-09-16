import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { users: true } },
      permissions: { include: { permission: true } },
    },
  });

  return (
    <>
      <PageHeader title="Roles & Permissions" subtitle="Role definitions (read-only in V0.1)" />

      {roles.length === 0 ? (
        <EmptyState icon="🔐" title="No roles" message="No roles are configured." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Code</TH>
              <TH>Name</TH>
              <TH>Users</TH>
              <TH>Permissions</TH>
            </TR>
          </THead>
          <TBody>
            {roles.map((r) => (
              <TR key={r.id}>
                <TD className="font-mono">{r.code}</TD>
                <TD className="font-medium text-cps-navy">{r.name}</TD>
                <TD>{r._count.users}</TD>
                <TD>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.length === 0 ? (
                      <span className="text-cps-slate">—</span>
                    ) : (
                      r.permissions.map((p) => (
                        <Badge key={p.permission.id} color="blue">
                          {p.permission.code}
                        </Badge>
                      ))
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </>
  );
}
