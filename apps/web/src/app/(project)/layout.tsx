import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPath, landingRouteForRoles } from "@/lib/rbac";
import { AppShell } from "@/components/AppShell";
import { PROJECT_NAV } from "@/lib/nav";

export default async function ProjectLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessPath(user.roles, "/home")) redirect(landingRouteForRoles(user.roles));
  return (
    <AppShell title="Project" nav={PROJECT_NAV}>
      {children}
    </AppShell>
  );
}
