"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  CloudRain,
  Flame,
  Ghost,
  Heart,
  MessageSquare,
  Moon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlowShell } from "@/components/layout/flow-shell";
import { useSessionIdentity } from "@/hooks/use-session-identity";
import { cn } from "@/lib/utils";

const TOPICS = [
  {
    id: "anxiety",
    label: "Anxiety",
    sub: "Worry, panic, overthinking",
    icon: Brain,
  },
  {
    id: "depression",
    label: "Depression",
    sub: "Sadness, low energy, hopelessness",
    icon: CloudRain,
  },
  {
    id: "stress",
    label: "Stress",
    sub: "Work, exams, life pressure",
    icon: Flame,
  },
  {
    id: "grief",
    label: "Grief & Loss",
    sub: "Loss of someone or something",
    icon: Heart,
  },
  {
    id: "relationships",
    label: "Relationships",
    sub: "Family, friends, romantic",
    icon: Users,
  },
  {
    id: "loneliness",
    label: "Loneliness",
    sub: "Feeling isolated or alone",
    icon: Moon,
  },
  {
    id: "trauma",
    label: "Trauma",
    sub: "Past experiences that hurt",
    icon: Ghost,
  },
  {
    id: "other",
    label: "Something Else",
    sub: "Any other topic",
    icon: MessageSquare,
  },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

function TopicContent() {
  const router = useRouter();
  const { lang, peerId } = useSessionIdentity();
  const [selected, setSelected] = useState<TopicId | null>(null);

  const handleContinue = () => {
    const topicParam = selected
      ? `&topic=${encodeURIComponent(selected)}`
      : "";
    router.push(`/connecting?lang=${lang}&peerId=${peerId}${topicParam}`);
  };

  const handleSkip = () => {
    router.push(`/connecting?lang=${lang}&peerId=${peerId}`);
  };

  const handleExit = () => {
    router.push("/");
  };

  const selectedTopic = TOPICS.find((t) => t.id === selected);

  return (
    <FlowShell step={3} onExit={handleExit}>
      <div className="fade-up w-full max-w-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.015em] text-ink">
            What would you like to{" "}
            <span className="text-teal-deep">talk about?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
            We&rsquo;ll try to match you with someone facing something similar.
            You can skip this if you prefer.
          </p>
        </div>

        {/* Topic grid */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {TOPICS.map((topic) => {
            const isSelected = selected === topic.id;
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(isSelected ? null : topic.id)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-teal bg-teal-wash ring-1 ring-teal shadow-[0_8px_24px_-16px_rgba(46,107,94,0.5)]"
                    : "border-line bg-cream hover:border-teal/40 hover:bg-teal-wash/40 hover:shadow-[0_6px_20px_-16px_rgba(35,34,28,0.35)]"
                )}
              >
                {/* Icon */}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200",
                    isSelected
                      ? "bg-teal/15 text-teal-deep"
                      : "bg-ink/5 text-ink-soft group-hover:bg-teal/10 group-hover:text-teal"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>

                {/* Text */}
                <div>
                  <span
                    className={cn(
                      "block font-display text-[13.5px] font-semibold leading-tight tracking-tight",
                      isSelected ? "text-teal-deep" : "text-ink"
                    )}
                  >
                    {topic.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] leading-snug text-ink-faint">
                    {topic.sub}
                  </span>
                </div>

                {/* Selected dot */}
                {isSelected && (
                  <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-teal" />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={!selected}
          >
            {selectedTopic
              ? `Continue — ${selectedTopic.label}`
              : "Select a topic to continue"}
            {selected && <ArrowRight className="h-4 w-4" strokeWidth={2.5} />}
          </Button>

          <button
            type="button"
            onClick={handleSkip}
            className="text-[13px] font-semibold text-ink-faint transition-colors hover:text-ink cursor-pointer"
          >
            Skip — connect me anonymously
          </button>
        </div>
      </div>
    </FlowShell>
  );
}

export default function TopicPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-paper font-mono text-xs text-ink-faint">
          Loading topic selection...
        </div>
      }
    >
      <TopicContent />
    </Suspense>
  );
}
