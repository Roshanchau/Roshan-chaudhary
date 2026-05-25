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
  setStatus: (status: VoiceAgentStatus) => void;
  setDismissed: (dismissed: boolean) => void;
  setError: (message: string | null) => void;
  appendMessage: (role: VoiceMessageRole, content: string) => VoiceMessage;
  amendLastUserMessage: (extra: string) => void;
  markSpeechActivity: () => void;
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

export const useVoiceAgentStore = create<VoiceAgentState>((set, get) => ({
  status: "off",
  errorMessage: null,
  messages: [],
  lastSpeechAt: 0,
  dismissed: false,
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
  reset: () =>
    set({
      status: "off",
      errorMessage: null,
      messages: [],
      lastSpeechAt: 0,
    }),
}));
