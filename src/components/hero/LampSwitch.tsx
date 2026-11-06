import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { useTheme } from "../../theme/context";

/**
 * Pull-cord lamp. Pull the knob down (past PULL_TRIGGER px) and let go to switch the
 * theme; a click, Enter or Space does the same. The light is "on" in the light theme.
 *
 * Motion (transforms/opacity only, so it stays smooth on phones):
 *  - the cord stretches while pulled and springs back;
 *  - the lamp tilts toward a sideways pull and swings like a pendulum afterwards,
 *    with an extra kick when it switches; the loop sleeps once it is still;
 *  - switching on, the bulb flickers to life and a ring of light bursts outward;
 *    switching off, it glows briefly and fades.
 */
const BASE = 64; // resting cord length, px
const MAX_PULL = 72;
const PULL_TRIGGER = 26;
const MAX_TILT = 0.45; // rad
const SWING_K = 26; // pendulum stiffness
const SWING_DAMP = 2.6;

type Flash = { n: number; kind: "on" | "off" } | null;

export function LampSwitch({ className = "" }: { className?: string }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const on = theme === "light";
  const [flash, setFlash] = useState<Flash>(null);
  const [pulling, setPulling] = useState(false);

  const swingRef = useRef<HTMLSpanElement>(null);
  const cordRef = useRef<HTMLSpanElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const drag = useRef({ active: false, startX: 0, startY: 0, pulled: 0, moved: false, endedAt: 0 });
  const swing = useRef({ theta: 0, omega: 0, frame: 0, last: 0, held: false });
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = swing.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  const applySwing = () => {
    const el = swingRef.current;
    if (el) el.style.transform = `rotate(${swing.current.theta.toFixed(4)}rad)`;
  };

  /** Damped pendulum; runs only while the lamp is moving. */
  const runSwing = () => {
    const s = swing.current;
    if (s.frame || reduced.current) return;
    s.last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.033, (now - s.last) / 1000);
      s.last = now;
      if (!s.held) {
        s.omega += (-SWING_K * Math.sin(s.theta) - SWING_DAMP * s.omega) * dt;
        s.theta += s.omega * dt;
      }
      applySwing();
      if (!s.held && Math.abs(s.theta) < 0.0015 && Math.abs(s.omega) < 0.01) {
        s.theta = s.omega = 0;
        applySwing();
        s.frame = 0;
        return;
      }
      s.frame = requestAnimationFrame(step);
    };
    s.frame = requestAnimationFrame(step);
  };

  const kick = (strength: number) => {
    if (reduced.current) return;
    swing.current.omega += (Math.random() < 0.5 ? -1 : 1) * strength;
    runSwing();
  };

  const toggle = () => {
    const next = on ? "off" : "on";
    toggleTheme();
    setFlash((f) => ({ n: (f?.n ?? 0) + 1, kind: next }));
    kick(1.6);
    trackEvent("Lamp pulled", { to: on ? "dark" : "light" });
  };

  // Cord + knob follow the pull (transform only); spring back with an overshoot.
  const setPull = (px: number, spring: boolean) => {
    const cord = cordRef.current;
    const knob = knobRef.current;
    if (!cord || !knob) return;
    const t = spring ? "transform 0.6s cubic-bezier(0.3, 1.8, 0.5, 1)" : "none";
    cord.style.transition = t;
    knob.style.transition = t;
    cord.style.transform = `scaleY(${(BASE + px) / BASE})`;
    knob.style.transform = `translate3d(0, ${px}px, 0)`;
  };

  const tug = () => {
    setPull(PULL_TRIGGER, false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPull(0, true)));
  };

  const burstKey = flash ? `${flash.kind}-${flash.n}` : "none";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Light theme"
      title={on ? "Pull to turn the light off" : "Pull to turn the light on"}
      className={`lamp group flex touch-none flex-col items-center outline-none select-none ${className}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { active: true, startX: e.clientX, startY: e.clientY, pulled: 0, moved: false, endedAt: 0 };
        swing.current.held = true;
        swing.current.omega = 0;
        setPulling(true);
        runSwing();
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active) return;
        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;
        if (Math.abs(dy) > 4 || Math.abs(dx) > 4) d.moved = true;
        // rubber-band: resistance grows the further it is pulled
        d.pulled = Math.max(0, Math.min(MAX_PULL, dy * (1 - Math.min(dy, MAX_PULL * 2) / (MAX_PULL * 4))));
        setPull(d.pulled, false);
        // tilt toward a sideways pull
        const s = swing.current;
        const target = Math.max(-MAX_TILT, Math.min(MAX_TILT, Math.atan2(-dx, BASE + 60 + d.pulled)));
        const prev = s.theta;
        s.theta += (target - s.theta) * 0.5;
        s.omega = (s.theta - prev) * 60;
      }}
      onPointerUp={() => {
        const d = drag.current;
        if (!d.active) return;
        d.active = false;
        swing.current.held = false;
        setPulling(false);
        if (d.moved) d.endedAt = performance.now();
        if (d.moved && d.pulled >= PULL_TRIGGER) toggle();
        else kick(0.6);
        setPull(0, true);
      }}
      onPointerCancel={() => {
        drag.current.active = false;
        swing.current.held = false;
        setPulling(false);
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
      <span ref={swingRef} className="flex origin-top flex-col items-center will-change-transform">
        <span ref={cordRef} aria-hidden="true" className="block w-px origin-top bg-gradient-to-b from-transparent via-fg-3/70 to-fg-3 will-change-transform" style={{ height: BASE }} />
        <span ref={knobRef} className="relative flex flex-col items-center will-change-transform">
          {/* light burst (switching on) */}
          {flash?.kind === "on" && (
            <span key={burstKey} aria-hidden="true" className="lamp-burst pointer-events-none absolute top-[18px] left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          )}

          {/* bulb / knob */}
          <span
            key={`bulb-${burstKey}`}
            aria-hidden="true"
            className={`relative grid size-9 cursor-grab place-items-center rounded-full border transition-[background-color,border-color,box-shadow,transform] duration-500 group-active:cursor-grabbing group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg ${
              pulling ? "scale-90" : "group-hover:scale-110"
            } ${
              on
                ? "border-amber-200 bg-amber-100 shadow-[0_0_18px_4px_rgb(251_191_36/0.55),0_0_60px_18px_rgb(251_191_36/0.25)]"
                : "border-slate-500/40 bg-slate-800 shadow-[0_0_14px_2px_rgb(59_130_246/0.35),inset_0_0_8px_rgb(148_163_184/0.25)]"
            } ${flash?.kind === "on" ? "lamp-flicker" : flash?.kind === "off" ? "lamp-fade" : ""}`}
          >
            {/* filament */}
            <span className={`size-3 rounded-full transition-colors duration-500 ${on ? "bg-amber-400 shadow-[0_0_10px_3px_rgb(251_191_36/0.8)]" : "bg-slate-300/80"}`} />
          </span>

          {/* pull hint */}
          <svg
            aria-hidden="true"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            className={`mt-1.5 text-fg-3 transition-opacity duration-300 motion-safe:animate-bounce ${pulling ? "opacity-0" : "opacity-100"}`}
          >
            <path d="M3.5 5.5 7 9l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </button>
  );
}
