import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "paper" | "warm";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight select-none " +
  "transition-all duration-200 ease-out active:translate-y-px " +
  "disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-teal text-cream shadow-[0_1px_0_rgba(0,0,0,0.12),0_8px_20px_-12px_rgba(46,107,94,0.55)] " +
    "hover:bg-teal-deep hover:shadow-[0_1px_0_rgba(0,0,0,0.12),0_12px_26px_-12px_rgba(46,107,94,0.7)]",
  secondary:
    "border border-line-strong bg-transparent text-ink hover:border-teal hover:text-teal-deep hover:bg-teal-wash",
  ghost: "text-ink-soft hover:text-ink hover:bg-ink/5",
  paper: "bg-paper text-ink hover:bg-cream",
  warm: "bg-warm-tint text-warm border border-warm-line hover:bg-[#f2e5c4]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[13px] rounded-md",
  md: "h-11 px-5 text-sm rounded-md",
  lg: "h-[52px] px-7 text-[15px] rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
