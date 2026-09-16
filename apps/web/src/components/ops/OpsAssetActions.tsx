"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";

type Action = "meter" | "maintain" | "damage" | "transfer" | "inspect" | null;

export type ProjectOption = { id: string; code: string; name: string };
export type LocationOption = { id: string; name: string };

export function OpsAssetActions({
  assetId,
  projects,
  locations,
}: {
  assetId: string;
  projects: ProjectOption[];
  locations: LocationOption[];
}) {
  const router = useRouter();
  const [action, setAction] = useState<Action>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(payload: unknown, actionPath: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/ops/assets/${assetId}/${actionPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Action failed");
      setAction(null);
      setForm({});
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setAction("meter")}>
          + Meter reading
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAction("inspect")}>
          + Inspection
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAction("maintain")}>
          + Maintenance
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAction("damage")}>
          + Damage
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAction("transfer")}>
          Transfer
        </Button>
      </div>

      <Modal
        open={action === "meter"}
        onClose={() => setAction(null)}
        title="Record meter reading"
        footer={<ModalFooter busy={busy} onCancel={() => setAction(null)} onConfirm={() => submit({ reading: Number(form.reading), unit: form.unit || "HOURS" }, "meter")} />}
      >
        <div className="space-y-3">
          <div>
            <Label>Reading</Label>
            <Input type="number" min={0} value={form.reading ?? ""} onChange={(e) => set("reading", e.target.value)} />
          </div>
          <div>
            <Label>Unit</Label>
            <Select value={form.unit ?? "HOURS"} onChange={(e) => set("unit", e.target.value)}>
              <option value="HOURS">Hours</option>
              <option value="MILES">Miles</option>
              <option value="KM">Kilometers</option>
            </Select>
          </div>
          {error && <Err msg={error} />}
        </div>
      </Modal>

      <Modal
        open={action === "inspect"}
        onClose={() => setAction(null)}
        title="Record inspection"
        footer={<ModalFooter busy={busy} onCancel={() => setAction(null)} onConfirm={() => submit({ type: form.type || "PERIODIC", condition: form.condition || "GOOD", passed: (form.passed ?? "yes") === "yes", notes: form.notes || null }, "inspect")} />}
      >
        <div className="space-y-3">
          <div>
            <Label>Condition</Label>
            <Select value={form.condition ?? "GOOD"} onChange={(e) => set("condition", e.target.value)}>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="NEEDS_SERVICE">Needs Service</option>
            </Select>
          </div>
          <div>
            <Label>Passed?</Label>
            <Select value={form.passed ?? "yes"} onChange={(e) => set("passed", e.target.value)}>
              <option value="yes">Pass</option>
              <option value="no">Fail</option>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={2} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          </div>
          {error && <Err msg={error} />}
        </div>
      </Modal>

      <Modal
        open={action === "maintain"}
        onClose={() => setAction(null)}
        title="Open maintenance"
        footer={<ModalFooter busy={busy} onCancel={() => setAction(null)} onConfirm={() => submit({ type: form.type || "CORRECTIVE", description: form.description, priority: form.priority || "NORMAL" }, "maintain")} />}
      >
        <div className="space-y-3">
          <div>
            <Label>Type</Label>
            <Select value={form.type ?? "CORRECTIVE"} onChange={(e) => set("type", e.target.value)}>
              <option value="PREVENTIVE">Preventive</option>
              <option value="CORRECTIVE">Corrective</option>
              <option value="INSPECTION">Inspection</option>
              <option value="REPAIR">Repair</option>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </div>
          {error && <Err msg={error} />}
        </div>
      </Modal>

      <Modal
        open={action === "damage"}
        onClose={() => setAction(null)}
        title="Record damage"
        footer={<ModalFooter busy={busy} onCancel={() => setAction(null)} onConfirm={() => submit({ description: form.description, severity: form.severity || "MINOR" }, "damage")} />}
      >
        <div className="space-y-3">
          <div>
            <Label>Severity</Label>
            <Select value={form.severity ?? "MINOR"} onChange={(e) => set("severity", e.target.value)}>
              <option value="MINOR">Minor</option>
              <option value="MODERATE">Moderate</option>
              <option value="MAJOR">Major</option>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </div>
          {error && <Err msg={error} />}
        </div>
      </Modal>

      <Modal
        open={action === "transfer"}
        onClose={() => setAction(null)}
        title="Initiate transfer"
        footer={<ModalFooter busy={busy} onCancel={() => setAction(null)} onConfirm={() => submit({ toProjectId: form.toProjectId || null, toLocationId: form.toLocationId || null, notes: form.notes || null }, "transfer")} />}
      >
        <div className="space-y-3">
          <div>
            <Label>Destination project</Label>
            <Select value={form.toProjectId ?? ""} onChange={(e) => set("toProjectId", e.target.value)}>
              <option value="">— None —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Destination location</Label>
            <Select value={form.toLocationId ?? ""} onChange={(e) => set("toLocationId", e.target.value)}>
              <option value="">— None —</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
          {error && <Err msg={error} />}
        </div>
      </Modal>
    </>
  );
}

function ModalFooter({ busy, onCancel, onConfirm }: { busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <>
      <Button variant="ghost" onClick={onCancel} disabled={busy}>
        Cancel
      </Button>
      <Button onClick={onConfirm} disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </Button>
    </>
  );
}

function Err({ msg }: { msg: string }) {
  return <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</div>;
}

export default OpsAssetActions;
