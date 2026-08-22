import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface PrivacySectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  index: string;
}

export function PrivacySection({
  icon: Icon,
  title,
  children,
  index,
}: PrivacySectionProps) {
  return (
    <section className="group grid gap-4 border-t border-line py-8 transition-colors sm:grid-cols-[180px_1fr] sm:gap-8">
      <div className="flex items-start gap-4 sm:block">
        <span className="font-mono text-[11px] font-semibold text-teal">
          {index}
        </span>
        <Icon
          className="h-5 w-5 shrink-0 text-teal transition-transform duration-300 group-hover:-translate-y-0.5"
          strokeWidth={1.8}
        />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {title}
        </h3>
        <div className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
          {children}
        </div>
      </div>
    </section>
  );
}
