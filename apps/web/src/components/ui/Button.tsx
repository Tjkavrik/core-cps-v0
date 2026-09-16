import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-cps-blue text-white hover:bg-blue-700 border border-transparent",
  secondary: "bg-cps-navy text-white hover:bg-slate-800 border border-transparent",
  ghost: "bg-transparent text-cps-slate hover:bg-cps-gray100 border border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
  outline: "bg-white text-cps-navy hover:bg-cps-gray100 border border-cps-gray200",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
}

export default Button;
