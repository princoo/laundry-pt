"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_CODES,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from "@/lib/constants/languages";

// Broadcast so every switcher on the page (desktop bar, mobile menu) stays
// in step without a provider. 'storage' covers other tabs.
const CHANGE_EVENT = "salt:language-change";

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): LanguageCode {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return LANGUAGE_CODES.includes(stored as LanguageCode)
    ? (stored as LanguageCode)
    : DEFAULT_LANGUAGE;
}

// The server has no localStorage, so it always renders the default and the
// client swaps in the stored choice after hydration- no markup mismatch.
function getServerSnapshot(): LanguageCode {
  return DEFAULT_LANGUAGE;
}

// Placeholder state only- nothing is translated off the back of this yet.
// The stored choice is what the real i18n layer will read when it lands.
export function useLanguage() {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const changeLanguage = useCallback((next: LanguageCode) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { language, changeLanguage };
}
