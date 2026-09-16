import { clsx } from "clsx";

/**
 * Lightweight responsive table primitives. On small screens the table scrolls
 * horizontally inside its wrapper; ops screens also provide stacked card
 * fallbacks where noted.
 */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-cps-gray200 bg-white">
      <table className={clsx("w-full min-w-[640px] border-collapse text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-cps-gray100 text-left text-xs uppercase tracking-wide text-cps-slate">{children}</thead>;
}

export function TH({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={clsx("px-4 py-2.5 font-semibold", className)}>{children}</th>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-cps-gray200">{children}</tbody>;
}

export function TR({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr className={clsx(onClick && "cursor-pointer hover:bg-cps-gray100", className)} onClick={onClick}>
      {children}
    </tr>
  );
}

export function TD({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={clsx("px-4 py-2.5 align-middle text-slate-700", className)}>{children}</td>;
}

export default Table;
