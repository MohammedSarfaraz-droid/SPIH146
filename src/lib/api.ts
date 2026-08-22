import type {
  BiText,
  ChatMessage,
  Helpline,
  Lang,
  ReportSubmission,
  SafetyCheckResult,
  SafetyKind,
  ScriptedMessage,
} from "@/types";
import {
  ABUSE_KEYWORDS,
  CRISIS_KEYWORDS,
  HARMFUL_ADVICE_KEYWORDS,
  HELPLINES,
  HERO_PAIRS,
  PEER_REPLIES,
  SCRIPTED_CONVERSATION,
  peerLangOf,
} from "./mock-data";

/**
 * Backend-ready async data services.
 * In production, these will query REST endpoints, database tables, or ML inference APIs.
 */

/**
 * Asynchronously fetch verified emergency helplines.
 */
export async function getHelplines(): Promise<Helpline[]> {
  // Simulating async network boundary
  return Promise.resolve([...HELPLINES]);
}

/**
 * Asynchronously fetch hero animation dialog pairs.
 */
export async function getHeroPairs(): Promise<BiText[]> {
  return Promise.resolve([...HERO_PAIRS]);
}

/**
 * Asynchronously fetch scripted initial conversation messages formatted for a user language.
 */
export async function getInitialConversation(
  userLang: Lang
): Promise<ChatMessage[]> {
  const peerLang = peerLangOf(userLang);
  const now = Date.now();

  const messages: ChatMessage[] = SCRIPTED_CONVERSATION.map((m, i) => {
    const isUser = m.from === "user";
    const text = m.text[isUser ? userLang : peerLang];
    const translation = isUser ? undefined : m.text[userLang];
    const timeDate = new Date(
      now - (SCRIPTED_CONVERSATION.length - i) * 68_000
    );
    const time = timeDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: i + 1,
      side: m.from,
      text,
      translation,
      time,
    };
  });

  return Promise.resolve(messages);
}

/**
 * Safety moderation classifier.
 * Evaluates message text against crisis, abuse, and harmful advice rules.
 */
export function evaluateSafety(rawText: string): SafetyCheckResult {
  const text = rawText.toLowerCase().trim();

  const crisisMatch = CRISIS_KEYWORDS.find((k) => text.includes(k));
  if (crisisMatch) {
    return { kind: "crisis", matchedKeyword: crisisMatch };
  }

  const abuseMatch = ABUSE_KEYWORDS.find((k) => text.includes(k));
  if (abuseMatch) {
    return { kind: "abuse", matchedKeyword: abuseMatch };
  }

  const adviceMatch = HARMFUL_ADVICE_KEYWORDS.find((k) => text.includes(k));
  if (adviceMatch) {
    return { kind: "advice", matchedKeyword: adviceMatch };
  }

  return { kind: null };
}

/**
 * Simulated translation engine for peer reply.
 */
export async function getPeerResponse(
  replyIndex: number,
  userLang: Lang
): Promise<{ text: string; translation: string }> {
  const peerLang = peerLangOf(userLang);
  const reply = PEER_REPLIES[replyIndex % PEER_REPLIES.length];

  return Promise.resolve({
    text: reply[peerLang],
    translation: reply[userLang],
  });
}

/**
 * Submit an anonymous abuse/safety report.
 */
export async function submitReport(
  payload: ReportSubmission
): Promise<{ success: boolean }> {
  // In production, this dispatches to moderation queue
  return Promise.resolve({ success: true });
}
