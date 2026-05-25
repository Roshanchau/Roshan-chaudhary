import { streamReply } from "../../../services/voice/chatService";
import type {
  ChatRequestBody,
  VoiceMessage,
} from "../../../types/voice.types";
import {
  errorResponse,
  handleUnexpectedError,
} from "../_lib/errorResponse";

export const runtime = "nodejs";

const isVoiceMessage = (value: unknown): value is VoiceMessage => {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    typeof m.createdAt === "number"
  );
};

const parseBody = (body: unknown): ChatRequestBody | null => {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.message !== "string" || !b.message.trim()) return null;
  if (!Array.isArray(b.history)) return null;
  if (!b.history.every(isVoiceMessage)) return null;
  return { message: b.message, history: b.history };
};

const isAbortError = (err: unknown): boolean =>
  err instanceof Error &&
  (err.name === "AbortError" || err.name === "APIUserAbortError");

const createReplyStream = (
  message: string,
  history: VoiceMessage[],
  signal: AbortSignal
): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();
  // The client aborts this request whenever the visitor barges in or closes the
  // agent. That cancels the stream and closes the controller, so we must stop
  // enqueuing instead of writing to a closed controller (ERR_INVALID_STATE).
  let closed = false;
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamReply(message, history, signal)) {
          if (closed) break;
          controller.enqueue(encoder.encode(delta));
        }
        if (!closed) controller.close();
      } catch (err) {
        if (closed || signal.aborted || isAbortError(err)) return;
        console.error("[voice:chat:stream]", err);
        try {
          controller.error(err);
        } catch {
          /* controller already torn down */
        }
      }
    },
    cancel() {
      closed = true;
    },
  });
};

export const POST = async (request: Request) => {
  try {
    const body = parseBody(await request.json());
    if (!body) {
      return errorResponse(
        400,
        "invalid_body",
        "Body must include a non-empty 'message' string and a 'history' array."
      );
    }

    return new Response(createReplyStream(body.message, body.history, request.signal), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return handleUnexpectedError("chat", error);
  }
};
