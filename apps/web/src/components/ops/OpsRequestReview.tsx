"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Label } from "../ui/Label";
import { Modal } from "../ui/Modal";
import { Table, THead, TH, TBody, TR, TD } from "../ui/Table";
import { StatusBadge } from "../ui/StatusBadge";
import { fulfillmentLabel, FULFILLMENT_TYPES } from "@/lib/fulfillment";

const STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "FULFILLING",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "ON_HOLD",
  "CANCELLED",
];

export type LineItemView = {
  id: string;
  name: string;
  classId: string | null;
  quantity: number;
  unitNotes: string | null;
  fulfillmentType: string | null;
  status: string;
  assignedAssetNumbers: string[];
};

export type AssetOption = { id: string; assetNumber: string; classId: string; label: string };
export type VendorOption = { id: string; name: string };

export function OpsRequestReview({
  requestId,
  projectId,
  currentStatus,
  lineItems,
  availableAssets,
  vendors,
}: {
  requestId: string;
  projectId: string;
  currentStatus: string;
  lineItems: LineItemView[];
  availableAssets: AssetOption[];
  vendors: VendorOption[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // assign modal state
  const [assignLine, setAssignLine] = useState<LineItemView | null>(null);
  const [assignAssetId, setAssignAssetId] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<string>("CPS_OWNED");

  // rental modal state
  const [rentalOpen, setRentalOpen] = useState(false);
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [rentalDesc, setRentalDesc] = useState("");
  const [dailyRate, setDailyRate] = useState("");

  async function post(url: string, body: unknown, method = "POST") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Action failed");
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveStatus() {
    await post(`/api/ops/requests/${requestId}`, { status, note: note || null }, "PATCH");
    setNote("");
  }

  function openAssign(line: LineItemView) {
    setAssignLine(line);
    const match = availableAssets.find((a) => a.classId === line.classId);
    setAssignAssetId(match?.id ?? "");
    setFulfillmentType("CPS_OWNED");
  }

  async function confirmAssign() {
    if (!assignLine || !assignAssetId) {
      setError("Select an available asset");
      return;
    }
    const okDone = await post(`/api/ops/requests/${requestId}/assign`, {
      lineItemId: assignLine.id,
      assetId: assignAssetId,
      fulfillmentType,
    });
    if (okDone) setAssignLine(null);
  }

  async function confirmRental() {
    if (!rentalDesc) {
      setError("Description is required");
      return;
    }
    const okDone = await post(`/api/ops/rentals`, {
      projectId,
      vendorId,
      requestId,
      description: rentalDesc,
      dailyRate: dailyRate ? Number(dailyRate) : null,
      reasonCode: "CPS_NO_STOCK",
    });
    if (okDone) {
      setRentalOpen(false);
      setRentalDesc("");
      setDailyRate("");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-cps-navy">Review &amp; status</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Note (optional)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason / internal note" />
            </div>
          </div>
          <div>
            <Button onClick={saveStatus} disabled={busy}>
              Update status
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-cps-navy">Line items &amp; fulfillment</h2>
            <Button variant="outline" size="sm" onClick={() => setRentalOpen(true)}>
              + External rental
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {lineItems.length === 0 ? (
            <p className="text-sm text-cps-slate">This is a free-form request — no catalog line items.</p>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Equipment</TH>
                  <TH>Qty</TH>
                  <TH>Fulfillment</TH>
                  <TH>Assigned asset</TH>
                  <TH>Status</TH>
                  <TH />
                </TR>
              </THead>
              <TBody>
                {lineItems.map((li) => (
                  <TR key={li.id}>
                    <TD>{li.name}</TD>
                    <TD>{li.quantity}</TD>
                    <TD className="text-xs">{fulfillmentLabel(li.fulfillmentType)}</TD>
                    <TD className="font-mono text-xs">
                      {li.assignedAssetNumbers.length ? li.assignedAssetNumbers.join(", ") : "—"}
                    </TD>
                    <TD>
                      <StatusBadge status={li.status} />
                    </TD>
                    <TD>
                      {li.status !== "FULFILLED" && (
                        <Button size="sm" variant="outline" onClick={() => openAssign(li)}>
                          Assign
                        </Button>
                      )}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {error && <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      {/* Assign modal */}
      <Modal
        open={!!assignLine}
        onClose={() => setAssignLine(null)}
        title={`Assign asset — ${assignLine?.name ?? ""}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssignLine(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={confirmAssign} disabled={busy}>
              Assign
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Fulfillment type</Label>
            <Select value={fulfillmentType} onChange={(e) => setFulfillmentType(e.target.value)}>
              {FULFILLMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {fulfillmentLabel(t)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Available asset (matching class)</Label>
            <Select value={assignAssetId} onChange={(e) => setAssignAssetId(e.target.value)}>
              <option value="">— Select asset —</option>
              {availableAssets
                .filter((a) => !assignLine?.classId || a.classId === assignLine.classId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
            </Select>
            <p className="mt-1 text-xs text-cps-slate">Asset serials are CPS-internal and never shown to project users.</p>
          </div>
        </div>
      </Modal>

      {/* Rental modal */}
      <Modal
        open={rentalOpen}
        onClose={() => setRentalOpen(false)}
        title="Create external rental"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRentalOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={confirmRental} disabled={busy}>
              Create rental
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Vendor</Label>
            <Select value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={rentalDesc} onChange={(e) => setRentalDesc(e.target.value)} />
          </div>
          <div>
            <Label>Daily rate (sample only)</Label>
            <Input type="number" min={0} value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
            <p className="mt-1 text-xs text-cps-orange">
              ⚠ SAMPLE RATES ONLY — Not actual CORE rates. Rate methodology to be established.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default OpsRequestReview;
