import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPath, landingRouteForRoles } from "@/lib/rbac";
import { AppShell } from "@/components/AppShell";
import { VIEWER_NAV } from "@/lib/nav";

export default async function ViewerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessPath(user.roles, "/viewer")) redirect(landingRouteForRoles(user.roles));
  return (
    <AppShell title="Read-Only Viewer" nav={VIEWER_NAV}>
      {children}
    </AppShell>
  );
}
