/**
 * Fulfillment type display labels.
 *
 * Backend enum values are stored as-is in the schema (CPS_OWNED, CPS_TRANSFER,
 * EXTERNAL, OTHER_DIRECT). These labels are for the CPS Operations UI only.
 *
 * IMPORTANT: Project users NEVER see fulfillment types — how a request is
 * fulfilled is an internal CPS decision made after review.
 */
export const FULFILLMENT_LABELS: Record<string, string> = {
  CPS_OWNED: "CPS Fleet",
  CPS_TRANSFER: "Transfer from Another Project/Location",
  EXTERNAL: "External Rental",
  OTHER_DIRECT: "Other / Direct",
};

export const FULFILLMENT_TYPES = ["CPS_OWNED", "CPS_TRANSFER", "EXTERNAL", "OTHER_DIRECT"] as const;

export function fulfillmentLabel(type: string | null | undefined): string {
  if (!type) return "—";
  return FULFILLMENT_LABELS[type] ?? type;
}
