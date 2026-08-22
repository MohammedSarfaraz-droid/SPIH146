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
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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
export function evaluateSafety(
  rawText: string
): SafetyCheckResult {
  const text = rawText
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return { kind: null };
  }

  const crisisMatch = CRISIS_KEYWORDS.find((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  if (crisisMatch) {
    return {
      kind: "crisis",
      matchedKeyword: crisisMatch,
    };
  }

  const abuseMatch = ABUSE_KEYWORDS.find((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  if (abuseMatch) {
    return {
      kind: "abuse",
      matchedKeyword: abuseMatch,
    };
  }

  const adviceMatch = HARMFUL_ADVICE_KEYWORDS.find((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  if (adviceMatch) {
    return {
      kind: "advice",
      matchedKeyword: adviceMatch,
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

export async function findOrCreateMatch({
  uid,
  language,
}: {
  uid: string;
  language: "en" | "hi";
}) {
  const waitingRef = collection(db, "waitingUsers");

  // Get all currently waiting users.
  // We intentionally avoid a compound Firestore query here
  // to keep the MVP simple and reliable.
  const snapshot = await getDocs(waitingRef);

  const oppositeLanguage = language === "en" ? "hi" : "en";

  // Find an opposite-language user who is actually waiting.
  const otherDoc = snapshot.docs.find((docSnap) => {
    const data = docSnap.data();

    return (
      data.uid !== uid &&
      data.language === oppositeLanguage &&
      data.status === "waiting"
    );
  });

  // Nobody available yet.
  if (!otherDoc) {
    await setDoc(doc(db, "waitingUsers", uid), {
      uid,
      language,
      status: "waiting",
      createdAt: serverTimestamp(),
    });

    return {
      status: "waiting" as const,
    };
  }

  const other = otherDoc.data();

  // Create chat room.
  const chatRef = doc(collection(db, "chats"));

  await setDoc(chatRef, {
    participants: [other.uid, uid],
    languages: {
      [other.uid]: other.language,
      [uid]: language,
    },
    createdAt: serverTimestamp(),
  });

  // Mark the first user as matched.
  await setDoc(
    doc(db, "waitingUsers", other.uid),
    {
      status: "matched",
      chatId: chatRef.id,
      matchedWith: uid,
    },
    { merge: true }
  );

  // Mark current user as matched.
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

// export function listenForMatch(
//   uid: string,
//   onMatched: (chatId: string) => void,
//   onError?: (error: Error) => void
// ) {
//   let stopped = false;
//   let timeoutId: ReturnType<typeof setTimeout> | null = null;

//   const checkMatch = async () => {
//     if (stopped) return;

//     try {
//       const waitingUserRef = doc(
//         db,
//         "waitingUsers",
//         uid
//       );

//       const snapshot = await getDoc(waitingUserRef);

//       if (stopped) return;

//       if (!snapshot.exists()) {
//         timeoutId = setTimeout(checkMatch, 1000);
//         return;
//       }

//       const data = snapshot.data();

//       if (
//         data.status === "matched" &&
//         typeof data.chatId === "string"
//       ) {
//         onMatched(data.chatId);
//         return;
//       }

//       timeoutId = setTimeout(checkMatch, 1000);
//     } catch (error) {
//       console.error("Match polling failed:", error);

//       if (!stopped) {
//         onError?.(
//           error instanceof Error
//             ? error
//             : new Error("Match polling failed")
//         );
//       }
//     }
//   };

//   checkMatch();

//   return () => {
//     stopped = true;

//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }
//   };
// }

// export async function findMyChat(uid: string) {
//   const chatsRef = collection(db, "chats");

//   const q = query(
//     chatsRef,
//     where("participants", "array-contains", uid),
//     limit(1)
//   );

//   const snapshot = await getDocs(q);

//   if (snapshot.empty) {
//     return null;
//   }

//   return snapshot.docs[0].id;
// }

// export function waitForMyChat(
//   uid: string,
//   onMatched: (chatId: string) => void,
//   onError?: (error: Error) => void
// ) {
//   let stopped = false;
//   let timeoutId: ReturnType<typeof setTimeout> | null = null;

//   const check = async () => {
//     if (stopped) return;

//     try {
//       const chatId = await findMyChat(uid);

//       if (stopped) return;

//       if (chatId) {
//         onMatched(chatId);
//         return;
//       }

//       timeoutId = setTimeout(check, 1000);
//     } catch (error) {
//       console.error("Checking for chat failed:", error);

//       if (!stopped) {
//         onError?.(
//           error instanceof Error
//             ? error
//             : new Error("Unable to check for chat")
//         );
//       }
//     }
//   };

//   check();

//   return () => {
//     stopped = true;

//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }
//   };
// }

export async function cancelMatch(uid: string) {
  const waitingUserRef = doc(db, "waitingUsers", uid);

  await deleteDoc(waitingUserRef);
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

      timer = setTimeout(check, 1000);
    } catch (error) {
      console.error("Match check failed:", error);

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