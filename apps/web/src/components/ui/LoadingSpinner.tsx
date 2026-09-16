import { clsx } from "clsx";

export function LoadingSpinner({ className, label = "Loading…" }: { className?: string; label?: string }) {
  return (
    <div className={clsx("flex items-center gap-2 text-sm text-cps-slate", className)} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cps-gray200 border-t-cps-blue" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
