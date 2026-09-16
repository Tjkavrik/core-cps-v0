import { clsx } from "clsx";
import type { BadgeColor } from "@/lib/status";

const COLORS: Record<BadgeColor, string> = {
  green: "bg-green-100 text-green-800 ring-green-600/20",
  blue: "bg-blue-100 text-blue-800 ring-blue-600/20",
  yellow: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
  orange: "bg-orange-100 text-orange-800 ring-orange-600/20",
  red: "bg-red-100 text-red-800 ring-red-600/20",
  gray: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

export function Badge({
  color = "gray",
  children,
  className,
}: {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        COLORS[color],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
