/**
 * Standard warning shown wherever rates appear. Rates in this prototype are
 * fictional/sample values only (see docs/open-questions.md — Rates & Billing).
 */
export function RateWarning({ className }: { className?: string }) {
  return (
    <div
      className={
        "rounded-md border border-cps-orange/30 bg-cps-orange/10 px-3 py-2 text-xs font-medium text-cps-orange " +
        (className ?? "")
      }
    >
      ⚠ SAMPLE RATES ONLY — Not actual CORE rates. Rate methodology to be established.
    </div>
  );
}

export default RateWarning;
