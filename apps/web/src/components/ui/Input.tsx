import { clsx } from "clsx";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

const baseField =
  "block w-full rounded-md border border-cps-gray200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cps-blue focus:outline-none focus:ring-1 focus:ring-cps-blue disabled:bg-slate-50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={clsx(baseField, className)} {...props} />;
  }
);

export default Input;
