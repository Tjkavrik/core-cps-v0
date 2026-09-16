/**
 * Route protection middleware.
 *
 * - Unauthenticated users are redirected to /login.
 * - Authenticated users are checked against ROLE_ROUTES for the target path;
 *   if unauthorized they are redirected to their own landing route.
 *
 * NOTE: This is defense-in-depth for navigation UX. The authoritative
 * authorization check is ALWAYS performed server-side in the API routes.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessPath, landingRouteForRoles } from "@/lib/rbac";

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/health"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const roles = (token.roles as string[]) ?? [];

  if (!canAccessPath(roles, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = landingRouteForRoles(roles);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Protect everything except static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)$).*)"],
};
