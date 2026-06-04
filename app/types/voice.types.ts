export type VoiceAgentStatus =
  | "off"
  | "listening"
  | "transcribing"
  | "thinking"
  | "speaking"
  | "sleeping"
  | "error";

export type VoiceMessageRole = "user" | "assistant";

export interface VoiceMessage {
  id: string;
  role: VoiceMessageRole;
  content: string;
  createdAt: number;
}

export interface ChatRequestBody {
  message: string;
  history: VoiceMessage[];
}

export interface ChatResponseBody {
  reply: string;
}

export interface TranscribeResponseBody {
  text: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
