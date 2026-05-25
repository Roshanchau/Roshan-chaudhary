"use client";

import { VOICE_AGENT_CONFIG } from "../../../config/voiceAgent";

export interface BrowserSpeech {
  enqueue(text: string): void;
  stop(): void;
  waitUntilDone(): Promise<void>;
  isAvailable(): boolean;
}

const isBrowserSpeechAvailable = (): boolean =>
  typeof window !== "undefined" && "speechSynthesis" in window;

const pickVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const { preferredVoiceNames, fallbackLang } = VOICE_AGENT_CONFIG.speech;
  const isEnglish = (v: SpeechSynthesisVoice) =>
    v.lang.toLowerCase().startsWith("en");

  // Match preferred names as case-insensitive substrings so suffixed neural
  // voices (e.g. "Microsoft Aria Online (Natural) - English (United States)")
  // still match, preferring the English variant when several match.
  for (const name of preferredVoiceNames) {
    const needle = name.toLowerCase();
    const matches = voices.filter((v) => v.name.toLowerCase().includes(needle));
    const match = matches.find(isEnglish) ?? matches[0];
    if (match) return match;
  }

  return (
    voices.find((v) => v.lang === fallbackLang) ??
    voices.find(isEnglish) ??
    voices[0]
  );
};

const configureUtterance = (
  utterance: SpeechSynthesisUtterance,
  voice: SpeechSynthesisVoice | null
): SpeechSynthesisUtterance => {
  const { rate, pitch, volume, fallbackLang } = VOICE_AGENT_CONFIG.speech;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.lang = fallbackLang;
  if (voice) utterance.voice = voice;
  return utterance;
};

export const createBrowserSpeech = (): BrowserSpeech => {
  // Resolve the voice exactly once and reuse it for every utterance, so the
  // greeting and all replies share a single voice. Browsers populate the voice
  // list asynchronously; until it's ready, utterances are deferred (rather than
  // spoken in the default voice) and flushed on the 'voiceschanged' event.
  let cachedVoice: SpeechSynthesisVoice | null = null;
  let voiceResolved = false;
  let listenerAttached = false;
  const pending: string[] = [];

  const resolveVoice = (): void => {
    if (voiceResolved) return;
    const voice = pickVoice();
    if (voice) {
      cachedVoice = voice;
      voiceResolved = true;
    }
  };

  const speakNow = (text: string): void => {
    const utterance = configureUtterance(
      new SpeechSynthesisUtterance(text),
      cachedVoice
    );
    window.speechSynthesis.speak(utterance);
  };

  const flushPending = (): void => {
    resolveVoice();
    if (!voiceResolved) return;
    while (pending.length > 0) speakNow(pending.shift() as string);
  };

  const ensureVoicesListener = (): void => {
    if (listenerAttached) return;
    listenerAttached = true;
    window.speechSynthesis.addEventListener("voiceschanged", flushPending);
  };

  const enqueue = (text: string): void => {
    const trimmed = text.trim();
    if (!trimmed || !isBrowserSpeechAvailable()) return;

    resolveVoice();
    if (!voiceResolved) {
      pending.push(trimmed);
      ensureVoicesListener();
      return;
    }
    speakNow(trimmed);
  };

  const stop = (): void => {
    pending.length = 0;
    if (isBrowserSpeechAvailable()) window.speechSynthesis.cancel();
  };

  const waitUntilDone = (): Promise<void> =>
    new Promise((resolve) => {
      if (!isBrowserSpeechAvailable()) {
        resolve();
        return;
      }
      const tick = () => {
        const synth = window.speechSynthesis;
        if (pending.length === 0 && !synth.speaking && !synth.pending) {
          resolve();
          return;
        }
        window.setTimeout(tick, 80);
      };
      tick();
    });

  return {
    enqueue,
    stop,
    waitUntilDone,
    isAvailable: isBrowserSpeechAvailable,
  };
};
