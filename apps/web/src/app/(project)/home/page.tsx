import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { resolveActiveProject } from "@/lib/projects";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DemoProjectBadge } from "@/components/ui/DemoProjectBadge";
import { ProjectSwitcher } from "@/components/ProjectSwitcher";
import { projectFacingRequestStatus } from "@/lib/status";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const ACTIONS = [
  {
    href: "/catalog",
    icon: "🔧",
    title: "Browse Equipment",
    desc: "Search the equipment catalog by category and request what you need.",
  },
  {
    href: "/request/new",
    icon: "➕",
    title: "Request Equipment",
    desc: "Build a request with quantities, dates, and delivery location.",
  },
  {
    href: "/requests",
    icon: "📋",
    title: "Track My Requests",
    desc: "See the status of everything you've requested for this project.",
  },
  {
    href: "/request/new/freeform",
    icon: "📝",
    title: "I Don't See What I Need",
    desc: "Describe something that isn't in the catalog and we'll help source it.",
  },
];

export default async function ProjectHomePage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sp = await searchParams;
  const { projects, active } = await resolveActiveProject(user, sp.project);

  if (!active) {
    return (
      <>
        <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} subtitle="Project equipment self-service" />
        <EmptyState
          icon="🏗️"
          title="No projects assigned"
          message="Your demo account has no project access yet. Contact CPS Operations."
        />
      </>
    );
  }

  const recent = await prisma.request.findMany({
    where: { projectId: active.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { phaseCode: true },
  });

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle="What do you need on site today?"
        actions={projects.length > 1 ? <ProjectSwitcher projects={projects} activeId={active.id} /> : undefined}
      />

      <div className="mb-6 flex items-center rounded-lg border border-cps-gray200 bg-white px-4 py-3 text-sm">
        <span className="font-medium text-cps-navy">
          {active.code} — {active.name}
        </span>
        <DemoProjectBadge />
        <span className="ml-auto text-cps-slate">
          {active.city}, {active.state}
        </span>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={`${a.href}?project=${active.id}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardBody className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden>
                  {a.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-cps-navy group-hover:text-cps-blue">{a.title}</h3>
                  <p className="mt-1 text-sm text-cps-slate">{a.desc}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-lg font-semibold text-cps-navy">Recent requests</h2>
      {recent.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No requests yet"
          message="When you request equipment it will show up here so you can track it."
        />
      ) : (
        <div className="space-y-2">
          {recent.map((r) => (
            <Link
              key={r.id}
              href={`/requests/${r.id}?project=${active.id}`}
              className="flex items-center justify-between rounded-lg border border-cps-gray200 bg-white px-4 py-3 text-sm hover:border-cps-blue"
            >
              <div>
                <span className="font-medium text-cps-navy">{r.requestNumber}</span>
                <span className="ml-2 text-cps-slate">
                  {r.isFreeForm ? "Special request" : r.phaseCode?.code ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden text-cps-slate sm:inline">Needed {fmtDate(r.neededDate)}</span>
                <StatusBadge status={r.status} label={projectFacingRequestStatus(r.status)} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
