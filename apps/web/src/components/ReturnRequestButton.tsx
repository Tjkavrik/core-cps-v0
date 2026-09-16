"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Textarea } from "./ui/Textarea";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";

export function ReturnRequestButton({
  assignmentId,
  alreadyRequested,
}: {
  assignmentId: string;
  alreadyRequested?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/project/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, scheduledDate: scheduledDate || null, notes: notes || null }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to request pickup");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyRequested) {
    return (
      <Button variant="outline" disabled>
        Pickup requested
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Request pickup / return</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Request equipment pickup"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Submitting…" : "Request pickup"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-cps-slate">
            Let CPS know you&apos;re done with this equipment. They&apos;ll schedule pickup and inspection.
          </p>
          <div>
            <Label htmlFor="sd">Preferred pickup date</Label>
            <Input id="sd" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="rn">Notes (optional)</Label>
            <Textarea id="rn" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </div>
      </Modal>
    </>
  );
}

export default ReturnRequestButton;
