import { Badge } from "./Badge";
import { statusColor, humanizeStatus } from "@/lib/status";

/** Maps a raw status string to a color-coded badge with a humanized label. */
export function StatusBadge({ status, label }: { status: string | null | undefined; label?: string }) {
  return <Badge color={statusColor(status)}>{label ?? humanizeStatus(status)}</Badge>;
}

export default StatusBadge;
