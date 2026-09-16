"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

type Role = { id: string; code: string; name: string };
type Project = { id: string; code: string; name: string };
type UserRow = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: { role: { code: string; name: string } }[];
  projectAccess: { project: { code: string }; revokedAt: string | null }[];
};

export function UserAdmin({
  users,
  roles,
  projects,
}: {
  users: UserRow[];
  roles: Role[];
  projects: Project[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [roleCodes, setRoleCodes] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, roleCodes, projectIds }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create user");
      setOpen(false);
      setEmail("");
      setName("");
      setPassword("");
      setRoleCodes([]);
      setProjectIds([]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(u: UserRow) {
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !u.isActive }),
    });
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>+ New User</Button>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Email</TH>
            <TH>Roles</TH>
            <TH>Projects</TH>
            <TH>Status</TH>
            <TH />
          </TR>
        </THead>
        <TBody>
          {users.map((u) => (
            <TR key={u.id}>
              <TD className="font-medium text-cps-navy">{u.name}</TD>
              <TD>{u.email}</TD>
              <TD>
                <div className="flex flex-wrap gap-1">
                  {u.roles.map((r) => (
                    <Badge key={r.role.code} color="blue">
                      {r.role.name}
                    </Badge>
                  ))}
                </div>
              </TD>
              <TD>
                {u.projectAccess.filter((p) => !p.revokedAt).map((p) => p.project.code).join(", ") || "All / None"}
              </TD>
              <TD>
                {u.isActive ? <Badge color="green">Active</Badge> : <Badge color="gray">Inactive</Badge>}
              </TD>
              <TD>
                <Button variant="secondary" size="sm" onClick={() => toggleActive(u)}>
                  {u.isActive ? "Deactivate" : "Activate"}
                </Button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy || !email || !name || !password}>
              {busy ? "Creating…" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div>
            <Label required>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <Label required>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@demo.cps" />
          </div>
          <div>
            <Label required>Temporary Password</Label>
            <Input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="demo1234" />
          </div>
          <div>
            <Label>Roles</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => toggle(roleCodes, r.code, setRoleCodes)}
                  className={
                    "rounded-full border px-3 py-1 text-xs font-medium " +
                    (roleCodes.includes(r.code)
                      ? "border-cps-blue bg-cps-blue text-white"
                      : "border-cps-gray200 bg-white text-cps-slate")
                  }
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Project Access</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(projectIds, p.id, setProjectIds)}
                  className={
                    "rounded-full border px-3 py-1 text-xs font-medium " +
                    (projectIds.includes(p.id)
                      ? "border-cps-blue bg-cps-blue text-white"
                      : "border-cps-gray200 bg-white text-cps-slate")
                  }
                >
                  {p.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserAdmin;
