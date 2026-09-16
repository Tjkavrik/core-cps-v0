"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "./ui/Select";

export type ProjectOption = { id: string; code: string; name: string };

/**
 * Lets a project user switch the active demo project. Persists the choice via
 * the ?project=<id> query param so server components can read it.
 */
export function ProjectSwitcher({ projects, activeId }: { projects: ProjectOption[]; activeId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(id: string) {
    const next = new URLSearchParams(params.toString());
    next.set("project", id);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-cps-slate">Project:</span>
      <Select
        value={activeId}
        onChange={(e) => onChange(e.target.value)}
        className="w-auto min-w-[220px]"
        aria-label="Select active project"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.code} — {p.name}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default ProjectSwitcher;
