"use client";

import { VOICE_AGENT_CONFIG } from "../../../config/voiceAgent";
import {
  createVoiceActivityDetector,
  type VoiceActivityDetector,
} from "./voiceActivityDetector";

export interface VoiceCaptureCallbacks {
  onSpeechStart: () => void;
  onUtterance: (audio: Blob) => void;
  onError: (error: Error) => void;
}

export interface ContinuousVoiceCapture {
  start(callbacks: VoiceCaptureCallbacks): Promise<void>;
  stop(): void;
  isActive(): boolean;
}

const pickMimeType = (): string => {
  const preferred = VOICE_AGENT_CONFIG.recording.mimeType;
  if (typeof MediaRecorder === "undefined") return preferred;
  if (MediaRecorder.isTypeSupported(preferred)) return preferred;
  const fallbacks = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return fallbacks.find((m) => MediaRecorder.isTypeSupported(m)) ?? preferred;
};

const releaseStream = (stream: MediaStream | null) =>
  stream?.getTracks().forEach((t) => t.stop());

export const createContinuousVoiceCapture = (): ContinuousVoiceCapture => {
  let stream: MediaStream | null = null;
  let vad: VoiceActivityDetector | null = null;
  let recorder: MediaRecorder | null = null;
  let chunks: BlobPart[] = [];
  let utteranceStartedAt = 0;

  const safeStopRecorder = () => {
    if (recorder && recorder.state !== "inactive") recorder.stop();
    recorder = null;
  };

  const handleSpeechStart = (cb: VoiceCaptureCallbacks) => {
    if (!stream) return;
    chunks = [];
    utteranceStartedAt = Date.now();
    try {
      recorder = new MediaRecorder(stream, { mimeType: pickMimeType() });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.start();
      cb.onSpeechStart();
    } catch (err) {
      cb.onError(err instanceof Error ? err : new Error("Recorder failed"));
    }
  };

  const handleSpeechEnd = (cb: VoiceCaptureCallbacks) => {
    const active = recorder;
    if (!active || active.state === "inactive") return;
    active.onstop = () => {
      const durationMs = Date.now() - utteranceStartedAt;
      if (durationMs < VOICE_AGENT_CONFIG.vad.minUtteranceMs) {
        chunks = [];
        return;
      }
      const blob = new Blob(chunks, { type: active.mimeType });
      chunks = [];
      cb.onUtterance(blob);
    };
    active.stop();
    recorder = null;
  };

  const start = async (callbacks: VoiceCaptureCallbacks): Promise<void> => {
    if (stream) return;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: VOICE_AGENT_CONFIG.recording.audioConstraints,
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Microphone access denied");
    }
    vad = createVoiceActivityDetector();
    vad.start(stream, {
      onSpeechStart: () => handleSpeechStart(callbacks),
      onSpeechEnd: () => handleSpeechEnd(callbacks),
    });
  };

  const stop = () => {
    vad?.stop();
    safeStopRecorder();
    releaseStream(stream);
    vad = null;
    stream = null;
    chunks = [];
    utteranceStartedAt = 0;
  };

  const isActive = (): boolean => stream !== null;

  return { start, stop, isActive };
};
