"use client";

import { Check, Languages } from "lucide-react";
import { LANG_META } from "@/lib/mock-data";
import type { Lang } from "@/types";
import { cn } from "@/lib/utils";

export interface LanguageSelectorProps {
  value: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div>
      <div
        className="grid gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Choose your language"
      >
        {(Object.keys(LANG_META) as Lang[]).map((lang) => {
          const meta = LANG_META[lang];
          const selected = value === lang;
          return (
            <button
              key={lang}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(lang)}
              className={cn(
                "group relative flex items-center justify-between gap-4 rounded-xl border p-5 text-left transition-all duration-200 sm:p-6 cursor-pointer",
                selected
                  ? "border-teal bg-teal-wash shadow-[0_14px_34px_-24px_rgba(46,107,94,0.65)] ring-1 ring-teal"
                  : "border-line bg-cream hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_14px_30px_-26px_rgba(35,34,28,0.5)]"
              )}
            >
              <div>
                <span
                  className={cn(
                    "block font-display text-[26px] font-semibold leading-tight tracking-tight sm:text-3xl",
                    selected ? "text-teal-deep" : "text-ink"
                  )}
                >
                  {meta.native}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {lang === "en" ? "English" : "Hindi"} · {meta.short}
                </span>
              </div>

              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                  selected
                    ? "border-teal bg-teal text-cream"
                    : "border-line-strong bg-transparent text-transparent group-hover:border-teal/50"
                )}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 flex items-center gap-2 text-[13px] font-medium text-ink-soft">
        <Languages className="h-4 w-4 shrink-0 text-cobalt" />
        You&rsquo;ll see your conversation in your preferred language.
      </p>
    </div>
  );
}
