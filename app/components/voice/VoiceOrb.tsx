"use client";

import { FiMic, FiMicOff, FiX } from "react-icons/fi";
import { VOICE_AGENT_CONFIG } from "../../config/voiceAgent";
import { useVoiceAgent } from "../../hooks/useVoiceAgent";
import { useVoiceAgentStore } from "../../store/useVoiceAgentStore";
import type { VoiceAgentStatus } from "../../types/voice.types";

const ORB_PX = VOICE_AGENT_CONFIG.ui.orbSizePx;

const STATUS_STYLES: Record<
  VoiceAgentStatus,
  { bg: string; ring: string; pulse: boolean }
> = {
  off: {
    bg: "bg-[rgba(118,129,158,0.45)]",
    ring: "ring-0",
    pulse: false,
  },
  listening: {
    bg: "bg-[rgb(95,241,208)]",
    ring: "ring-4 ring-[rgba(95,241,208,0.25)]",
    pulse: false,
  },
  transcribing: {
    bg: "bg-[rgb(95,200,241)]",
    ring: "ring-4 ring-[rgba(95,200,241,0.3)]",
    pulse: true,
  },
  thinking: {
    bg: "bg-[rgb(95,200,241)]",
    ring: "ring-4 ring-[rgba(95,200,241,0.3)]",
    pulse: true,
  },
  speaking: {
    bg: "bg-[rgb(180,140,255)]",
    ring: "ring-4 ring-[rgba(180,140,255,0.35)]",
    pulse: true,
  },
  sleeping: {
    bg: "bg-[rgba(95,241,208,0.35)]",
    ring: "ring-0",
    pulse: false,
  },
  error: {
    bg: "bg-red-500",
    ring: "ring-4 ring-red-500/30",
    pulse: false,
  },
};

const STATUS_LABEL: Record<VoiceAgentStatus, string> = {
  off: "Tap to enable voice companion",
  listening: "Listening",
  transcribing: "Transcribing your message",
  thinking: "Thinking",
  speaking: "Speaking",
  sleeping: "Resting — speak or tap to wake",
  error: "Voice agent error — tap to retry",
};

const VoiceOrb = () => {
  const status = useVoiceAgentStore((s) => s.status);
  const dismissed = useVoiceAgentStore((s) => s.dismissed);
  const errorMessage = useVoiceAgentStore((s) => s.errorMessage);
  const { toggle, close, reopen } = useVoiceAgent();

  // Closed by the visitor: collapse to a faint button that reopens on tap.
  if (dismissed) {
    const reopenLabel = "Voice assistant closed — tap to reopen";
    return (
      <button
        type="button"
        onClick={() => {
          void reopen();
        }}
        aria-label={reopenLabel}
        title={reopenLabel}
        className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(118,129,158,0.35)] text-[rgb(17,16,29)] opacity-60 shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all hover:opacity-90 active:scale-95"
      >
        <FiMicOff size={18} />
      </button>
    );
  }

  const visual = STATUS_STYLES[status];
  const label = errorMessage ?? STATUS_LABEL[status];

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{ width: ORB_PX, height: ORB_PX }}
    >
      <button
        type="button"
        onClick={() => {
          void toggle();
        }}
        aria-label={label}
        title={label}
        style={{ width: ORB_PX, height: ORB_PX }}
        className={`rounded-full flex items-center justify-center text-[rgb(17,16,29)] shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all active:scale-95 ${visual.bg} ${visual.ring} ${visual.pulse ? "animate-pulse" : ""} ${status === "sleeping" ? "opacity-60" : "opacity-100"}`}
      >
        {status === "off" ? <FiMicOff size={22} /> : <FiMic size={22} />}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        aria-label="Close voice assistant"
        title="Close voice assistant"
        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[rgb(40,40,55)] text-white shadow ring-1 ring-black/30 transition-all hover:bg-[rgb(60,60,80)] active:scale-95"
      >
        <FiX size={12} />
      </button>
    </div>
  );
};

export default VoiceOrb;
