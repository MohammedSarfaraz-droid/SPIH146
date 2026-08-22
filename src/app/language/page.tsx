"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowShell } from "@/components/layout/flow-shell";
import { LanguageSelector } from "@/components/features/flow/language-selector";
import { useSessionIdentity } from "@/hooks/use-session-identity";

function LanguageContent() {
  const router = useRouter();
  const { lang, peerId, setLang } = useSessionIdentity();

  const handleContinue = () => {
    router.push(`/connecting?lang=${lang}&peerId=${peerId}`);
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <FlowShell step={2} onExit={handleExit}>
      <div className="fade-up w-full max-w-xl text-center">
        <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
          Choose your <span className="text-teal-deep">language</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          Select the language you&rsquo;d like to use during your conversation.
        </p>

        <div className="mt-9 text-left">
          <LanguageSelector value={lang} onChange={setLang} />
        </div>

        <Button size="lg" className="mt-8 w-full" onClick={handleContinue}>
          Start Conversation
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>
    </FlowShell>
  );
}

export default function LanguagePage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-paper font-mono text-xs text-ink-faint">Loading language selection...</div>}>
      <LanguageContent />
    </Suspense>
  );
}
