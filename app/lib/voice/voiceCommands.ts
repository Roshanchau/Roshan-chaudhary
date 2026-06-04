/**
 * Detects spoken playback commands so the agent obeys them directly instead of
 * sending them to the language model (which would otherwise reply to "stop"
 * rather than actually stopping).
 *
 * Matching is on the WHOLE utterance after stripping polite/filler words, so
 * "please stop" or "hey Groot, stop" trigger the command, while "stop by the
 * store" or "I want to continue learning" do not.
 */
export type VoiceCommand = "stop" | "continue" | "none";

const FILLER_WORDS = new Set([
  "please",
  "okay",
  "ok",
  "hey",
  "um",
  "uh",
  "yeah",
  "yep",
  "now",
  "just",
  "so",
  "groot",
]);

const STOP_COMMANDS = new Set([
  "stop",
  "stop talking",
  "be quiet",
  "quiet",
  "shut up",
  "pause",
  "wait",
  "hold on",
  "enough",
  "cancel",
  "never mind",
  "nevermind",
  "shush",
  "silence",
]);

const CONTINUE_COMMANDS = new Set([
  "continue",
  "go on",
  "keep going",
  "carry on",
  "resume",
  "go ahead",
  "say that again",
  "repeat",
  "repeat that",
  "tell me again",
  "what did you say",
]);

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripFillers = (normalized: string): string =>
  normalized
    .split(" ")
    .filter((word) => word && !FILLER_WORDS.has(word))
    .join(" ");

export const detectVoiceCommand = (text: string): VoiceCommand => {
  const normalized = normalize(text);
  if (!normalized) return "none";

  // Check the raw normalized form and the filler-stripped form.
  for (const candidate of [normalized, stripFillers(normalized)]) {
    if (!candidate) continue;
    if (STOP_COMMANDS.has(candidate)) return "stop";
    if (CONTINUE_COMMANDS.has(candidate)) return "continue";
  }
  return "none";
};
