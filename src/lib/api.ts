import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  BiText,
  ChatMessage,
  Helpline,
  Lang,
  ReportSubmission,
  SafetyCheckResult,
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
 * Asynchronously fetch verified emergency helplines.
 */
export async function getHelplines(): Promise<Helpline[]> {
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
 * Robust safety moderation classifier.
 * Evaluates message text against crisis, harmful advice, and abuse datasets.
 * Handles contractions, punctuation, mixed case, Hindi and Romanized Hinglish.
 */
export function evaluateSafety(rawText: string): SafetyCheckResult {
  if (!rawText || typeof rawText !== "string") {
    return { kind: null };
  }

  // 1. Unicode NFC normalization and lowercasing
  const text = rawText
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return { kind: null };
  }

  // 2. Cleaned text: remove apostrophes ("don't" -> "dont"), replace symbols with space
  const cleanText = text
    .replace(/['’`]/g, "")
    .replace(/[^\w\s\u0900-\u097F]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const matchesKeyword = (keyword: string) => {
    const normKey = keyword.toLowerCase().trim();
    const cleanKey = normKey
      .replace(/['’`]/g, "")
      .replace(/[^\w\s\u0900-\u097F]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!normKey || !cleanKey) return false;

    // Check direct substring in original or cleaned text
    if (text.includes(normKey) || cleanText.includes(cleanKey)) {
      return true;
    }

    // Word boundary check for single words (e.g. "kms", "suicide")
    if (!cleanKey.includes(" ") && cleanKey.length >= 3) {
      const regex = new RegExp(`(^|\\s)${cleanKey}($|\\s)`, "i");
      if (regex.test(cleanText)) {
        return true;
      }
    }

    return false;
  };

  // Crisis detection (highest priority)
  const crisisMatch = CRISIS_KEYWORDS.find(matchesKeyword);
  if (crisisMatch) {
    return {
      kind: "crisis",
      matchedKeyword: crisisMatch,
    };
  }

  // Harmful advice detection (flag badge)
  const adviceMatch = HARMFUL_ADVICE_KEYWORDS.find(matchesKeyword);
  if (adviceMatch) {
    return {
      kind: "advice",
      matchedKeyword: adviceMatch,
    };
  }

  // Abuse detection
  const abuseMatch = ABUSE_KEYWORDS.find(matchesKeyword);
  if (abuseMatch) {
    return {
      kind: "abuse",
      matchedKeyword: abuseMatch,
    };
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
  try {
    const reportsRef = collection(db, "reports");

    await addDoc(reportsRef, {
      reason: payload.reason,
      peerId: payload.peerId,
      timestamp: payload.timestamp,
      createdAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to submit report:", error);

    return {
      success: false,
    };
  }
}

export async function createUserProfile({
  uid,
  anonymousId,
  language,
}: {
  uid: string;
  anonymousId: number;
  language: "en" | "hi";
}) {
  const userRef = doc(db, "users", uid);
  const existingUser = await getDoc(userRef);

  if (existingUser.exists()) {
    return existingUser.data();
  }

  const profile = {
    anonymousId,
    language,
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, profile);
  return profile;
}

export async function updateUserLanguage({
  uid,
  language,
}: {
  uid: string;
  language: "en" | "hi";
}) {
  const userRef = doc(db, "users", uid);

  await setDoc(
    userRef,
    {
      language,
    },
    { merge: true }
  );
}

/**
 * Matchmaking that supports BOTH multilingual (en <-> hi) and same-language (en <-> en, hi <-> hi).
 * Prioritizes opposite language first, then pairs with any waiting user.
 */
export async function findOrCreateMatch({
  uid,
  language,
  topic,
}: {
  uid: string;
  language: "en" | "hi";
  topic?: string;
}) {
  const waitingRef = collection(db, "waitingUsers");
  const snapshot = await getDocs(waitingRef);

  const oppositeLanguage = language === "en" ? "hi" : "en";

  const candidates = snapshot.docs.filter((docSnap) => {
    const data = docSnap.data();
    return data.uid !== uid && data.status === "waiting";
  });

  let otherDoc: typeof candidates[0] | undefined;

  if (topic) {
    /*
     * STRICT TOPIC MATCH: user chose a topic.
     * Only connect with someone who chose the SAME topic.
     * Prefer opposite language first, then same language.
     */
    otherDoc = candidates.find(
      (d) => d.data().topic === topic && d.data().language === oppositeLanguage
    );
    if (!otherDoc) {
      otherDoc = candidates.find((d) => d.data().topic === topic);
    }
    // No same-topic peer found → stay waiting. Do NOT fall back to random.
  } else {
    /*
     * NO TOPIC: user skipped.
     * Prefer others who also skipped (topic === null), then any user.
     */
    otherDoc = candidates.find(
      (d) => !d.data().topic && d.data().language === oppositeLanguage
    );
    if (!otherDoc) {
      otherDoc = candidates.find((d) => !d.data().topic);
    }
    if (!otherDoc) {
      otherDoc = candidates.find((d) => d.data().language === oppositeLanguage);
    }
    if (!otherDoc) {
      otherDoc = candidates[0];
    }
  }

  // Nobody is available yet. Register as waiting.
  if (!otherDoc) {
    await setDoc(doc(db, "waitingUsers", uid), {
      uid,
      language,
      topic: topic || null,
      status: "waiting",
      createdAt: serverTimestamp(),
    });

    return {
      status: "waiting" as const,
    };
  }

  const other = otherDoc.data();
  const chatRef = doc(collection(db, "chats"));

  // Create chat with actual languages of both users
  await setDoc(chatRef, {
    participants: [other.uid, uid],
    languages: {
      [other.uid]: other.language,
      [uid]: language,
    },
    topic: topic || other.topic || null,
    createdAt: serverTimestamp(),
  });

  // Mark the first user as matched
  await setDoc(
    doc(db, "waitingUsers", other.uid),
    {
      status: "matched",
      chatId: chatRef.id,
      matchedWith: uid,
    },
    { merge: true }
  );

  // Mark current user as matched
  await setDoc(
    doc(db, "waitingUsers", uid),
    {
      status: "matched",
      chatId: chatRef.id,
      matchedWith: other.uid,
    },
    { merge: true }
  );

  return {
    status: "matched" as const,
    chatId: chatRef.id,
    peerUid: other.uid,
  };
}

/**
 * Continuous match listener + proactive matcher
 */
export function listenForMatch(
  uid: string,
  onMatched: (chatId: string) => void,
  onError?: (error: Error) => void
) {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const check = async () => {
    if (stopped) return;

    try {
      const userRef = doc(db, "waitingUsers", uid);
      const snapshot = await getDoc(userRef);

      if (stopped) return;

      if (snapshot.exists()) {
        const data = snapshot.data();

        if (
          data.status === "matched" &&
          typeof data.chatId === "string"
        ) {
          onMatched(data.chatId);
          return;
        }
      }

      // Proactive check: see if another user joined while we were waiting
      const waitingRef = collection(db, "waitingUsers");
      const allWaiting = await getDocs(waitingRef);

      if (stopped) return;

      const myDocSnap = snapshot.exists() ? snapshot.data() : null;
      const myLang = myDocSnap?.language || "en";
      const oppositeLanguage = myLang === "en" ? "hi" : "en";

      const myTopic = myDocSnap?.topic || null;
      const myCandidates = allWaiting.docs.filter(
        (d) => d.id !== uid && d.data().status === "waiting"
      );

      let otherDoc: typeof myCandidates[0] | undefined;

      if (myTopic) {
        /*
         * Strict: only match with same-topic peer.
         * Prefer opposite language, then same language.
         */
        otherDoc = myCandidates.find(
          (d) => d.data().topic === myTopic && d.data().language === oppositeLanguage
        );
        if (!otherDoc) {
          otherDoc = myCandidates.find((d) => d.data().topic === myTopic);
        }
        // No same-topic peer → stay waiting
      } else {
        /*
         * No topic: prefer others who also skipped, then anyone.
         */
        otherDoc = myCandidates.find(
          (d) => !d.data().topic && d.data().language === oppositeLanguage
        );
        if (!otherDoc) {
          otherDoc = myCandidates.find((d) => !d.data().topic);
        }
        if (!otherDoc) {
          otherDoc = myCandidates.find((d) => d.data().language === oppositeLanguage);
        }
        if (!otherDoc) {
          otherDoc = myCandidates[0];
        }
      }

      if (otherDoc) {
        const other = otherDoc.data();
        const chatRef = doc(collection(db, "chats"));

        await setDoc(chatRef, {
          participants: [other.uid, uid],
          languages: {
            [other.uid]: other.language,
            [uid]: myLang,
          },
          topic: myTopic || other.topic || null,
          createdAt: serverTimestamp(),
        });

        await setDoc(
          doc(db, "waitingUsers", other.uid),
          { status: "matched", chatId: chatRef.id, matchedWith: uid },
          { merge: true }
        );

        await setDoc(
          doc(db, "waitingUsers", uid),
          { status: "matched", chatId: chatRef.id, matchedWith: other.uid },
          { merge: true }
        );

        onMatched(chatRef.id);
        return;
      }

      timer = setTimeout(check, 1000);
    } catch (error) {
      console.error("Match check error:", error);

      if (!stopped) {
        onError?.(
          error instanceof Error
            ? error
            : new Error("Match check failed")
        );

        timer = setTimeout(check, 2000);
      }
    }
  };

  check();

  return () => {
    stopped = true;

    if (timer) {
      clearTimeout(timer);
    }
  };
}

export async function cancelMatch(uid: string) {
  try {
    const waitingUserRef = doc(db, "waitingUsers", uid);
    await deleteDoc(waitingUserRef);
  } catch (error) {
    console.error("Cancel match failed:", error);
  }
}

export async function sendMessage({
  chatId,
  senderId,
  text,
  translation,
}: {
  chatId: string;
  senderId: string;
  text: string;
  translation?: string | null;
}) {
  const messagesRef = collection(
    db,
    "chats",
    chatId,
    "messages"
  );

  const safety = evaluateSafety(text);

  await addDoc(messagesRef, {
    senderId,
    text: text.trim(),
    translation: translation || null,
    safetyKind: safety.kind,
    createdAt: serverTimestamp(),
  });
}

export function listenToMessages(
  chatId: string,
  onMessages: (messages: any[]) => void
) {
  const messagesRef = collection(
    db,
    "chats",
    chatId,
    "messages"
  );

  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc")
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((messageDoc) => {
      const data = messageDoc.data();

      return {
        id: messageDoc.id,
        senderId: data.senderId,
        text: data.text,
        translation: data.translation || null,
        safetyKind: data.safetyKind || null,
        createdAt: data.createdAt,
      };
    });

    onMessages(messages);
  });
}