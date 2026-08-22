"use client";

import { useState } from "react";
import { EyeOff, Lock, RefreshCw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IdentityCardProps {
  peerId: number;
  onShuffle: () => void;
}

export function IdentityCard({ peerId, onShuffle }: IdentityCardProps) {
  const [spun, setSpun] = useState(false);

  const handleShuffle = () => {
    setSpun(true);
    onShuffle();
    window.setTimeout(() => setSpun(false), 500);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-cream shadow-[0_18px_50px_-30px_rgba(35,34,28,0.4)]">
      {/* concentric rings motif */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 text-teal-tint"
        viewBox="0 0 100 100"
        fill="none"
      >
        {[16, 26, 36, 46].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>

      <div className="relative p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-wash ring-1 ring-teal-tint">
            <EyeOff className="h-5 w-5 text-teal" />
          </div>
          <button
            type="button"
            onClick={handleShuffle}
            aria-label="Generate a new anonymous identity"
            title="Shuffle identity"
            className="group inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[11px] font-medium text-ink-soft transition-colors hover:border-teal hover:text-teal cursor-pointer"
          >
            <RefreshCw
              className={cn(
                "h-3 w-3 transition-transform duration-500",
                spun && "rotate-[360deg]"
              )}
            />
            shuffle
          </button>
        </div>

        <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          Temporary identity
        </p>
        <div className="mt-1 flex items-baseline gap-3">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
            Anonymous User
          </h3>
        </div>
        <p
          key={peerId}
          className="fade-up mt-1 font-mono text-3xl font-semibold tracking-tight text-teal"
        >
          #{peerId}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-dashed border-line pt-5">
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-soft">
            <Lock className="h-3.5 w-3.5 text-teal" />
            No personal details
          </p>
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" />
            Session-only
          </p>
        </div>
      </div>
    </div>
  );
}
