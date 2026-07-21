/**
 * Greeting spoken (and shown in the speech bubble) when the visitor first
 * enables the voice agent. Pure function so the wording is easy to tweak.
 */

/** "Good morning" / "Good afternoon" / "Good evening" based on local hour. */
export const getTimeGreeting = (date: Date): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};

/** Fixed warm greeting — same text spoken by TTS and shown in the bubble. */
export const buildGreeting = (_date: Date, agentName: string): string =>
  `Hi, I am ${agentName}, Roshan's voice agent. How can I help you?`;
