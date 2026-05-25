"use client";

import { VOICE_AGENT_CONFIG } from "../../../config/voiceAgent";
import type {
  ApiErrorBody,
  TranscribeResponseBody,
  VoiceMessage,
} from "../../../types/voice.types";

const extractError = async (res: Response): Promise<string> => {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return body?.error?.message ?? `Request failed with status ${res.status}`;
  } catch {
    return `Request failed with status ${res.status}`;
  }
};

export const transcribeAudio = async (
  audio: Blob,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  const extension = audio.type.includes("mp4") ? "mp4" : "webm";
  formData.append("audio", audio, `recording.${extension}`);

  const res = await fetch(VOICE_AGENT_CONFIG.api.transcribe, {
    method: "POST",
    body: formData,
    signal,
  });
  if (!res.ok) throw new Error(await extractError(res));
  const body = (await res.json()) as TranscribeResponseBody;
  return body.text;
};

export const streamReply = async function* (
  message: string,
  history: VoiceMessage[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(VOICE_AGENT_CONFIG.api.chat, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
    signal,
  });
  if (!res.ok) throw new Error(await extractError(res));
  if (!res.body) throw new Error("Chat stream missing response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) yield decoder.decode(value, { stream: true });
    }
    const tail = decoder.decode();
    if (tail) yield tail;
  } finally {
    reader.releaseLock();
  }
};
