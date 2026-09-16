import { clsx } from "clsx";
import type { LabelHTMLAttributes } from "react";

export function Label({
  className,
  children,
  required,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={clsx("mb-1 block text-sm font-medium text-slate-700", className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-red-600">*</span>}
    </label>
  );
}

export default Label;
