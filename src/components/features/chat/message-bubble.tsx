import { ArrowLeftRight, TriangleAlert } from "lucide-react";
import { LANG_META, peerLangOf } from "@/lib/mock-data";
import type { Lang, MessageSide } from "@/types";
import { cn } from "@/lib/utils";

/** Small secondary layer: “translated for the other side” (own messages). */
export function TranslationChip({ userLang }: { userLang: Lang }) {
  const peer = peerLangOf(userLang);
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-medium text-cobalt">
      <ArrowLeftRight className="h-3 w-3" />
      Translated to {LANG_META[peer].native} for your peer
    </span>
  );
}

/** Translation block shown under peer messages. */
export function TranslationBlock({ text }: { text: string }) {
  return (
    <div className="mt-2 border-l-2 border-cobalt/40 pl-3">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cobalt">
        Translation
      </p>
      <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}

export interface MessageBubbleProps {
  side: MessageSide;
  text: string;
  /** Translation of a peer message in the user's language */
  translation?: string | null;
  userLang: Lang;
  peerLang?: Lang;
  flaggedAdvice?: boolean;
  time: string;
}

export function MessageBubble({
  side,
  text,
  translation,
  userLang,
  peerLang,
  flaggedAdvice,
  time,
}: MessageBubbleProps) {
  const isUser = side === "user";
  const isMultilingual = peerLang ? peerLang !== userLang : true;

  return (
    <div
      className={cn(
        "msg-in flex w-full flex-col",
        isUser ? "items-end text-right" : "items-start text-left"
      )}
    >
      <div
        className={cn(
          "max-w-[86%] rounded-2xl px-4 py-3 text-left sm:max-w-[75%]",
          isUser
            ? "rounded-br-md bg-teal text-cream shadow-[0_10px_26px_-18px_rgba(35,84,73,0.9)]"
            : "rounded-bl-md border border-line bg-cream text-ink shadow-[0_10px_24px_-22px_rgba(35,34,28,0.6)]"
        )}
      >
        <p className="text-[14.5px] leading-relaxed tracking-tight">{text}</p>
        {translation && translation !== text ? (
          <TranslationBlock text={translation} />
        ) : null}
      </div>

      <div
        className={cn(
          "mt-1.5 flex items-center gap-2 px-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <span className="font-mono text-[10.5px] text-ink-faint">{time}</span>
        {isUser && !flaggedAdvice && isMultilingual ? (
          <TranslationChip userLang={userLang} />
        ) : null}
        {flaggedAdvice ? (
          <span className="inline-flex max-w-[260px] items-center gap-1 rounded-full border border-warm-line bg-warm-tint px-2 py-0.5 text-left text-[10.5px] font-semibold leading-snug text-warm">
            <TriangleAlert className="h-3 w-3 shrink-0" />
            This message may contain potentially harmful health advice.
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="msg-in flex items-start">
      <div className="rounded-2xl rounded-bl-md border border-line bg-cream px-4 py-3.5 shadow-[0_10px_24px_-22px_rgba(35,34,28,0.6)]">
        <span
          className="flex items-center gap-1.5"
          aria-label="Anonymous peer is typing"
        >
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-teal" />
        </span>
      </div>
    </div>
  );
}
