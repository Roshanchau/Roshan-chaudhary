"use client";

import { FiMic, FiX } from "react-icons/fi";
import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";
import { useVoiceAgent } from "../../hooks/useVoiceAgent";
import { useVoiceAgentStore } from "../../store/useVoiceAgentStore";
import type { VoiceAgentStatus } from "../../types/voice.types";
import GrootCharacter from "./GrootCharacter";
import GrootSpeechBubble from "./GrootSpeechBubble";

const ORB_PX = VOICE_AGENT_CONFIG.ui.orbSizePx;
const CONTAINER_RIGHT_PX = 24;
const CONTAINER_BOTTOM_PX = 24;

// Glow / ring colour per status. The character itself reacts to status via its
// own animations; the ring just adds a subtle ambient cue.
const STATUS_RING: Record<VoiceAgentStatus, string> = {
  off: "ring-0 shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
  listening: "ring-4 ring-[rgba(95,241,208,0.35)] shadow-[0_8px_30px_rgba(95,241,208,0.25)]",
  transcribing: "ring-4 ring-[rgba(95,200,241,0.4)] shadow-[0_8px_30px_rgba(95,200,241,0.25)]",
  thinking: "ring-4 ring-[rgba(95,200,241,0.4)] shadow-[0_8px_30px_rgba(95,200,241,0.25)]",
  speaking: "ring-4 ring-[rgba(180,140,255,0.45)] shadow-[0_8px_30px_rgba(180,140,255,0.3)]",
  sleeping: "ring-0 shadow-[0_6px_16px_rgba(0,0,0,0.2)]",
  error: "ring-4 ring-red-500/40 shadow-[0_8px_30px_rgba(239,68,68,0.3)]",
};

const STATUS_LABEL: Record<VoiceAgentStatus, string> = {
  off: "Tap Groot to start talking",
  listening: "Groot is listening — go ahead",
  transcribing: "Groot is listening — go ahead",
  thinking: "Groot is thinking…",
  speaking: "Groot is speaking — tap to stop",
  sleeping: "Groot is resting — tap or speak to wake",
  error: "Voice companion error — tap to retry",
};

const VoiceOrb = () => {
  const status = useVoiceAgentStore((s) => s.status);
  const dismissed = useVoiceAgentStore((s) => s.dismissed);
  const errorMessage = useVoiceAgentStore((s) => s.errorMessage);
  const { toggle, close, reopen } = useVoiceAgent();

  // Visitor explicitly minimised: show a small chip with the mic-off icon. Tap
  // anywhere on it to bring Groot back. This stays out of the way.
  if (dismissed) {
    const reopenLabel = "Voice companion minimised — tap to bring Groot back";
    return (
      <button
        type="button"
        onClick={() => {
          void reopen();
        }}
        aria-label={reopenLabel}
        title={reopenLabel}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(123,196,127,0.95)] text-[rgb(17,16,29)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] ring-2 ring-[rgba(63,139,81,0.6)] transition-all hover:scale-105 active:scale-95"
      >
        <FiMic size={18} />
      </button>
    );
  }

  const ring = STATUS_RING[status];
  const label = errorMessage ?? STATUS_LABEL[status];

  return (
    <>
      <GrootSpeechBubble
        rightPx={CONTAINER_RIGHT_PX}
        bottomPx={CONTAINER_BOTTOM_PX + ORB_PX + 12}
      />
      <div
        className="fixed z-50"
        style={{
          right: CONTAINER_RIGHT_PX,
          bottom: CONTAINER_BOTTOM_PX,
          width: ORB_PX,
          height: ORB_PX,
        }}
      >
        <button
          type="button"
          onClick={() => {
            void toggle();
          }}
          aria-label={label}
          title={label}
          style={{ width: ORB_PX, height: ORB_PX }}
          className={`flex items-center justify-center rounded-full bg-transparent transition-all active:scale-95 hover:scale-105 ${ring}`}
        >
          <GrootCharacter status={status} sizePx={ORB_PX} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
          aria-label="Minimise Groot"
          title="Minimise Groot"
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(40,40,55)] text-white shadow ring-1 ring-black/40 transition-all hover:bg-[rgb(60,60,80)] active:scale-95"
        >
          <FiX size={13} />
        </button>
      </div>
    </>
  );
};

export default VoiceOrb;
