import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessPath, landingRouteForRoles } from "@/lib/rbac";
import { AppShell } from "@/components/AppShell";
import { ADMIN_NAV } from "@/lib/nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessPath(user.roles, "/admin")) redirect(landingRouteForRoles(user.roles));
  return (
    <AppShell title="Administration" nav={ADMIN_NAV}>
      {children}
    </AppShell>
  );
}
