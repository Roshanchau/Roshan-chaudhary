"use client";

import { VOICE_AGENT_CONFIG } from "../../../config/voiceAgent";

/**
 * Persists whether the visitor has closed the voice assistant, so the choice
 * survives reloads (the agent won't auto-start again until reopened). All
 * access is guarded for SSR and storage failures (e.g. private mode).
 */
const STORAGE_KEY = VOICE_AGENT_CONFIG.behavior.dismissedStorageKey;

export const readDismissedPreference = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const writeDismissedPreference = (dismissed: boolean): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, dismissed ? "true" : "false");
  } catch {
    /* ignore storage errors (private mode, quota, disabled storage) */
  }
};
