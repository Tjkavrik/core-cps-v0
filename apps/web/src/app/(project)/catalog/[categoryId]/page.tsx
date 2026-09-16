import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { categoryId } = await params;
  const sp = await searchParams;
  const { active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  const category = await prisma.equipmentCategory.findUnique({
    where: { id: categoryId },
    include: {
      classes: {
        where: { isActive: true },
        orderBy: { code: "asc" },
        include: { _count: { select: { assets: true } } },
      },
    },
  });
  if (!category) notFound();

  return (
    <>
      <PageHeader
        title={category.name}
        subtitle={category.description ?? undefined}
        breadcrumbs={[
          { label: "Home", href: `/home${projectQ}` },
          { label: "Browse Equipment", href: `/catalog${projectQ}` },
          { label: category.name },
        ]}
      />

      {category.classes.length === 0 ? (
        <EmptyState icon="📦" title="No equipment classes" message="This category has no classes yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {category.classes.map((cls) => (
            <Link key={cls.id} href={`/catalog/item/${cls.id}${projectQ}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardBody className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-cps-navy group-hover:text-cps-blue">{cls.name}</h3>
                    <p className="mt-0.5 font-mono text-xs text-cps-slate">{cls.code}</p>
                    {cls.description && <p className="mt-2 line-clamp-2 text-sm text-cps-slate">{cls.description}</p>}
                  </div>
                  <Badge color={cls._count.assets > 0 ? "green" : "gray"}>
                    {cls._count.assets > 0 ? "Available" : "Ask CPS"}
                  </Badge>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
