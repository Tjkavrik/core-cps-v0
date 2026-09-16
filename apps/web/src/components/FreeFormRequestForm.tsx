"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Label } from "./ui/Label";

export type PhaseOption = { id: string; code: string; description: string | null };
export type LocationOption = { id: string; name: string };

export function FreeFormRequestForm({
  projectId,
  phaseCodes,
  locations,
}: {
  projectId: string;
  phaseCodes: PhaseOption[];
  locations: LocationOption[];
}) {
  const router = useRouter();
  const [phaseCodeId, setPhaseCodeId] = useState("");
  const [deliveryLocationId, setDeliveryLocationId] = useState(locations[0]?.id ?? "");
  const [neededDate, setNeededDate] = useState("");
  const [freeFormText, setFreeFormText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          isFreeForm: true,
          freeFormText,
          phaseCodeId: phaseCodeId || null,
          deliveryLocationId: deliveryLocationId || null,
          neededDate: neededDate || null,
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
          <h2 className="font-semibold text-cps-navy">Describe what you need</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <Label htmlFor="ff" required>
              What equipment or service do you need?
            </Label>
            <Textarea
              id="ff"
              rows={5}
              required
              placeholder="e.g. A 40-ft reach forklift for two weeks to unload steel on the north side…"
              value={freeFormText}
              onChange={(e) => setFreeFormText(e.target.value)}
            />
            <p className="mt-1 text-xs text-cps-slate">
              CPS Operations will review your description and follow up with options.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="phase">Phase / Cost Code</Label>
              <Select id="phase" value={phaseCodeId} onChange={(e) => setPhaseCodeId(e.target.value)}>
                <option value="">— Select —</option>
                {phaseCodes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="loc">Delivery Location</Label>
              <Select id="loc" value={deliveryLocationId} onChange={(e) => setDeliveryLocationId(e.target.value)}>
                <option value="">— Select —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="needed">Needed By</Label>
              <Input id="needed" type="date" value={neededDate} onChange={(e) => setNeededDate(e.target.value)} />
            </div>
          </div>
        </CardBody>
      </Card>

      {error && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit request"}
        </Button>
      </div>
    </form>
  );
}

export default FreeFormRequestForm;
