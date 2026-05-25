import { NextResponse } from "next/server";
import { transcribeAudio } from "../../../services/voice/transcriptionService";
import type { TranscribeResponseBody } from "../../../types/voice.types";
import {
  errorResponse,
  handleUnexpectedError,
} from "../_lib/errorResponse";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return errorResponse(
        400,
        "invalid_audio",
        "Request must include a non-empty 'audio' file field."
      );
    }

    const text = await transcribeAudio(audio);
    return NextResponse.json<TranscribeResponseBody>({ text });
  } catch (error) {
    return handleUnexpectedError("transcribe", error);
  }
};
