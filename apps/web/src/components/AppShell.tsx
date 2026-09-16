"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { clsx } from "clsx";
import { DemoBanner } from "./ui/DemoBanner";

export type NavItem = { label: string; href: string; icon?: string; badgeKey?: string };

export function AppShell({
  title,
  nav,
  badges,
  children,
}: {
  title: string;
  nav: NavItem[];
  badges?: Record<string, number>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const roleLabel = user?.roles?.[0] ?? "";

  const NavLinks = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const count = item.badgeKey ? badges?.[item.badgeKey] : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-cps-blue text-white" : "text-slate-200 hover:bg-white/10"
            )}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span aria-hidden>{item.icon}</span>}
              {item.label}
            </span>
            {typeof count === "number" && count > 0 && (
              <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-cps-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      {/* Top bar */}
      <header className="flex items-center justify-between gap-2 bg-cps-navy px-4 py-2 text-white">
        <div className="flex items-center gap-2">
          <button
            className="rounded p-1 hover:bg-white/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <Link href="/" className="text-sm font-bold tracking-tight">
            CPS <span className="hidden font-normal text-slate-300 sm:inline">— Construction Project Services</span>
          </Link>
          <span className="ml-2 hidden rounded bg-white/10 px-2 py-0.5 text-xs text-slate-200 lg:inline">{title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {user && (
            <span className="hidden text-right sm:block">
              <span className="block font-medium">{user.name}</span>
              <span className="block text-slate-300">{roleLabel}</span>
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md border border-white/20 px-2.5 py-1 font-medium hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 bg-cps-navy px-3 py-4 md:block">{NavLinks}</aside>

        {/* Sidebar (mobile drawer) */}
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-60 bg-cps-navy px-3 py-4">{NavLinks}</aside>
          </div>
        )}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
