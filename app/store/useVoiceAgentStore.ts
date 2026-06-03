"use client";

import { create } from "zustand";
import type {
  VoiceAgentStatus,
  VoiceMessage,
  VoiceMessageRole,
} from "../types/voice.types";

interface VoiceAgentState {
  status: VoiceAgentStatus;
  errorMessage: string | null;
  messages: VoiceMessage[];
  lastSpeechAt: number;
  dismissed: boolean;
  bubbleText: string | null;
  bubbleVisible: boolean;
  setStatus: (status: VoiceAgentStatus) => void;
  setDismissed: (dismissed: boolean) => void;
  setError: (message: string | null) => void;
  appendMessage: (role: VoiceMessageRole, content: string) => VoiceMessage;
  amendLastUserMessage: (extra: string) => void;
  markSpeechActivity: () => void;
  showBubble: (text: string, ttlMs?: number) => void;
  hideBubble: () => void;
  reset: () => void;
}

const generateId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createMessage = (
  role: VoiceMessageRole,
  content: string
): VoiceMessage => ({
  id: generateId(),
  role,
  content,
  createdAt: Date.now(),
});

// Single shared timeout so a new showBubble call cleanly supersedes the prior
// one instead of leaving stale auto-hide timers racing in the background.
let bubbleHideTimer: ReturnType<typeof setTimeout> | null = null;

export const useVoiceAgentStore = create<VoiceAgentState>((set, get) => ({
  status: "off",
  errorMessage: null,
  messages: [],
  lastSpeechAt: 0,
  dismissed: false,
  bubbleText: null,
  bubbleVisible: false,
  setStatus: (status) => set({ status }),
  setDismissed: (dismissed) => set({ dismissed }),
  setError: (errorMessage) => set({ errorMessage }),
  appendMessage: (role, content) => {
    const message = createMessage(role, content);
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },
  amendLastUserMessage: (extra) => {
    const trimmed = extra.trim();
    if (!trimmed) return;
    const messages = get().messages;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        const updated = [...messages];
        updated[i] = {
          ...messages[i],
          content: `${messages[i].content} ${trimmed}`,
        };
        set({ messages: updated });
        return;
      }
    }
    set({
      messages: [...messages, createMessage("user", trimmed)],
    });
  },
  markSpeechActivity: () => set({ lastSpeechAt: Date.now() }),
  showBubble: (text, ttlMs) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (bubbleHideTimer !== null) {
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = null;
    }
    set({ bubbleText: trimmed, bubbleVisible: true });
    if (ttlMs && ttlMs > 0) {
      bubbleHideTimer = setTimeout(() => {
        bubbleHideTimer = null;
        set({ bubbleVisible: false });
      }, ttlMs);
    }
  },
  hideBubble: () => {
    if (bubbleHideTimer !== null) {
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = null;
    }
    set({ bubbleVisible: false });
  },
  reset: () => {
    if (bubbleHideTimer !== null) {
      clearTimeout(bubbleHideTimer);
      bubbleHideTimer = null;
    }
    set({
      status: "off",
      errorMessage: null,
      messages: [],
      lastSpeechAt: 0,
      bubbleText: null,
      bubbleVisible: false,
    });
  },
}));
