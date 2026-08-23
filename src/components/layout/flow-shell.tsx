import type { ReactNode } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import type { FlowStep } from "@/types";

const STEPS = ["Anonymous", "Language", "Topic", "Connect"];

export interface FlowShellProps {
  step: FlowStep;
  onExit?: () => void;
  exitHref?: string;
  children: ReactNode;
}

/**
 * Minimal chrome for the anonymous entry → language → connection flow.
 * Deliberately quieter than the marketing pages: no navbar, no footer.
 */
export function FlowShell({
  step,
  onExit,
  exitHref = "/",
  children,
}: FlowShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line/70 bg-paper/70">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-8">
          <Logo href="/" />
          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Exit
            </button>
          ) : (
            <Link
              href={exitHref}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              Exit
            </Link>
          )}
        </div>
      </header>

      {/* Step progress rail */}
      <div className="mx-auto w-full max-w-3xl px-5 pt-8 sm:px-8">
        <ol className="flex items-center gap-2" aria-label="Progress">
          {STEPS.map((label, i) => {
            const n = (i + 1) as FlowStep;
            const state = n < step ? "done" : n === step ? "active" : "todo";
            return (
              <li
                key={label}
                className="flex flex-1 items-center gap-2 last:flex-none"
              >
                <span
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors",
                    state === "active" && "border-teal bg-teal-wash text-teal-deep",
                    state === "done" && "border-line bg-cream text-ink-faint",
                    state === "todo" && "border-line/70 text-ink-faint/70"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      state === "active" && "pulse-dot bg-teal",
                      state === "done" && "bg-line-strong",
                      state === "todo" && "bg-line"
                    )}
                  />
                  0{n} <span className="hidden min-[430px]:inline">{label}</span>
                </span>
                {n < 4 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px flex-1",
                      n < step ? "bg-teal/40" : "bg-line"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        {children}
      </main>
    </div>
  );
}
