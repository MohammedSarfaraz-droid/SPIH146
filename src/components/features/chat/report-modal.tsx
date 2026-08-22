"use client";

import { useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { REPORT_REASONS } from "@/lib/mock-data";
import { submitReport } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface ReportModalProps {
  open: boolean;
  peerId?: number;
  onClose: () => void;
}

export function ReportModal({ open, peerId = 4821, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    onClose();
    window.setTimeout(() => {
      setSent(false);
      setReason(null);
      setSubmitting(false);
    }, 250);
  };

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    await submitReport({
      reason,
      peerId,
      timestamp: Date.now(),
    });
    setSubmitting(false);
    setSent(true);
  };

  return (
    <Modal open={open} onClose={close} labelledBy="report-title">
      <div className="p-6 sm:p-7">
        {!sent ? (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-warm-tint ring-1 ring-warm-line">
              <Flag className="h-4.5 w-4.5 text-warm" />
            </span>
            <h2
              id="report-title"
              className="mt-4 font-display text-xl font-semibold tracking-tight"
            >
              Report this conversation
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
              Reports are anonymous. Your identity is never shared with the
              other person.
            </p>

            <div
              className="mt-4 space-y-2"
              role="radiogroup"
              aria-label="Reason"
            >
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={reason === r}
                  onClick={() => setReason(r)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-[13.5px] font-semibold transition-all cursor-pointer",
                    reason === r
                      ? "border-teal bg-teal-wash text-teal-deep ring-1 ring-teal"
                      : "border-line bg-cream text-ink hover:border-line-strong"
                  )}
                >
                  {r}
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border transition-colors",
                      reason === r
                        ? "border-teal bg-teal"
                        : "border-line-strong"
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={close}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!reason || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          </>
        ) : (
          <div className="py-2 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-teal" />
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight">
              Report received
            </h2>
            <p className="mx-auto mt-1.5 max-w-[30ch] text-[13.5px] leading-relaxed text-ink-soft">
              Thank you for helping keep this space safe. You can continue or
              leave the conversation.
            </p>
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={close}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
