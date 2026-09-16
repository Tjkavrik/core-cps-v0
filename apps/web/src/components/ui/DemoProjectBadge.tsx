/**
 * Small "DEMO" tag shown next to project names so fictional demo projects are
 * never mistaken for real CORE jobs.
 */
export function DemoProjectBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded bg-cps-orange/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cps-orange ring-1 ring-inset ring-cps-orange/30">
      Demo
    </span>
  );
}

export default DemoProjectBadge;
