import { NextResponse } from "next/server";
import type { ApiErrorBody } from "../../../types/voice.types";

export const errorResponse = (
  status: number,
  code: string,
  message: string
): NextResponse<ApiErrorBody> =>
  NextResponse.json({ error: { code, message } }, { status });

export const handleUnexpectedError = (
  scope: string,
  error: unknown
): NextResponse<ApiErrorBody> => {
  console.error(`[voice:${scope}]`, error);
  const message =
    error instanceof Error ? error.message : "Unexpected server error";
  return errorResponse(500, "internal_error", message);
};
