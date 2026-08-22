"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

import { SafetyModal } from "@/components/features/chat/safety-modal";
import { ReportModal } from "@/components/features/chat/report-modal";
import { ChatHeader } from "@/components/features/chat/chat-header";
import { MessageBubble } from "@/components/features/chat/message-bubble";

import { useSessionIdentity } from "@/hooks/use-session-identity";

import {
  evaluateSafety,
  listenToMessages,
  sendMessage,
} from "@/lib/api";

type FirestoreMessage = {
  id: string;
  senderId: string;
  text: string;
  translation?: string | null;
  safetyKind?: "crisis" | "abuse" | "advice" | null;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
};

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    lang,
    peerId,
    firebaseUser,
    authLoading,
  } = useSessionIdentity();

  const chatId = searchParams.get("chatId");

  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const [safetyOpen, setSafetyOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    if (authLoading || !firebaseUser || !chatId) {
      return;
    }

    const unsubscribe = listenToMessages(
      chatId,
      (newMessages) => {
        setMessages(newMessages);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser, authLoading, chatId]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = text.trim();

    if (
      !trimmed ||
      !firebaseUser ||
      !chatId ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      /*
       * Check the message locally before sending.
       */
      const safety = evaluateSafety(trimmed);

      /*
       * If crisis-related language is detected,
       * show the existing safety modal.
       *
       * We still allow the user to send the message.
       */
      if (safety.kind === "crisis") {
        setSafetyOpen(true);
      }

      /*
       * Translate the message into the peer's language.
       */
      const targetLang = lang === "en" ? "hi" : "en";

      let translatedText = trimmed;

      try {
        const translationResponse = await fetch(
          "/api/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: trimmed,
              from: lang,
              to: targetLang,
            }),
          }
        );

        if (translationResponse.ok) {
          const translationData =
            await translationResponse.json();

          translatedText =
            translationData.translation || trimmed;
        }
      } catch (translationError) {
        /*
         * Translation failure should NOT prevent
         * the message from being sent.
         */
        console.error(
          "Translation failed:",
          translationError
        );
      }

      /*
       * Save the message in Firestore.
       */
      await sendMessage({
        chatId,
        senderId: firebaseUser.uid,
        text: trimmed,
        translation: translatedText,
      });

      setText("");
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );
    } finally {
      setSending(false);
    }
  };

  const handleLeave = () => {
    router.push("/");
  };

  const handleReport = () => {
    setReportOpen(true);
  };

  /*
   * Conversation doesn't exist.
   */
  if (!chatId) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-paper px-6">
        <div className="text-center">
          <h1 className="font-display text-xl font-semibold text-ink">
            Conversation not found
          </h1>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 text-sm font-semibold text-teal"
          >
            Return home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-paper">

      <ChatHeader
        userLang={lang}
        peerId={peerId}
        onReport={handleReport}
        onLeave={handleLeave}
      />

      <div className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">

          <div className="flex-1 space-y-5 py-6">

            {messages.length === 0 ? (
              <div className="flex min-h-[45vh] items-center justify-center text-center">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    You're connected.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    Start the conversation when you're ready.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser =
                  message.senderId === firebaseUser?.uid;

                const time = message.createdAt
                  ? new Date(
                      message.createdAt.seconds * 1000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <MessageBubble
                    key={message.id}
                    side={isUser ? "user" : "peer"}
                    text={message.text}
                    translation={
                      isUser
                        ? undefined
                        : message.translation
                    }
                    userLang={lang}
                    flaggedAdvice={
                      message.safetyKind === "advice"
                    }
                    time={time}
                  />
                );
              })
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="sticky bottom-0 bg-paper pb-4 pt-2"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-cream p-2 shadow-[0_12px_30px_-24px_rgba(35,34,28,0.7)]">

              <input
                type="text"
                value={text}
                onChange={(event) =>
                  setText(event.target.value)
                }
                placeholder="Write a message..."
                disabled={sending}
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint"
              />

              <button
                type="submit"
                disabled={!text.trim() || sending}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>

            </div>

            <p className="mt-2 text-center font-mono text-[10px] text-ink-faint">
              Be respectful. This is an anonymous space.
            </p>
          </form>

        </div>
      </div>

      {/* Safety modal */}
      <SafetyModal
        open={safetyOpen}
        onClose={() => setSafetyOpen(false)}
      />

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        peerId={peerId}
        onClose={() => setReportOpen(false)}
      />

    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-paper font-mono text-xs text-ink-faint">
          Loading conversation...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}