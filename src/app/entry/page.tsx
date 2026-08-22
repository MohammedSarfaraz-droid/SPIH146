"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowShell } from "@/components/layout/flow-shell";
import { IdentityCard } from "@/components/features/flow/identity-card";
import { useSessionIdentity } from "@/hooks/use-session-identity";

function EntryContent() {
  const router = useRouter();
  const { peerId, shufflePeerId } = useSessionIdentity();

  const handleContinue = () => {
    router.push(`/language?peerId=${peerId}`);
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <FlowShell step={1} onExit={handleExit}>
      <div className="fade-up w-full max-w-md text-center">
        <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
          You don&rsquo;t need to tell us{" "}
          <span className="text-teal-deep">who you are.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          Start with a temporary anonymous identity. No name, profile photo or
          public account is required.
        </p>

        <div className="mt-9 text-left">
          <IdentityCard peerId={peerId} onShuffle={shufflePeerId} />
        </div>

        <Button size="lg" className="mt-7 w-full" onClick={handleContinue}>
          Continue anonymously
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>

        <p className="mt-4 flex items-center justify-center gap-2 text-[12.5px] font-medium text-ink-faint">
          <Lock className="h-3.5 w-3.5 text-teal" />
          Your identity will not be shown to the person you chat with.
        </p>
      </div>
    </FlowShell>
  );
}

export default function EntryPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-paper font-mono text-xs text-ink-faint">Loading anonymous session...</div>}>
      <EntryContent />
    </Suspense>
  );
}
