import { useRef } from "react";
import { trackEvent } from "../../lib/analytics";
import { useTheme } from "../../theme/context";

/**
 * Pull-cord lamp. Pull the knob down (past PULL_TRIGGER px) and let go to switch the
 * theme; a click, Enter or Space does the same. The light is "on" in the light theme.
 */
const BASE = 64; // resting cord length, px
const MAX_PULL = 72;
const PULL_TRIGGER = 26;

export function LampSwitch({ className = "" }: { className?: string }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const toggle = () => {
    toggleTheme();
    trackEvent("Lamp pulled", { to: theme === "dark" ? "light" : "dark" });
  };
  const cordRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const drag = useRef({ active: false, startY: 0, pulled: 0, moved: false, endedAt: 0 });

  // Transforms only (GPU): the cord stretches from its top and the knob + hint move down with it.
  const setPull = (px: number, spring: boolean) => {
    const cord = cordRef.current;
    const knob = knobRef.current;
    if (!cord || !knob) return;
    const t = spring ? "transform 0.55s cubic-bezier(0.3, 1.8, 0.5, 1)" : "none";
    cord.style.transition = t;
    knob.style.transition = t;
    cord.style.transform = `scaleY(${(BASE + px) / BASE})`;
    knob.style.transform = `translate3d(0, ${px}px, 0)`;
  };

  const tug = () => {
    setPull(PULL_TRIGGER, false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPull(0, true)));
  };

  const on = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Light theme"
      title={on ? "Pull to turn the light off" : "Pull to turn the light on"}
      className={`group flex touch-none flex-col items-center outline-none select-none ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { active: true, startY: e.clientY, pulled: 0, moved: false, endedAt: 0 };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active) return;
        const dy = e.clientY - d.startY;
        if (Math.abs(dy) > 4) d.moved = true;
        // rubber-band: resistance grows the further it is pulled
        d.pulled = Math.max(0, Math.min(MAX_PULL, dy * (1 - Math.min(dy, MAX_PULL * 2) / (MAX_PULL * 4))));
        setPull(d.pulled, false);
      }}
      onPointerUp={() => {
        const d = drag.current;
        if (!d.active) return;
        d.active = false;
        if (d.moved) d.endedAt = performance.now();
        if (d.moved && d.pulled >= PULL_TRIGGER) toggle();
        setPull(0, true);
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        setPull(0, true);
      }}
      onClick={() => {
        // The click that some browsers fire right after a drag is ignored (the drag already
        // decided). Time-boxed, so a later click or Enter/Space is never swallowed.
        const d = drag.current;
        d.moved = false;
        if (performance.now() - d.endedAt < 400) return;
        toggle();
        tug();
      }}
    >
      <span ref={cordRef} aria-hidden="true" className="block w-px origin-top bg-gradient-to-b from-transparent via-fg-3/70 to-fg-3 will-change-transform" style={{ height: BASE }} />
      <span ref={knobRef} className="flex flex-col items-center will-change-transform">

      {/* bulb / knob */}
      <span
        aria-hidden="true"
        className={`relative grid size-9 cursor-grab place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 group-active:cursor-grabbing group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg ${
          on
            ? "border-amber-200 bg-amber-100 shadow-[0_0_18px_4px_rgb(251_191_36/0.55),0_0_60px_18px_rgb(251_191_36/0.25)]"
            : "border-slate-500/40 bg-slate-800 shadow-[0_0_14px_2px_rgb(59_130_246/0.35),inset_0_0_8px_rgb(148_163_184/0.25)]"
        }`}
      >
        <span className={`size-3 rounded-full transition-colors duration-500 ${on ? "bg-amber-400" : "bg-slate-300/80"}`} />
      </span>

      {/* pull hint */}
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="mt-1.5 text-fg-3 motion-safe:animate-bounce">
        <path d="M3.5 5.5 7 9l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      </span>
    </button>
  );
}
