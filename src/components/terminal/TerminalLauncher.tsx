import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";

// Loaded only when someone opens it, so the normal page stays light.
const Terminal = lazy(() => import("./Terminal").then((m) => ({ default: m.Terminal })));

function isTyping(el: Element | null) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (el as HTMLElement).isContentEditable;
}

/** ">_" button that opens the terminal view. Shortcut: ` (backtick) or Ctrl/⌘ + K. */
export function TerminalLauncher({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const show = useCallback((via: string) => {
    setLoaded(true);
    setOpen(true);
    trackEvent("Terminal opened", { via });
  }, []);
  const onClose = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      const k = e.key.toLowerCase();
      if ((k === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "`" && !isTyping(document.activeElement))) {
        e.preventDefault();
        show("shortcut");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, show]);

  return (
    <>
      <button
        type="button"
        onClick={() => show("button")}
        onPointerEnter={() => setLoaded(true)}
        aria-label="Open terminal view (shortcut: Ctrl+K)"
        className={`has-tip group/term relative grid size-10 place-items-center rounded-full border border-line bg-surface font-mono text-[13px] font-medium text-fg-2 shadow-raised transition-[transform,color,border-color,box-shadow] duration-500 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg hover:shadow-glow active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
      >
        <span aria-hidden="true">
          {">"}
          <span className="motion-safe:animate-[blink_1.1s_steps(1)_infinite]">_</span>
        </span>
        <span aria-hidden="true" className="tip top-[calc(100%+10px)] bottom-auto z-30 rounded-lg border border-line-strong bg-bg px-2.5 py-1 font-sans text-xs text-fg shadow-raised [&::after]:hidden">
          Terminal view · Ctrl K
        </span>
      </button>
      {loaded && (
        <Suspense fallback={null}>
          <Terminal open={open} onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}
