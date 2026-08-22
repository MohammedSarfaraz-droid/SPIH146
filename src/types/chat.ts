import type { BiText } from "./language";

export type SafetyKind = "crisis" | "abuse" | "advice" | null;

export type MessageSide = "user" | "peer";

export interface ChatMessage {
  id: number;
  side: MessageSide;
  text: string;
  translation?: string | null;
  flaggedAdvice?: boolean;
  time: string;
}

export interface ScriptedMessage {
  from: MessageSide;
  text: BiText;
}

export interface CardMessage {
  id: number;
  side: MessageSide;
  text: string;
  translation?: string;
}

export interface Helpline {
  name: string;
  detail: string;
  contact: string;
}

export interface SafetyCheckResult {
  kind: SafetyKind;
  matchedKeyword?: string;
}

export interface ReportSubmission {
  reason: string;
  peerId: number;
  timestamp: number;
}
