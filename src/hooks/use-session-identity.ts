"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";

import type { Lang } from "@/types";
import { randomPeerId } from "@/lib/mock-data";
import { auth } from "@/lib/firebase";

const STORAGE_PEER_KEY = "safespeak_peer_id";
const STORAGE_LANG_KEY = "safespeak_user_lang";

export function useSessionIdentity() {
  const searchParams = useSearchParams();

  const [peerId, setPeerIdState] = useState<number>(0);
  const [lang, setLangState] = useState<Lang>("en");

  const [firebaseUser, setFirebaseUser] =
    useState<User | null>(auth.currentUser);

  const [authLoading, setAuthLoading] = useState(true);

  // Load identity AFTER hydration.
  useEffect(() => {
    const urlPeerId = searchParams.get("peerId");

    if (urlPeerId && !isNaN(Number(urlPeerId))) {
      setPeerIdState(Number(urlPeerId));
    } else {
      const storedPeerId =
        window.sessionStorage.getItem(STORAGE_PEER_KEY);

      if (
        storedPeerId &&
        !isNaN(Number(storedPeerId))
      ) {
        setPeerIdState(Number(storedPeerId));
      } else {
        setPeerIdState(randomPeerId());
      }
    }

    // IMPORTANT:
    // URL language takes priority over sessionStorage.
    const urlLang = searchParams.get("lang");

    if (urlLang === "en" || urlLang === "hi") {
      setLangState(urlLang);
      return;
    }

    const storedLang =
      window.sessionStorage.getItem(STORAGE_LANG_KEY);

    if (storedLang === "en" || storedLang === "hi") {
      setLangState(storedLang);
    }
  }, [searchParams]);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setFirebaseUser(user);
        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Save peer ID
  useEffect(() => {
    if (peerId === 0) return;

    window.sessionStorage.setItem(
      STORAGE_PEER_KEY,
      String(peerId)
    );
  }, [peerId]);

  // Save language
  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_LANG_KEY,
      lang
    );
  }, [lang]);

  const signInAnonymous = useCallback(async () => {
    if (auth.currentUser) {
      setFirebaseUser(auth.currentUser);
      return auth.currentUser;
    }

    const result = await signInAnonymously(auth);

    setFirebaseUser(result.user);

    return result.user;
  }, []);

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
    setLang,
    setPeerId: setPeerIdState,
    shufflePeerId,
    firebaseUser,
    authLoading,
    signInAnonymous,
  };
}