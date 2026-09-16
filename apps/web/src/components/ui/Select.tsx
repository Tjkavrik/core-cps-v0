import { clsx } from "clsx";
import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={clsx(
          "block w-full rounded-md border border-cps-gray200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-cps-blue focus:outline-none focus:ring-1 focus:ring-cps-blue disabled:bg-slate-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

export default Select;
