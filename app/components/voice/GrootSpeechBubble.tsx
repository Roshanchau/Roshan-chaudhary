"use client";

import { FiX } from "react-icons/fi";
import { useVoiceAgentStore } from "../../store/useVoiceAgentStore";

const GrootSpeechBubble = () => {
  const text = useVoiceAgentStore((s) => s.bubbleText);
  const visible = useVoiceAgentStore((s) => s.bubbleVisible);
  const hideBubble = useVoiceAgentStore((s) => s.hideBubble);

  if (!text) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        maxWidth: "min(280px, 70vw)",
        pointerEvents: visible ? "auto" : "none",
      }}
      className={`absolute bottom-full right-0 mb-3 z-50 transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      }`}
    >
      <div className="relative rounded-2xl bg-white text-[rgb(17,16,29)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-black/10 px-4 py-3 pr-7">
        <p className="text-sm leading-snug font-medium">{text}</p>
        <button
          type="button"
          onClick={hideBubble}
          aria-label="Dismiss greeting"
          title="Dismiss"
          className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 active:scale-95"
        >
          <FiX size={12} />
        </button>
        {/* Tail — points down-right toward the avatar */}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-white ring-1 ring-black/10"
          style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
        />
      </div>
    </div>
  );
};

export default GrootSpeechBubble;
