/**
 * Status vocabularies and display mappings.
 *
 * Two audiences:
 *  - CPS Operations sees full internal statuses.
 *  - Project users see a SIMPLIFIED, project-facing status (internal
 *    fulfillment detail is never surfaced to them).
 */

export type BadgeColor = "green" | "blue" | "yellow" | "orange" | "red" | "gray";

/** Maps any known status string to a badge color. */
export const STATUS_COLORS: Record<string, BadgeColor> = {
  // Asset statuses
  AVAILABLE: "green",
  ASSIGNED: "blue",
  IN_TRANSFER: "yellow",
  MAINTENANCE: "orange",
  OUT_OF_SERVICE: "red",
  RETIRED: "gray",
  // Request statuses
  DRAFT: "gray",
  SUBMITTED: "blue",
  UNDER_REVIEW: "yellow",
  APPROVED: "green",
  FULFILLING: "blue",
  PARTIALLY_FULFILLED: "yellow",
  FULFILLED: "green",
  CANCELLED: "red",
  ON_HOLD: "orange",
  // Return / delivery / transfer statuses
  REQUESTED: "yellow",
  SCHEDULED: "blue",
  IN_TRANSIT: "yellow",
  DELIVERED: "green",
  RECEIVED: "blue",
  INSPECTING: "yellow",
  COMPLETE: "green",
  COMPLETED: "green",
  PENDING: "gray",
  ACTIVE: "blue",
  RETURNED: "gray",
  TRANSFERRED: "gray",
};

export function statusColor(status: string | null | undefined): BadgeColor {
  if (!status) return "gray";
  return STATUS_COLORS[status] ?? "gray";
}

/** Human-friendly label for any status token (Title Case from SNAKE_CASE). */
export function humanizeStatus(status: string | null | undefined): string {
  if (!status) return "—";
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Internal request status -> simple project-facing label.
 * Project users must not see internal fulfillment nuance.
 */
const PROJECT_FACING_REQUEST_STATUS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Being Fulfilled",
  FULFILLING: "Being Fulfilled",
  PARTIALLY_FULFILLED: "Being Fulfilled",
  FULFILLED: "On Site",
  ON_HOLD: "Under Review",
  CANCELLED: "Cancelled",
};

export function projectFacingRequestStatus(status: string | null | undefined): string {
  if (!status) return "—";
  return PROJECT_FACING_REQUEST_STATUS[status] ?? humanizeStatus(status);
}
