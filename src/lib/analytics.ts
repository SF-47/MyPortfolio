import { track } from "@vercel/analytics";

/**
 * Custom events for Vercel Web Analytics. Names are kept short and fixed so they group
 * well in the dashboard; properties are plain strings (no personal data).
 */
export type EventName =
  | "Project details"
  | "Project link"
  | "CV download"
  | "Contact sent"
  | "Email copied"
  | "Lamp pulled"
  | "Findly demo";

export function trackEvent(name: EventName, props?: Record<string, string>) {
  try {
    track(name, props);
  } catch {
    /* analytics must never break the page */
  }
}

/** Records "CV download" for any click on a link to the CV, wherever it is on the page. */
export function listenForCvClicks(cvPath: string) {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a");
    if (a && new URL(a.href, location.href).pathname === cvPath) {
      trackEvent("CV download", { from: a.closest("section")?.id ?? "page" });
    }
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}
