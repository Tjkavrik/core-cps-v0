/**
 * NextAuth configuration (prototype credentials provider).
 *
 * Portability note (ADR-004): the app depends on the AuthenticatedUser shape,
 * not on NextAuth specifics. This credentials provider can be replaced with an
 * enterprise OIDC/SAML provider later without touching feature code. Session
 * strategy is JWT so the prototype has no server-side session store dependency.
 */
import type { NextAuthOptions, getServerSession as _gss } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  projectIds: string[];
};

/**
 * Backwards-compatible alias for the portable auth boundary type
 * (see lib/auth/index.ts). Feature code depends on this shape, not on
 * NextAuth specifics.
 */
export type AuthenticatedUser = SessionUser;

async function loadUser(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      projectAccess: true,
    },
  });
  if (!user || !user.isActive || !user.passwordHash) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  const roles = user.roles.map((ur) => ur.role.code);
  const permissions = Array.from(
    new Set(user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code)))
  );
  const projectIds = user.projectAccess.filter((pa) => !pa.revokedAt).map((pa) => pa.projectId);

  return { id: user.id, email: user.email, name: user.name, roles, permissions, projectIds };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const u = await loadUser(credentials.email, credentials.password);
        if (!u) return null;
        // Returned object is persisted into the JWT via the jwt callback.
        return u as unknown as { id: string; email: string; name: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const su = user as unknown as SessionUser;
        token.id = su.id;
        token.roles = su.roles;
        token.permissions = su.permissions;
        token.projectIds = su.projectIds;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as SessionUser).id = token.id as string;
        (session.user as unknown as SessionUser).roles = (token.roles as string[]) ?? [];
        (session.user as unknown as SessionUser).permissions = (token.permissions as string[]) ?? [];
        (session.user as unknown as SessionUser).projectIds = (token.projectIds as string[]) ?? [];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/** Server-side helper: get the current authenticated user (or null). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as unknown as SessionUser;
}

// Re-export for convenience / typing.
export type ServerSessionGetter = typeof _gss;
