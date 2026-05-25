import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";

/**
 * Transcript filtering for the voice agent.
 *
 * Speech-to-text models (Whisper family) do not return clean silence for
 * non-speech audio. A cough, a breath, throat-clearing, or background noise is
 * commonly transcribed as a non-verbal annotation (e.g. "[coughing]") or as a
 * small set of well-known hallucinated phrases (e.g. "Thank you.",
 * "Thanks for watching"). These helpers strip the former and reject the latter
 * so the agent never answers a question that was never actually asked.
 */

/** Normalised, whole-utterance hallucinations to reject outright. */
const EXACT_HALLUCINATIONS: ReadonlySet<string> = new Set([
  "thank you",
  "thank you very much",
  "thank you so much",
  "thanks",
  "you",
  "bye",
  "bye bye",
  "goodbye",
  "the end",
]);

/**
 * Substrings that strongly indicate a subtitle/credit-style hallucination.
 * Matched anywhere in the normalised transcript — these effectively never
 * appear in a genuine spoken question to a portfolio assistant.
 */
const HALLUCINATION_MARKERS: readonly string[] = [
  "thanks for watching",
  "please subscribe",
  "like and subscribe",
  "subscribe to",
  "subtitles by",
  "amara",
  "transcription by",
  "captions by",
];

/**
 * Remove non-verbal annotations the STT model inserts for sounds, e.g.
 * "[coughing]", "(breathes)", "*music*", and collapse whitespace. The original
 * casing and punctuation of real words are preserved for the chat model.
 */
export const sanitizeTranscript = (raw: string): string =>
  raw
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\*[^*]*\*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Lowercase, drop punctuation, collapse spaces — for matching, not display. */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * True only when the transcript looks like a genuine spoken request rather
 * than non-speech noise or a known hallucination.
 */
export const isMeaningfulSpeech = (raw: string): boolean => {
  const cleaned = sanitizeTranscript(raw);
  if (!cleaned) return false;

  const normalized = normalize(cleaned);
  if (!normalized) return false;

  const alphanumericCount = normalized.replace(/\s+/g, "").length;
  if (alphanumericCount < VOICE_AGENT_CONFIG.transcript.minChars) return false;

  if (EXACT_HALLUCINATIONS.has(normalized)) return false;
  if (HALLUCINATION_MARKERS.some((marker) => normalized.includes(marker))) {
    return false;
  }

  return true;
};
