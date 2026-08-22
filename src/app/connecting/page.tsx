"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  EyeOff,
  Languages,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlowShell } from "@/components/layout/flow-shell";
import { CYCLING_STATUS, LANG_META } from "@/lib/mock-data";
import { useSessionIdentity } from "@/hooks/use-session-identity";
import { cn } from "@/lib/utils";

import {
  findOrCreateMatch,
  listenForMatch,
  cancelMatch,
} from "@/lib/api";

function ConnectingContent() {
  const router = useRouter();

  const {
    lang,
    peerId,
    firebaseUser,
    authLoading,
  } = useSessionIdentity();

  const [chatId, setChatId] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  /*
   * Start matchmaking once Firebase authentication
   * is ready.
   */
  useEffect(() => {
    if (authLoading || !firebaseUser) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const startMatching = async () => {
      try {
        setMatchError(null);

        const result = await findOrCreateMatch({
          uid: firebaseUser.uid,
          language: lang,
        });

        if (cancelled) {
          return;
        }

        /*
         * If this user was the second person,
         * findOrCreateMatch creates the chat immediately.
         */
        if (result.status === "matched") {
          setChatId(result.chatId);
          setConnected(true);
          return;
        }

        /*
         * Otherwise this user is waiting.
         *
         * We listen ONLY to this user's own
         * waitingUsers/{uid} document.
         *
         * When another user matches with us,
         * that document becomes:
         *
         * status: "matched"
         * chatId: "..."
         */
        unsubscribe = listenForMatch(
          firebaseUser.uid,
          (matchedChatId) => {
            if (cancelled) {
              return;
            }

            setChatId(matchedChatId);
            setConnected(true);
          },
          (error) => {
            console.error(
              "Match listener error:",
              error
            );

            if (!cancelled) {
              setMatchError(
                "Unable to maintain the connection."
              );
            }
          }
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Matching failed:",
          error
        );

        setMatchError(
          "Unable to find a conversation right now."
        );
      }
    };

    startMatching();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [firebaseUser, authLoading, lang]);

  /*
   * Cycle the small status messages while waiting.
   */
  useEffect(() => {
    if (connected) {
      return;
    }

    const interval = window.setInterval(() => {
      setStatusIdx(
        (value) =>
          (value + 1) % CYCLING_STATUS.length
      );
    }, 1050);

    return () => {
      window.clearInterval(interval);
    };
  }, [connected]);

  const peer =
    LANG_META[lang === "en" ? "hi" : "en"];

  const chips = [
    {
      icon: EyeOff,
      label: "Anonymous",
    },
    {
      icon: Lock,
      label: "Private conversation",
    },
    {
      icon: Languages,
      label: `${LANG_META[lang].native} ↔ ${peer.native}`,
    },
  ];

  /*
   * Enter the actual chat room.
   */
  const handleEnter = () => {
    if (!chatId) {
      return;
    }

    router.push(
      `/chat?lang=${lang}&peerId=${peerId}&chatId=${chatId}`
    );
  };

  /*
   * Cancel matchmaking.
   */
  const handleCancel = async () => {
    if (firebaseUser) {
      try {
        await cancelMatch(firebaseUser.uid);
      } catch (error) {
        console.error(
          "Failed to cancel matching:",
          error
        );
      }
    }

    router.push(
      `/language?lang=${lang}&peerId=${peerId}`
    );
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <FlowShell
      step={3}
      onExit={handleExit}
    >
      <div className="fade-up flex w-full max-w-md flex-col items-center text-center">

        {/* Connection indicator */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          {!connected && (
            <>
              <span className="ripple-ring absolute inset-0 rounded-full border-2 border-teal/40" />

              <span
                className="ripple-ring absolute inset-0 rounded-full border-2 border-cobalt/30"
                style={{
                  animationDelay: "1.3s",
                }}
              />
            </>
          )}

          <div className="relative flex items-center">
            <span
              className={cn(
                "z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_14px_30px_-16px_rgba(46,107,94,0.7)] ring-4 ring-paper transition-all duration-700",
                connected
                  ? "breathe bg-teal text-cream"
                  : "drift-a bg-teal text-cream"
              )}
            >
              {connected ? (
                <Check
                  className="h-6 w-6"
                  strokeWidth={2.5}
                />
              ) : (
                <EyeOff className="h-6 w-6" />
              )}
            </span>

            <span
              className={cn(
                "-ml-5 flex h-12 w-12 items-center justify-center rounded-full bg-cobalt text-cream shadow-[0_14px_30px_-16px_rgba(71,104,140,0.7)] ring-4 ring-paper transition-all duration-700",
                connected
                  ? "scale-90 opacity-70"
                  : "drift-b"
              )}
            >
              <Languages className="h-5 w-5" />
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1
          key={connected ? "connected" : "searching"}
          className="fade-up mt-8 font-display text-[clamp(1.7rem,4.5vw,2.4rem)] font-bold leading-[1.08] tracking-[-0.015em] text-ink"
        >
          {connected ? (
            <>
              You&rsquo;re{" "}
              <span className="text-teal-deep">
                connected.
              </span>
            </>
          ) : (
            <>Connecting you to someone&hellip;</>
          )}
        </h1>

        <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          {connected
            ? "Your conversation is anonymous."
            : "Finding an available anonymous peer to start a conversation."}
        </p>

        {/* Searching status */}
        {!connected && !matchError && (
          <p
            key={statusIdx}
            className="fade-up mt-4 font-mono text-[11.5px] font-medium text-teal-deep"
            aria-live="polite"
          >
            {CYCLING_STATUS[statusIdx]}
          </p>
        )}

        {/* Error */}
        {matchError && (
          <p
            className="mt-4 max-w-sm text-[12.5px] font-medium text-warm"
            role="alert"
          >
            {matchError}
          </p>
        )}

        {/* Privacy / language chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {chips.map(
            ({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1.5 font-mono text-[11px] font-medium text-ink-soft"
              >
                <Icon className="h-3.5 w-3.5 text-teal" />
                {label}
              </span>
            )
          )}
        </div>

        {/* Actions */}
        <div className="mt-9 w-full">
          {connected ? (
            <>
              <Button
                size="lg"
                className="w-full"
                onClick={handleEnter}
              >
                Enter Conversation

                <ArrowRight
                  className="h-4 w-4"
                  strokeWidth={2.5}
                />
              </Button>

              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 w-full cursor-pointer rounded-md py-2 text-[13px] font-semibold text-ink-faint transition-colors hover:text-ink"
              >
                Not now — go back
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full cursor-pointer rounded-md border border-line bg-cream py-3.5 text-[14px] font-semibold text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </FlowShell>
  );
}

export default function ConnectingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-paper font-mono text-xs text-ink-faint">
          Connecting to peer space...
        </div>
      }
    >
      <ConnectingContent />
    </Suspense>
  );
}