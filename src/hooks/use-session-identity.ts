"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Lang } from "@/types";
import { randomPeerId } from "@/lib/mock-data";

const STORAGE_PEER_KEY = "safespeak_peer_id";
const STORAGE_LANG_KEY = "safespeak_user_lang";

export function useSessionIdentity() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [peerId, setPeerIdState] = useState<number>(() => {
    const paramId = searchParams.get("peerId");
    if (paramId && !isNaN(Number(paramId))) {
      return Number(paramId);
    }
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem(STORAGE_PEER_KEY);
      if (stored && !isNaN(Number(stored))) {
        return Number(stored);
      }
    }
    return 4821;
  });

  const [lang, setLangState] = useState<Lang>(() => {
    const paramLang = searchParams.get("lang");
    if (paramLang === "en" || paramLang === "hi") {
      return paramLang;
    }
    if (typeof window !== "undefined") {
      const stored = window.sessionStorage.getItem(STORAGE_LANG_KEY);
      if (stored === "en" || stored === "hi") {
        return stored;
      }
    }
    return "en";
  });

  // Sync to session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_PEER_KEY, String(peerId));
    }
  }, [peerId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_LANG_KEY, lang);
    }
  }, [lang]);

  const shufflePeerId = useCallback(() => {
    const nextId = randomPeerId();
    setPeerIdState(nextId);
    return nextId;
  }, []);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
  }, []);

  return {
    peerId,
    lang,
    setPeerId: setPeerIdState,
    shufflePeerId,
    setLang,
  };
}
