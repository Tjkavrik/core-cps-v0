"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";

export function ReceiveReturnButton({ assetId, returnId }: { assetId: string; returnId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [condition, setCondition] = useState("GOOD");
  const [passed, setPassed] = useState("yes");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/ops/assets/${assetId}/receive-return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnId, condition, passed: passed === "yes", notes: notes || null }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Action failed");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Receive &amp; inspect
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Receive & inspect return"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy}>
              {busy ? "Saving…" : "Complete return"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <Label>Condition</Label>
            <Select value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="DAMAGED">Damaged</option>
              <option value="NEEDS_SERVICE">Needs Service</option>
            </Select>
          </div>
          <div>
            <Label>Inspection result</Label>
            <Select value={passed} onChange={(e) => setPassed(e.target.value)}>
              <option value="yes">Pass → returns to Available</option>
              <option value="no">Fail → moves to Maintenance</option>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
      </Modal>
    </>
  );
}

export default ReceiveReturnButton;
