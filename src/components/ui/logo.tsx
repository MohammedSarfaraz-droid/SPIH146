import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <circle cx="12.5" cy="16" r="9.5" fill="#2e6b5e" opacity="0.9" />
      <circle
        cx="19.5"
        cy="16"
        r="9.5"
        fill="#47688c"
        opacity="0.55"
        style={{ mixBlendMode: "multiply" }}
      />
      <path
        d="M16 11.2c1.5 1.2 2.3 2.8 2.3 4.8s-.8 3.6-2.3 4.8c-1.5-1.2-2.3-2.8-2.3-4.8s.8-3.6 2.3-4.8Z"
        fill="#f4f2ec"
      />
    </svg>
  );
}

export interface LogoProps {
  className?: string;
  onDark?: boolean;
  href?: string;
  onClick?: () => void;
}

export function Logo({
  className,
  onDark = false,
  href = "/",
  onClick,
}: LogoProps) {
  const content = (
    <>
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      <span
        className={cn(
          "font-display text-[19px] font-semibold tracking-tight",
          onDark ? "text-cream" : "text-ink"
        )}
      >
        Safe<span className="text-teal">Speak</span>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="SafeSpeak — home"
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-md cursor-pointer",
          className
        )}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label="SafeSpeak — home"
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-md",
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2.5 rounded-md", className)}>
      {content}
    </div>
  );
}
