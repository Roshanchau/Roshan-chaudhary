"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { VOICE_AGENT_CONFIG } from "../config/voiceAgent";
import {
  createBrowserSpeech,
  type BrowserSpeech,
} from "../services/voice/client/browserSpeech";
import {
  createContinuousVoiceCapture,
  type ContinuousVoiceCapture,
} from "../services/voice/client/continuousVoiceCapture";
import {
  streamReply,
  transcribeAudio,
} from "../services/voice/client/voiceAgentApi";
import { buildGreeting } from "../lib/voice/greeting";
import {
  isMeaningfulSpeech,
  sanitizeTranscript,
} from "../lib/voice/transcriptFilter";
import { detectVoiceCommand } from "../lib/voice/voiceCommands";
import {
  readDismissedPreference,
  writeDismissedPreference,
} from "../services/voice/client/dismissalPreference";
import { useVoiceAgentStore } from "../store/useVoiceAgentStore";

interface UseVoiceAgentResult {
  enable: () => Promise<void>;
  disable: () => void;
  toggle: () => Promise<void>;
  close: () => void;
  reopen: () => Promise<void>;
}

const SENTENCE_END_RE = /[.!?]+(?:\s|$)/;
const FORCED_FLUSH_AT_CHARS = 140;

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === "AbortError";

const flushSentences = (
  buffer: string,
  speak: (text: string) => void
): string => {
  let remaining = buffer;
  while (true) {
    const match = remaining.match(SENTENCE_END_RE);
    if (!match || match.index === undefined) break;
    const endIdx = match.index + match[0].length;
    const sentence = remaining.slice(0, endIdx).trim();
    if (sentence) speak(sentence);
    remaining = remaining.slice(endIdx);
  }
  if (remaining.length >= FORCED_FLUSH_AT_CHARS) {
    const breakAt = remaining.lastIndexOf(" ", FORCED_FLUSH_AT_CHARS);
    if (breakAt > 0) {
      speak(remaining.slice(0, breakAt).trim());
      remaining = remaining.slice(breakAt + 1);
    }
  }
  return remaining;
};

