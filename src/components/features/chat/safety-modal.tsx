"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, LifeBuoy, PhoneCall } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { HELPLINES } from "@/lib/mock-data";

export interface SafetyModalProps {
  open: boolean;
  onClose: () => void;
}

export function SafetyModal({ open, onClose }: SafetyModalProps) {
  const [view, setView] = useState<"prompt" | "help">("prompt");

  const handleClose = () => {
    onClose();
    window.setTimeout(() => setView("prompt"), 250);
  };

  return (
    <Modal open={open} onClose={handleClose} labelledBy="safety-title">
      <div className="h-1.5 w-full bg-warm-line" aria-hidden="true" />
      <div className="p-6 sm:p-7">
        {view === "prompt" ? (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-tint ring-1 ring-warm-line">
              <LifeBuoy className="h-5 w-5 text-warm" />
            </span>
            <h2
              id="safety-title"
              className="mt-4 font-display text-[22px] font-semibold leading-snug tracking-tight text-ink"
            >
              We&rsquo;re concerned about what you&rsquo;re going through.
            </h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
              It sounds like you may be dealing with something serious.
              You&rsquo;re not alone. Consider reaching out to someone you trust
              or appropriate professional support.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button className="sm:flex-1" onClick={() => setView("help")}>
                Get Help
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                className="sm:flex-1"
                onClick={handleClose}
              >
                Continue Conversation
              </Button>
            </div>

            <p className="mt-4 text-center text-[11.5px] text-ink-faint">
              Your peer is not notified. This stays between you and SafeSpeak.
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setView("prompt")}
              className="inline-flex items-center gap-1.5 rounded-md text-[12.5px] font-semibold text-ink-soft transition-colors hover:text-ink cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-wash ring-1 ring-teal-tint">
              <PhoneCall className="h-5 w-5 text-teal" />
            </span>
            <h2 className="mt-4 font-display text-[22px] font-semibold tracking-tight text-ink">
              People who can help right now
            </h2>

            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-lg border border-line">
              {HELPLINES.map((h) => (
                <li key={h.name} className="bg-cream px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13.5px] font-bold tracking-tight text-ink">
                        {h.name}
                      </p>
                      <p className="text-[11.5px] text-ink-faint">{h.detail}</p>
                    </div>
                    <p className="shrink-0 font-mono text-[12px] font-semibold text-teal-deep">
                      {h.contact}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">
              In immediate danger? Please contact your local emergency services
              now.
            </p>

            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={handleClose}
            >
              Return to conversation
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
