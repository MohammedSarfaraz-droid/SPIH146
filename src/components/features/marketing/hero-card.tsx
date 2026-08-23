"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { HERO_PAIRS } from "@/lib/mock-data";
import type { CardMessage } from "@/types";

const INITIAL_MESSAGES: CardMessage[] = [
  { id: 1, side: "user", text: HERO_PAIRS[0].en },
  { id: 2, side: "peer", text: HERO_PAIRS[0].hi, translation: HERO_PAIRS[0].en },
];

/**
 * The hero visual: a quietly looping anonymous conversation
 * between “Anonymous User” and “Anonymous Peer”, with live translation.
 */
export function HeroCard() {
  const [msgs, setMsgs] = useState<CardMessage[]>(INITIAL_MESSAGES);
  const [typing, setTyping] = useState(false);
  const idRef = useRef(10);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const push = (m: Omit<CardMessage, "id">) =>
      setMsgs((prev) => [...prev.slice(-2), { ...m, id: ++idRef.current }]);

    (async () => {
      await wait(1600);
      while (!cancelled) {
        for (const pair of HERO_PAIRS) {
          if (cancelled) return;
          push({ side: "user", text: pair.en });
          await wait(1100);
          if (cancelled) return;
          setTyping(true);
          await wait(1250);
          if (cancelled) return;
          setTyping(false);
          push({ side: "peer", text: pair.hi, translation: pair.en });
          await wait(2600);
        }
        if (cancelled) return;
        setMsgs([]);
        await wait(500);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative">
      {/* backdrop rings + wash */}
      <svg
        aria-hidden="true"
        className="spin-slow pointer-events-none absolute -right-10 -top-14 h-64 w-64 text-line-strong/60"
        viewBox="0 0 100 100"
        fill="none"
      >
        {[22, 32, 42].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="2 4"
          />
        ))}
      </svg>
      <div
        aria-hidden="true"
        className="breathe absolute -left-16 bottom-8 h-56 w-56 rounded-full bg-teal-tint/70 blur-2xl"
      />

      <div className="relative rounded-xl border border-line bg-cream shadow-[0_30px_70px_-40px_rgba(35,34,28,0.55)]">
        {/* card header */}
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-wash ring-1 ring-teal-tint">
              <EyeOff className="h-3.5 w-3.5 text-teal" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[13.5px] font-semibold tracking-tight text-ink">
                Anonymous conversation
              </p>
              <p className="text-[10.5px] font-medium text-ink-faint">
                2 people · no names · no profiles
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-wash px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-teal-deep">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
            Live
          </span>
        </div>

        {/* card body */}
        <div className="flex h-[330px] flex-col justify-end gap-3 overflow-hidden px-5 py-5 sm:h-[350px]">
          {msgs.map((m) =>
            m.side === "user" ? (
              <div key={m.id} className="msg-in flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-teal px-4 py-2.5 text-cream">
                  <p className="text-[13.5px] leading-relaxed tracking-tight">
                    {m.text}
                  </p>
                  <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cream/65">
                    Anonymous User · EN
                  </p>
                </div>
              </div>
            ) : (
              <div key={m.id} className="msg-in flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-2.5">
                  <p className="text-[13.5px] leading-relaxed tracking-tight text-ink">
                    {m.text}
                  </p>
                  {m.translation && (
                    <p className="mt-1.5 flex items-start gap-1 border-t border-dashed border-line pt-1.5 text-[11.5px] leading-relaxed text-cobalt">
                      <ArrowLeftRight className="mt-0.5 h-3 w-3 shrink-0" />
                      {m.translation}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-faint">
                    Anonymous Peer · हिं
                  </p>
                </div>
              </div>
            )
          )}

          {typing && (
            <div className="msg-in flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* card footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-medium text-ink-soft">
            <ArrowLeftRight className="h-3.5 w-3.5 text-cobalt" />
            EN ↔ हिन्दी · auto-translated
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-medium text-ink-soft">
            <Lock className="h-3.5 w-3.5 text-teal" />
            anonymous
          </span>
        </div>
      </div>

      {/* floating safety badge */}
      {/* <div
        className="fade-up absolute -bottom-5 -left-3 flex items-center gap-2 rounded-lg border border-line bg-cream px-3.5 py-2.5 shadow-[0_16px_36px_-24px_rgba(35,34,28,0.6)] sm:-left-8"
        style={{ animationDelay: "0.5s" }}
      >
        <ShieldCheck className="h-4 w-4 text-teal" />
        <div className="leading-tight">
          <p className="text-[11.5px] font-bold tracking-tight text-ink">
            Safety layer on
          </p>
          <p className="text-[10px] font-medium text-ink-faint">
            crisis · abuse · harmful advice
          </p>
        </div>
      </div> */}
    </div>
  );
}
