"use client";

import { VOICE_AGENT_CONFIG } from "../../../config/voiceAgent";

export interface VadCallbacks {
  onSpeechStart: () => void;
  onSpeechEnd: () => void;
}

export interface VoiceActivityDetector {
  start(stream: MediaStream, callbacks: VadCallbacks): void;
  stop(): void;
  isRunning(): boolean;
}

const computeRms = (buffer: Uint8Array<ArrayBuffer>): number => {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / buffer.length);
};

export const createVoiceActivityDetector = (): VoiceActivityDetector => {
  const { pollMs, rmsThreshold, speechStartHoldMs, silenceEndHoldMs } =
    VOICE_AGENT_CONFIG.vad;

  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let intervalId: number | null = null;
  let buffer: Uint8Array<ArrayBuffer> | null = null;

  let state: "silent" | "speaking" = "silent";
  let speechHoldMs = 0;
  let silenceHoldMs = 0;

  const tick = (cb: VadCallbacks) => {
    if (!analyser || !buffer) return;
    analyser.getByteTimeDomainData(buffer);
    const rms = computeRms(buffer);

    if (rms > rmsThreshold) {
      speechHoldMs += pollMs;
      silenceHoldMs = 0;
      if (state === "silent" && speechHoldMs >= speechStartHoldMs) {
        state = "speaking";
        cb.onSpeechStart();
      }
    } else {
      silenceHoldMs += pollMs;
      speechHoldMs = 0;
      if (state === "speaking" && silenceHoldMs >= silenceEndHoldMs) {
        state = "silent";
        cb.onSpeechEnd();
      }
    }
  };

  const start = (stream: MediaStream, callbacks: VadCallbacks) => {
    if (intervalId !== null) return;
    audioContext = new AudioContext();
    // When the agent auto-starts on page load there may be no user gesture yet,
    // so the browser's autoplay policy can leave the context suspended (the
    // analyser would then read silence). Resume it so VAD runs immediately.
    if (audioContext.state === "suspended") {
      void audioContext.resume().catch(() => undefined);
    }
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    buffer = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    state = "silent";
    speechHoldMs = 0;
    silenceHoldMs = 0;
    intervalId = window.setInterval(() => tick(callbacks), pollMs);
  };

  const stop = () => {
    if (intervalId !== null) window.clearInterval(intervalId);
    intervalId = null;
    if (audioContext) audioContext.close().catch(() => undefined);
    audioContext = null;
    analyser = null;
    buffer = null;
    state = "silent";
    speechHoldMs = 0;
    silenceHoldMs = 0;
  };

  const isRunning = () => intervalId !== null;

  return { start, stop, isRunning };
};
