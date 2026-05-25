/**
 * Time-aware startup greeting spoken once when the voice agent begins.
 * Pure functions so the wording is easy to adjust and test.
 */

/** "Good morning" / "Good afternoon" / "Good evening" based on local hour. */
export const getTimeGreeting = (date: Date): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
};

/** e.g. "Good morning! I'm Groot, Roshan's voice agent." */
export const buildGreeting = (date: Date, agentName: string): string =>
  `${getTimeGreeting(date)}! I'm ${agentName}, Roshan's voice agent.`;
