import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { landingRouteForRoles } from "@/lib/rbac";

/**
 * Root entry point. Redirects authenticated users to their role landing page,
 * unauthenticated users to the login screen. The V0.1 experiences themselves
 * live under the (project)/(ops)/(admin)/(viewer) route groups.
 */
export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect(landingRouteForRoles(user.roles));
}
