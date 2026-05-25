import "server-only";
import OpenAI from "openai";
import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";

let cachedClient: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (cachedClient) return cachedClient;

  const { apiKeyEnv, baseUrl } = VOICE_AGENT_CONFIG.provider;
  const apiKey = process.env[apiKeyEnv];
  if (!apiKey) {
    throw new Error(
      `${apiKeyEnv} is not set. Add it to .env to enable the voice agent.`
    );
  }

  cachedClient = new OpenAI({ apiKey, baseURL: baseUrl });
  return cachedClient;
};
