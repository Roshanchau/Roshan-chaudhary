import "server-only";
import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";
import { getOpenAIClient } from "./openaiClient";

export const transcribeAudio = async (audio: File): Promise<string> => {
  const client = getOpenAIClient();
  const response = await client.audio.transcriptions.create({
    file: audio,
    model: VOICE_AGENT_CONFIG.models.transcription,
    language: VOICE_AGENT_CONFIG.transcriptionOptions.language,
    temperature: VOICE_AGENT_CONFIG.transcriptionOptions.temperature,
  });
  return response.text.trim();
};
