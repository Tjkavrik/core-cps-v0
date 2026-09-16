/**
 * Non-dismissible prototype warning banner. Rendered at the very top of every
 * authenticated experience AND the login page. Intentionally cannot be closed.
 */
export function DemoBanner() {
  return (
    <div className="w-full bg-cps-orange px-4 py-1.5 text-center text-xs font-medium text-white sm:text-sm">
      ⚠ PROTOTYPE — V0.1 | Demo data only. Not for production use.
    </div>
  );
}

export default DemoBanner;
