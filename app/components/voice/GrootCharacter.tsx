"use client";

import type { CSSProperties } from "react";
import type { VoiceAgentStatus } from "../../types/voice.types";

interface GrootCharacterProps {
  status: VoiceAgentStatus;
  sizePx: number;
}

const ANIMATIONS_CSS = `
@keyframes grootBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}
@keyframes grootListenPulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%      { opacity: 0.7;  transform: scale(1.12); }
}
@keyframes grootThinkDot {
  0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
  40%           { opacity: 1;    transform: translateY(-2px); }
}
@media (prefers-reduced-motion: reduce) {
  .groot-bob, .groot-listen-ring, .groot-think-dot { animation: none !important; }
}
`;

// Inject the keyframes once into the document head. Idempotent: a marker id
// keeps re-mounts from stacking duplicate <style> tags.
const STYLE_ID = "groot-character-keyframes";
const ensureStyles = (): void => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = ANIMATIONS_CSS;
  document.head.appendChild(tag);
};

const RING_COLOUR: Record<VoiceAgentStatus, string> = {
  off: "transparent",
  listening: "rgba(95,241,208,0.55)",
  transcribing: "rgba(95,200,241,0.55)",
  thinking: "rgba(95,200,241,0.55)",
  speaking: "rgba(180,140,255,0.6)",
  sleeping: "transparent",
  error: "rgba(239,68,68,0.6)",
};

const GrootCharacter = ({ status, sizePx }: GrootCharacterProps) => {
  ensureStyles();

  const isListening = status === "listening";
  const isThinking = status === "thinking" || status === "transcribing";
  const isSleeping = status === "sleeping";
  const isError = status === "error";
  const isCalm = isError || isSleeping;

  const wrapStyle: CSSProperties = {
    width: sizePx,
    height: sizePx,
    position: "relative",
    display: "inline-block",
    // Idle bob applies everywhere except error / sleeping (those stay calm).
    animation: isCalm ? "none" : "grootBob 3.2s ease-in-out infinite",
  };

  const imageStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
    // The GIF itself animates; we only colour-treat it for sleeping / error.
    filter: isSleeping
      ? "saturate(0.5) brightness(0.85)"
      : isError
        ? "hue-rotate(-25deg) saturate(0.8)"
        : undefined,
    opacity: isSleeping ? 0.75 : 1,
    boxShadow: `0 0 0 3px ${RING_COLOUR[status]}`,
    transition: "box-shadow 200ms ease, filter 200ms ease, opacity 200ms ease",
  };

  // Listening pulse — a soft outward ring behind the GIF. The GIF clip stays
  // crisp because the ring is a sibling absolutely positioned underneath.
  const ringSize = sizePx + 14;
  const ringStyle: CSSProperties = {
    position: "absolute",
    top: -7,
    left: -7,
    width: ringSize,
    height: ringSize,
    borderRadius: "50%",
    background: RING_COLOUR.listening,
    animation: "grootListenPulse 1.4s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  };

  // Three dots above the head when transcribing / thinking.
  const dotsStyle: CSSProperties = {
    position: "absolute",
    top: -10,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 4,
    pointerEvents: "none",
    zIndex: 2,
  };

  return (
    <span className="groot-bob" style={wrapStyle} aria-hidden="true">
      {isListening && <span className="groot-listen-ring" style={ringStyle} />}

      {/* next/image would re-encode and break the GIF's animation, so the
          plain <img> tag is intentional here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/groot.gif"
        alt=""
        draggable={false}
        style={{ ...imageStyle, position: "relative", zIndex: 1 }}
      />

      {isThinking && (
        <span style={dotsStyle}>
          {[0, 0.18, 0.36].map((delay, i) => (
            <span
              key={i}
              className="groot-think-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1a1a1a",
                animation: `grootThinkDot 1.1s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
};

export default GrootCharacter;
