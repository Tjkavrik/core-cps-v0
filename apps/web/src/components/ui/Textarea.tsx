import { clsx } from "clsx";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "block w-full rounded-md border border-cps-gray200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cps-blue focus:outline-none focus:ring-1 focus:ring-cps-blue",
          className
        )}
        {...props}
      />
    );
  }
);

export default Textarea;
