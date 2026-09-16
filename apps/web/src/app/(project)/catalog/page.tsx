import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  const { active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  const categories = await prisma.equipmentCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { classes: true } } },
  });

  return (
    <>
      <PageHeader
        title="Browse Equipment"
        subtitle="Select a category to see available equipment classes. Serial/asset numbers are managed internally by CPS."
        breadcrumbs={[{ label: "Home", href: `/home${projectQ}` }, { label: "Browse Equipment" }]}
      />

      {categories.length === 0 ? (
        <EmptyState icon="🔧" title="No categories" message="The equipment catalog is empty." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog/${c.id}${projectQ}`} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardBody>
                  <div className="mb-2 text-2xl" aria-hidden>
                    🔧
                  </div>
                  <h3 className="font-semibold text-cps-navy group-hover:text-cps-blue">{c.name}</h3>
                  {c.description && <p className="mt-1 line-clamp-2 text-sm text-cps-slate">{c.description}</p>}
                  <p className="mt-3 text-xs font-medium text-cps-slate">{c._count.classes} equipment classes</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
