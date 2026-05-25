import "server-only";
import {
  VOICE_AGENT_CONFIG,
  VOICE_AGENT_SYSTEM_PROMPT,
} from "../../config/voiceAgent";
import {
  buildBlogKnowledge,
  getBlogSummaries,
} from "../../lib/voice/blogKnowledge";
import {
  PORTFOLIO_KNOWLEDGE,
  buildKnowledgeContext,
} from "../../lib/voice/knowledgeBase";
import type { VoiceMessage } from "../../types/voice.types";
import { getOpenAIClient } from "./openaiClient";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const buildSystemMessage = async (): Promise<ChatMessage> => {
  const portfolio = buildKnowledgeContext(PORTFOLIO_KNOWLEDGE);
  const blogs = buildBlogKnowledge(await getBlogSummaries());
  const blogSection = blogs ? `\n\n### blogs\n${blogs}` : "";
  return {
    role: "system",
    content: `${VOICE_AGENT_SYSTEM_PROMPT}\n\nKnowledge base:\n${portfolio}${blogSection}`,
  };
};

const trimHistory = (history: VoiceMessage[]): VoiceMessage[] => {
  const turns = VOICE_AGENT_CONFIG.chat.historyTurns;
  if (history.length <= turns) return history;
  return history.slice(history.length - turns);
};

const toChatMessages = async (
  history: VoiceMessage[],
  userMessage: string
): Promise<ChatMessage[]> => [
  await buildSystemMessage(),
  ...trimHistory(history).map<ChatMessage>((m) => ({
    role: m.role,
    content: m.content,
  })),
  { role: "user", content: userMessage },
];

export const streamReply = async function* (
  userMessage: string,
  history: VoiceMessage[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const client = getOpenAIClient();
  const stream = await client.chat.completions.create(
    {
      model: VOICE_AGENT_CONFIG.models.chat,
      temperature: VOICE_AGENT_CONFIG.chat.temperature,
      max_tokens: VOICE_AGENT_CONFIG.chat.maxTokens,
      messages: await toChatMessages(history, userMessage),
      stream: true,
    },
    { signal }
  );

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
};
