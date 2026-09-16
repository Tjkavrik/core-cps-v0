import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CatalogItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ classId: string }>;
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { classId } = await params;
  const sp = await searchParams;
  const { active } = await resolveActiveProject(user, sp.project);
  const projectQ = active ? `?project=${active.id}` : "";

  const cls = await prisma.equipmentClass.findUnique({
    where: { id: classId },
    include: {
      category: true,
      _count: { select: { assets: true } },
      relatedClasses: { include: { targetClass: true } },
    },
  });
  if (!cls) notFound();

  // Project users see equipment CLASS availability only — never asset serials.
  const availableCount = await prisma.asset.count({
    where: { classId: cls.id, status: "AVAILABLE" },
  });

  const specs = (cls.specifications as Record<string, unknown> | null) ?? null;

  return (
    <>
      <PageHeader
        title={cls.name}
        subtitle={cls.description ?? undefined}
        breadcrumbs={[
          { label: "Home", href: `/home${projectQ}` },
          { label: "Browse Equipment", href: `/catalog${projectQ}` },
          { label: cls.category.name, href: `/catalog/${cls.categoryId}${projectQ}` },
          { label: cls.name },
        ]}
        actions={
          <Link href={`/request/new?project=${active?.id ?? ""}&class=${cls.id}`}>
            <Button>Request this equipment</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-cps-navy">Specifications</h2>
                <span className="font-mono text-xs text-cps-slate">{cls.code}</span>
              </div>
            </CardHeader>
            <CardBody>
              {specs && Object.keys(specs).length > 0 ? (
                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-cps-gray200 py-1.5 text-sm">
                      <dt className="capitalize text-cps-slate">{k.replace(/_/g, " ")}</dt>
                      <dd className="font-medium text-cps-navy">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-cps-slate">No published specifications for this class.</p>
              )}
            </CardBody>
          </Card>

          {cls.relatedClasses.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <h2 className="font-semibold text-cps-navy">Commonly used with</h2>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {cls.relatedClasses.map((r) => (
                    <Link key={r.targetClassId} href={`/catalog/item/${r.targetClassId}${projectQ}`}>
                      <Badge color="blue">{r.targetClass.name}</Badge>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardBody className="text-center">
              <div className="text-3xl" aria-hidden>
                🏗️
              </div>
              <p className="mt-2 text-sm font-medium text-cps-navy">
                {availableCount > 0 ? "Available now" : "Availability confirmed after review"}
              </p>
              <p className="mt-1 text-xs text-cps-slate">
                CPS manages individual units. You request the equipment class; CPS assigns the specific unit.
              </p>
              <Link href={`/request/new?project=${active?.id ?? ""}&class=${cls.id}`} className="mt-4 block">
                <Button className="w-full">Request this equipment</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
