import type {
  BiText,
  Helpline,
  Lang,
  LangMetaMap,
  ScriptedMessage,
} from "@/types";

/**
 * Metadata configuration for supported languages.
 */
export const LANG_META: LangMetaMap = {
  en: { native: "English", english: "English", short: "EN" },
  hi: { native: "हिन्दी", english: "Hindi", short: "हिं" },
};

/**
 * Returns the opposing peer's language given the user's selected language.
 */
export function peerLangOf(user: Lang): Lang {
  return user === "en" ? "hi" : "en";
}

/**
 * Generates a random 4-digit peer identity.
 */
export function randomPeerId(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

/**
 * Scripted opening conversation items.
 */
export const SCRIPTED_CONVERSATION: ScriptedMessage[] = [
  {
    from: "user",
    text: {
      en: "I've been feeling really stressed lately.",
      hi: "मैं इन दिनों बहुत तनाव में हूँ।",
    },
  },
  {
    from: "peer",
    text: {
      hi: "मुझे भी बहुत तनाव हो रहा है।",
      en: "I'm feeling very stressed too.",
    },
  },
  {
    from: "user",
    text: {
      en: "I don't really know who to talk to.",
      hi: "मुझे समझ नहीं आता कि मैं किससे बात करूँ।",
    },
  },
  {
    from: "peer",
    text: {
      hi: "कभी-कभी किसी अनजान व्यक्ति से बात करना आसान लगता है।",
      en: "Sometimes it feels easier to talk to someone you don't know.",
    },
  },
  {
    from: "peer",
    text: {
      hi: "क्या आपने इस बारे में किसी डॉक्टर से बात करने के बारे में सोचा है?",
      en: "Have you thought about talking to a doctor about this?",
    },
  },
  {
    from: "user",
    text: {
      en: "Maybe. I've been hesitant, honestly.",
      hi: "शायद। सच कहूँ तो मैं हिचकिचा रहा हूँ।",
    },
  },
  {
    from: "peer",
    text: {
      hi: "छोटा सा कदम भी मायने रखता है।",
      en: "Even a small step matters.",
    },
  },
];

/**
 * Rotating pool of simulated peer replies when the user writes a message.
 */
export const PEER_REPLIES: BiText[] = [
  {
    hi: "मैं समझ सकता हूँ। आप अकेले नहीं हैं।",
    en: "I understand. You're not alone.",
  },
  {
    hi: "यह बात साझा करने के लिए धन्यवाद।",
    en: "Thank you for sharing that.",
  },
  {
    hi: "आपके मन में और क्या चल रहा है?",
    en: "What else is on your mind?",
  },
  {
    hi: "कभी-कभी बस बोल देने से हल्का लगता है।",
    en: "Sometimes just saying it out loud makes it feel lighter.",
  },
  {
    hi: "नींद और थोड़ी सैर जैसे छोटे कदम मदद कर सकते हैं।",
    en: "Small steps like sleep and a short walk can help.",
  },
  {
    hi: "अगर यह भारी लगता है, तो किसी पेशेवर से बात करना ठीक है।",
    en: "If it feels heavy, it's okay to talk to a professional.",
  },
];

/**
 * Safety detection keyword datasets.
 */
export const CRISIS_KEYWORDS: readonly string[] = [
  "hurt myself",
  "kill myself",
  "suicide",
  "suicidal",
  "end my life",
  "end it all",
  "want to die",
  "self harm",
  "self-harm",
  "no reason to live",
];

export const ABUSE_KEYWORDS: readonly string[] = [
  "stupid",
  "idiot",
  "shut up",
  "hate you",
  "dumb",
  "loser",
  "fuck",
  "shit",
  "bastard",
];

export const HARMFUL_ADVICE_KEYWORDS: readonly string[] = [
  "stop taking your medication",
  "stop your medication",
  "don't take your medicine",
  "miracle cure",
  "bleach",
  "vaccines cause",
  "doctors are hiding",
  "no medicine needed",
];

/**
 * Verified crisis and mental health helplines.
 */
export const HELPLINES: Helpline[] = [
  {
    name: "KIRAN (India)",
    detail: "National mental-health helpline, 24×7, free",
    contact: "1800-599-0019",
  },
  {
    name: "iCALL (India)",
    detail: "Psychosocial support, Mon–Sat",
    contact: "+91 9152987821",
  },
  {
    name: "988 (US & Canada)",
    detail: "Suicide & crisis lifeline, 24×7",
    contact: "Call or text 988",
  },
];

/**
 * Hero conversation pairs for animation.
 */
export const HERO_PAIRS: BiText[] = [
  {
    en: "I've been feeling really stressed lately.",
    hi: "मुझे भी बहुत तनाव हो रहा है।",
  },
  {
    en: "I don't really know who to talk to.",
    hi: "कभी-कभी किसी अनजान व्यक्ति से बात करना आसान लगता है।",
  },
  {
    en: "Even a small step matters.",
    hi: "छोटा सा कदम भी मायने रखता है।",
  },
];

/**
 * Connection cycling status strings.
 */
export const CYCLING_STATUS: readonly string[] = [
  "Checking for an available peer…",
  "Keeping your identity hidden…",
  "Preparing a private space…",
];

/**
 * Report dialog reason choices.
 */
export const REPORT_REASONS: readonly string[] = [
  "Harassment or abuse",
  "Harmful medical advice",
  "Spam or fake identity",
  "Something else",
];

export const BARRIERS: readonly string[] = [
  "Fear of judgment",
  "Privacy concerns",
  "Language barriers",
];

export const NOT_CLAIMS: readonly string[] = [
  "We don't claim to be 100% anonymous or 100% secure — no online service can.",
  "We don't ask for your real name, email or phone number in the MVP.",
  "We don't run ad tracking or sell conversation data.",
];
