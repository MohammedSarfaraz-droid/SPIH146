import { EyeOff, Flag, Languages, LogOut } from "lucide-react";
import { LANG_META } from "@/lib/mock-data";
import type { Lang } from "@/types";

export interface ChatHeaderProps {
  userLang: Lang;
  peerLang?: Lang;
  peerId?: number;
  onReport: () => void;
  onLeave: () => void;
}

export function ChatHeader({
  userLang,
  peerLang,
  peerId,
  onReport,
  onLeave,
}: ChatHeaderProps) {
  const effectivePeerLang = peerLang || (userLang === "en" ? "hi" : "en");
  const peer = LANG_META[effectivePeerLang];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-wash ring-1 ring-teal-tint">
            <EyeOff className="h-[18px] w-[18px] text-teal" />
            <span className="pulse-dot absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-cream bg-teal" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[15.5px] font-semibold tracking-tight text-ink">
              Anonymous Peer {peerId ? `(#${peerId})` : ""}
            </p>
            <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint">
              <span className="font-semibold text-teal">Connected</span>
              <span aria-hidden="true">·</span>
              <span className="hidden truncate sm:inline">
                Anonymous conversation
              </span>
              <span className="truncate sm:hidden">Anonymous</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] font-medium text-ink-soft md:inline-flex">
            <Languages className="h-3.5 w-3.5 text-cobalt" />
            {userLang === effectivePeerLang
              ? LANG_META[userLang].native
              : `${LANG_META[userLang].native} ↔ ${peer.native}`}
          </span>

          <button
            type="button"
            onClick={onReport}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:bg-warm-tint hover:text-warm sm:px-3 cursor-pointer"
          >
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            type="button"
            onClick={onLeave}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-2.5 text-[12.5px] font-semibold text-ink-soft transition-colors hover:border-[#c8bfa8] hover:bg-paper hover:text-ink sm:px-3 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>
    </header>
  );
}
