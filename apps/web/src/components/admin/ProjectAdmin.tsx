"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TH, TBody, TR, TD } from "@/components/ui/Table";

type ProjectRow = {
  id: string;
  code: string;
  name: string;
  city: string | null;
  state: string | null;
  status: string;
  _count: { requests: number; userAccess: number; locations: number };
};

export function ProjectAdmin({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", name: "", city: "", state: "", description: "" });

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create project");
      setOpen(false);
      setForm({ code: "", name: "", city: "", state: "", description: "" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>+ New Project</Button>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Code</TH>
            <TH>Name</TH>
            <TH>Location</TH>
            <TH>Users</TH>
            <TH>Requests</TH>
            <TH>Status</TH>
          </TR>
        </THead>
        <TBody>
          {projects.map((p) => (
            <TR key={p.id}>
              <TD className="font-mono font-medium text-cps-navy">{p.code}</TD>
              <TD>{p.name}</TD>
              <TD>{[p.city, p.state].filter(Boolean).join(", ") || "—"}</TD>
              <TD>{p._count.userAccess}</TD>
              <TD>{p._count.requests}</TD>
              <TD>
                <Badge color={p.status === "ACTIVE" ? "green" : "gray"}>{p.status}</Badge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy || !form.code || !form.name}>
              {busy ? "Creating…" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <div>
            <Label required>Project Code</Label>
            <Input value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="DEMO-TX-001" />
          </div>
          <div>
            <Label required>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Demo Project" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Austin" />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="TX" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProjectAdmin;
