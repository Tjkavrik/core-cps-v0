import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPath, landingRouteForRoles } from "@/lib/rbac";
import { AppShell } from "@/components/AppShell";
import { OPS_NAV } from "@/lib/nav";
import { prisma } from "@/lib/db";

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessPath(user.roles, "/ops")) redirect(landingRouteForRoles(user.roles));

  const [pendingRequests, returns, inspections] = await Promise.all([
    prisma.request.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.return.count({ where: { status: { in: ["REQUESTED", "SCHEDULED", "IN_TRANSIT"] } } }),
    prisma.return.count({ where: { status: { in: ["RECEIVED", "INSPECTING"] } } }),
  ]);

  return (
    <AppShell title="CPS Operations" nav={OPS_NAV} badges={{ pendingRequests, returns, inspections }}>
      {children}
    </AppShell>
  );
}