export const useVoiceAgent = (): UseVoiceAgentResult => {
  const captureRef = useRef<ContinuousVoiceCapture | null>(null);
  const speechRef = useRef<BrowserSpeech | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const transcribeAbortRef = useRef<AbortController | null>(null);
  const utteranceSeqRef = useRef(0);
  const inflightUtteranceRef = useRef(false);
  const sleepTimerRef = useRef<number | null>(null);

  const status = useVoiceAgentStore((s) => s.status);
  const setStatus = useVoiceAgentStore((s) => s.setStatus);
  const setDismissed = useVoiceAgentStore((s) => s.setDismissed);
  const setError = useVoiceAgentStore((s) => s.setError);
  const appendMessage = useVoiceAgentStore((s) => s.appendMessage);
  const amendLastUserMessage = useVoiceAgentStore((s) => s.amendLastUserMessage);
  const markSpeechActivity = useVoiceAgentStore((s) => s.markSpeechActivity);
  const showBubble = useVoiceAgentStore((s) => s.showBubble);

  if (speechRef.current === null && typeof window !== "undefined") {
    speechRef.current = createBrowserSpeech();
  }

  const cancelInflight = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    transcribeAbortRef.current?.abort();
    transcribeAbortRef.current = null;
    speechRef.current?.stop();
  }, []);

  const wakeIfSleeping = useCallback(() => {
    if (useVoiceAgentStore.getState().status === "sleeping") {
      setStatus("listening");
    }
  }, [setStatus]);

  const streamSpokenReply = useCallback(
    async (
      userMessage: string,
      history: ReturnType<typeof useVoiceAgentStore.getState>["messages"],
      signal: AbortSignal,
      seq: number
    ): Promise<string> => {
      const speech = speechRef.current;
      let buffer = "";
      let full = "";
      let speakingStarted = false;

      const speak = (text: string) => {
        if (!speakingStarted) {
          setStatus("speaking");
          speakingStarted = true;
        }
        speech?.enqueue(text);
      };

      for await (const delta of streamReply(userMessage, history, signal)) {
        if (seq !== utteranceSeqRef.current) return full;
        full += delta;
        buffer += delta;
        buffer = flushSentences(buffer, speak);
      }

      const tail = buffer.trim();
      if (tail) speak(tail);
      await speech?.waitUntilDone();
      return full;
    },
    [setStatus]
  );

  // Phase 1: transcribe the captured audio without touching any reply that is
  // already in flight. We only know whether this was real speech (vs. a cough
  // or breath) *after* transcription, so we must not cancel an ongoing answer
  // or bump the utterance sequence until that's confirmed.
  const transcribeUtterance = useCallback(
    async (audio: Blob, replyInFlight: boolean): Promise<string | null> => {
      transcribeAbortRef.current?.abort();
      const controller = new AbortController();
      transcribeAbortRef.current = controller;

      // Only surface the "transcribing" state when idle, so a possible cough
      // during an answer never visually interrupts the agent.
      if (!replyInFlight) setStatus("transcribing");

      try {
        return await transcribeAudio(audio, controller.signal);
      } catch (err) {
        if (isAbortError(err)) return null;
        const message =
          err instanceof Error ? err.message : "Voice agent request failed";
        setError(message);
        setStatus("error");
        return null;
      } finally {
        if (transcribeAbortRef.current === controller) {
          transcribeAbortRef.current = null;
        }
      }
    },
    [setError, setStatus]
  );

  // Phase 2: a transcript confirmed as real speech. Treat it as a turn,
  // cancelling any in-flight reply (genuine barge-in) before answering.
  const respondToSpeech = useCallback(
    async (cleaned: string, replyInFlight: boolean) => {
      cancelInflight();
      const seq = ++utteranceSeqRef.current;
      inflightUtteranceRef.current = true;
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (replyInFlight) {
          amendLastUserMessage(cleaned);
        } else {
          appendMessage("user", cleaned);
        }

        const messages = useVoiceAgentStore.getState().messages;
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const userMessage = lastUser?.content ?? cleaned;
        const history = messages.slice(0, -1);

        setStatus("thinking");
        const fullReply = await streamSpokenReply(
          userMessage,
          history,
          controller.signal,
          seq
        );
        if (seq !== utteranceSeqRef.current) return;
        if (fullReply.trim()) appendMessage("assistant", fullReply.trim());
        setStatus("listening");
      } catch (err) {
        if (isAbortError(err) || seq !== utteranceSeqRef.current) return;
        const message =
          err instanceof Error ? err.message : "Voice agent request failed";
        setError(message);
        setStatus("error");
      } finally {
        if (seq === utteranceSeqRef.current) {
          abortRef.current = null;
          inflightUtteranceRef.current = false;
        }
      }
    },
    [amendLastUserMessage, appendMessage, cancelInflight, setError, setStatus, streamSpokenReply]
  );

  // "stop" / "be quiet" / etc.: halt speaking immediately and stay silent. The
  // command never reaches the language model, so the agent stops instead of
  // replying to the word "stop".
  const handleStopCommand = useCallback(() => {
    utteranceSeqRef.current += 1; // invalidate any in-flight reply so it bails
    cancelInflight();
    inflightUtteranceRef.current = false;
    setStatus("listening");
    markSpeechActivity();
  }, [cancelInflight, markSpeechActivity, setStatus]);

  // "continue" / "say that again" / etc.: re-speak the last answer. Browser TTS
  // can't resume mid-utterance, so we replay the whole last assistant message.
  const handleContinueCommand = useCallback(() => {
    utteranceSeqRef.current += 1;
    cancelInflight();
    inflightUtteranceRef.current = false;
    setStatus("listening");
    markSpeechActivity();
    const lastAssistant = [...useVoiceAgentStore.getState().messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (lastAssistant?.content) speechRef.current?.enqueue(lastAssistant.content);
  }, [cancelInflight, markSpeechActivity, setStatus]);

  const processUtterance = useCallback(
    async (audio: Blob) => {
      const replyInFlight = inflightUtteranceRef.current;
      const transcript = await transcribeUtterance(audio, replyInFlight);
      if (transcript === null) return;

      if (!isMeaningfulSpeech(transcript)) {
        // Non-speech (cough/breath/noise) or a known STT hallucination: never
        // answer it, and leave any in-flight reply untouched.
        if (
          !replyInFlight &&
          useVoiceAgentStore.getState().status === "transcribing"
        ) {
          setStatus("listening");
        }
        return;
      }

      const cleaned = sanitizeTranscript(transcript);

      // Playback commands are obeyed directly, bypassing the language model.
      const command = detectVoiceCommand(cleaned);
      if (command === "stop") {
        handleStopCommand();
        return;
      }
      if (command === "continue") {
        handleContinueCommand();
        return;
      }

      await respondToSpeech(cleaned, replyInFlight);
    },
    [
      handleContinueCommand,
      handleStopCommand,
      respondToSpeech,
      setStatus,
      transcribeUtterance,
    ]
  );

  const handleSpeechStart = useCallback(() => {
    markSpeechActivity();
    wakeIfSleeping();
  }, [markSpeechActivity, wakeIfSleeping]);

  const handleUtterance = useCallback(
    (audio: Blob) => {
      void processUtterance(audio);
    },
    [processUtterance]
  );

  // Spoken once when the visitor first opens Groot: a fixed warm self-intro.
  // The same line populates the speech bubble so the visitor can read what was
  // said — useful if their audio is muted or they're in a noisy environment.
  const speakGreeting = useCallback(() => {
    if (!VOICE_AGENT_CONFIG.greeting.enabled) return;
    const greeting = buildGreeting(
      new Date(),
      VOICE_AGENT_CONFIG.greeting.agentName
    );
    appendMessage("assistant", greeting);
    showBubble(greeting, VOICE_AGENT_CONFIG.ui.bubbleAutoHideMs);
    speechRef.current?.enqueue(greeting);
  }, [appendMessage, showBubble]);

  const enable = useCallback(async () => {
    if (captureRef.current?.isActive()) return;
    try {
      setError(null);
      const capture = createContinuousVoiceCapture();
      captureRef.current = capture;
      await capture.start({
        onSpeechStart: handleSpeechStart,
        onUtterance: handleUtterance,
        onError: (err) => {
          setError(err.message);
          setStatus("error");
        },
      });
      setStatus("listening");
      markSpeechActivity();
      speakGreeting();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to access microphone";
      setError(message);
      setStatus("error");
      captureRef.current?.stop();
      captureRef.current = null;
    }
  }, [
    handleSpeechStart,
    handleUtterance,
    markSpeechActivity,
    setError,
    setStatus,
    speakGreeting,
  ]);

  const disable = useCallback(() => {
    cancelInflight();
    captureRef.current?.stop();
    captureRef.current = null;
    inflightUtteranceRef.current = false;
    setStatus("off");
  }, [cancelInflight, setStatus]);

  const toggle = useCallback(async () => {
    const current = useVoiceAgentStore.getState().status;
    if (current === "off" || current === "error") {
      await enable();
      return;
    }
    if (current === "sleeping") {
      setStatus("listening");
      markSpeechActivity();
      return;
    }
    disable();
  }, [disable, enable, markSpeechActivity, setStatus]);

  // Fully close the assistant by the visitor's choice: stop everything and
  // remember the decision so it stays closed across reloads (no auto-start).
  const close = useCallback(() => {
    disable();
    setDismissed(true);
    writeDismissedPreference(true);
  }, [disable, setDismissed]);

  // Reopen after a close: clear the persisted choice and start listening again.
  const reopen = useCallback(async () => {
    setDismissed(false);
    writeDismissedPreference(false);
    await enable();
  }, [enable, setDismissed]);

  // On mount, honour a previous "closed" choice; otherwise auto-start (request
  // mic permission and begin listening) without the visitor tapping the orb.
  // enable() is idempotent and its identity is stable for the session, so this
  // runs once and never fights a later manual disable or close.
  useEffect(() => {
    if (readDismissedPreference()) {
      setDismissed(true);
      return;
    }
    if (VOICE_AGENT_CONFIG.behavior.autoStart) {
      void enable();
    }
  }, [enable, setDismissed]);

  useEffect(() => {
    if (status === "off") return;
    sleepTimerRef.current = window.setInterval(() => {
      const { status: s, lastSpeechAt } = useVoiceAgentStore.getState();
      if (s !== "listening") return;
      if (Date.now() - lastSpeechAt > VOICE_AGENT_CONFIG.sleep.inactivityMs) {
        setStatus("sleeping");
      }
    }, VOICE_AGENT_CONFIG.sleep.watchdogIntervalMs);
    return () => {
      if (sleepTimerRef.current !== null)
        window.clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    };
  }, [status, setStatus]);

  useEffect(
    () => () => {
      cancelInflight();
      captureRef.current?.stop();
      captureRef.current = null;
    },
    [cancelInflight]
  );

  return useMemo(
    () => ({ enable, disable, toggle, close, reopen }),
    [enable, disable, toggle, close, reopen]
  );
};
