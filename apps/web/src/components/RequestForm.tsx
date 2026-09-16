"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Label } from "./ui/Label";

export type ClassOption = { id: string; code: string; name: string; categoryName: string };
export type PhaseOption = { id: string; code: string; description: string | null };
export type LocationOption = { id: string; name: string };

type LineItem = { classId: string; quantity: number; unitNotes: string };

export function RequestForm({
  projectId,
  classes,
  phaseCodes,
  locations,
  initialClassId,
}: {
  projectId: string;
  classes: ClassOption[];
  phaseCodes: PhaseOption[];
  locations: LocationOption[];
  initialClassId?: string;
}) {
  const router = useRouter();
  const [phaseCodeId, setPhaseCodeId] = useState("");
  const [deliveryLocationId, setDeliveryLocationId] = useState(locations[0]?.id ?? "");
  const [neededDate, setNeededDate] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineItem[]>([
    { classId: initialClassId ?? classes[0]?.id ?? "", quantity: 1, unitNotes: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLine(i: number, patch: Partial<LineItem>) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, { classId: classes[0]?.id ?? "", quantity: 1, unitNotes: "" }]);
  }
  function removeLine(i: number) {
    setLines((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          phaseCodeId: phaseCodeId || null,
          deliveryLocationId: deliveryLocationId || null,
          neededDate: neededDate || null,
          expectedReturnDate: expectedReturnDate || null,
          notes: notes || null,
          lineItems: lines.filter((l) => l.classId).map((l) => ({
            classId: l.classId,
            quantity: Number(l.quantity) || 1,
            unitNotes: l.unitNotes || null,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to submit request");
      router.push(`/requests/${json.data.id}?project=${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-cps-navy">Request details</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phase">Phase / Cost Code</Label>
            <Select id="phase" value={phaseCodeId} onChange={(e) => setPhaseCodeId(e.target.value)}>
              <option value="">— Select phase —</option>
              {phaseCodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code}
                  {p.description ? ` — ${p.description}` : ""}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="loc">Delivery Location</Label>
            <Select id="loc" value={deliveryLocationId} onChange={(e) => setDeliveryLocationId(e.target.value)}>
              <option value="">— Select location —</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="needed" required>
              Needed By
            </Label>
            <Input
              id="needed"
              type="date"
              required
              value={neededDate}
              onChange={(e) => setNeededDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="return">Expected Return</Label>
            <Input
              id="return"
              type="date"
              value={expectedReturnDate}
              onChange={(e) => setExpectedReturnDate(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-cps-navy">Equipment</h2>
            <Button type="button" variant="outline" size="sm" onClick={addLine}>
              + Add item
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-md border border-cps-gray200 p-3 sm:grid-cols-12">
              <div className="sm:col-span-6">
                <Label>Equipment class</Label>
                <Select value={line.classId} onChange={(e) => updateLine(i, { classId: e.target.value })}>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}: {c.name} ({c.code})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                />
              </div>
              <div className="sm:col-span-3">
                <Label>Notes</Label>
                <Input value={line.unitNotes} onChange={(e) => updateLine(i, { unitNotes: e.target.value })} />
              </div>
              <div className="flex items-end sm:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLine(i)}
                  disabled={lines.length === 1}
                  aria-label="Remove item"
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Label htmlFor="notes">Additional notes for CPS</Label>
          <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </CardBody>
      </Card>

      {error && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit request"}
        </Button>
      </div>
    </form>
  );
}

export default RequestForm;
