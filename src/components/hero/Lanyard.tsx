import { useEffect, useRef } from "react";

/**
 * ID badge hanging from an elastic lanyard strap. Two springs:
 *  - swing: strap + badge rotate as a pendulum around the anchor at the top;
 *  - stretch: pulling the badge away from the anchor stretches the strap (with growing
 *    resistance), and it snaps back with a bounce on release.
 * Drag the badge in any direction to do both. Under prefers-reduced-motion there is no
 * idle sway and releases are critically damped (no oscillation).
 */

const MAX_ANGLE = 1.1; // rad, ~63°
const STIFFNESS = 9; // g/L, sets the swing period (~2.1 s)
const DAMPING = 0.9;
const DAMPING_REDUCED = 7;

const MAX_STRETCH = 170; // px, the strap can never get longer than this
const STRETCH_K = 170; // spring stiffness: ~0.5 s bounce
const STRETCH_DAMPING = 7;
const STRETCH_DAMPING_REDUCED = 26; // ≈ 2·√k, critically damped
/** Below this much motion the badge counts as settled and the loop sleeps. */
const REST = 0.0008;

/** Rubber band: follows 1:1 at first, then resists, never past MAX_STRETCH. */
const rubber = (raw: number) => (raw <= 0 ? 0 : MAX_STRETCH * (1 - Math.exp(-raw / MAX_STRETCH)));
/** Inverse of rubber(), to continue a drag from the current stretch. */
const unrubber = (s: number) => -MAX_STRETCH * Math.log(1 - Math.min(s, MAX_STRETCH - 0.01) / MAX_STRETCH);

export function Lanyard() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<HTMLDivElement>(null);
  const lowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    const lower = lowerRef.current;
    if (!root || !swing || !card || !strap || !lower) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The idle breeze keeps the loop running forever, so only use it where it's cheap.
    const breezy = () => !reduced.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let theta = reduced.matches ? 0 : 0.32; // start mid-swing so it settles in on load
    let omega = 0;
    let dragging = false;
    let grabOffset = 0;
    let lastMove = { theta: 0, stretch: 0, t: 0 };
    let stretch = 0; // px added to the strap
    let stretchV = 0;
    let grabDist = 0;
    let grabRaw = 0;
    let frame = 0;
    let last = performance.now();
    let visible = true;

    const anchor = () => {
      const r = root.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top };
    };
    // Angle of the pointer around the anchor, as a CSS rotation (clockwise positive).
    const pointerAngle = (x: number, y: number) => {
      const a = anchor();
      return -Math.atan2(x - a.x, y - a.y);
    };
    const pointerDist = (x: number, y: number) => {
      const a = anchor();
      return Math.hypot(x - a.x, y - a.y);
    };
    const clamp = (v: number) => Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, v));

    // Resting strap height, measured once and on resize (never per frame).
    let base = strap.offsetHeight;
    const measure = () => {
      base = strap.offsetHeight;
    };

    // Transforms only: no layout work per frame, so it stays smooth on phones.
    const apply = () => {
      swing.style.transform = `rotate(${theta.toFixed(4)}rad)`;
      // Stretch the strap from its top (the printed pattern stretches with it, like elastic)
      // and move the clip + badge down by the same amount.
      strap.style.transform = `scaleY(${((base + stretch) / base).toFixed(4)})`;
      lower.style.transform = `translate3d(0, ${stretch.toFixed(2)}px, 0)`;
      // A little turn of the badge while it moves, for depth.
      card.style.transform = `perspective(900px) rotateY(${Math.max(-25, Math.min(25, omega * 9)).toFixed(2)}deg)`;
    };

    const wake = () => {
      if (!frame && visible) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!dragging) {
        const breeze = breezy() ? 0.035 * Math.sin(now / 1400) : 0;
        const damping = reduced.matches ? DAMPING_REDUCED : DAMPING;
        // A longer strap swings more slowly (pendulum: ω² ∝ 1/L).
        const stiffness = STIFFNESS / (1 + stretch / 250);
        omega += (-stiffness * Math.sin(theta - breeze) - damping * omega) * dt;
        theta = clamp(theta + omega * dt);

        const sDamping = reduced.matches ? STRETCH_DAMPING_REDUCED : STRETCH_DAMPING;
        stretchV += (-STRETCH_K * stretch - sDamping * stretchV) * dt;
        stretch += stretchV * dt;
        // The strap can bounce back past rest, but only a little (it cannot compress much).
        if (stretch < -14) {
          stretch = -14;
          stretchV = Math.abs(stretchV) * 0.3;
        }
      }
      apply();
      const settled =
        !dragging && !breezy() && Math.abs(omega) < REST && Math.abs(theta) < REST && Math.abs(stretchV) < 0.05 && Math.abs(stretch) < 0.05;
      if (settled) {
        theta = omega = stretch = stretchV = 0;
        apply();
      }
      frame = visible && !settled ? requestAnimationFrame(step) : 0;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      card.setPointerCapture(e.pointerId);
      grabOffset = theta - pointerAngle(e.clientX, e.clientY);
      grabDist = pointerDist(e.clientX, e.clientY);
      grabRaw = unrubber(Math.max(0, stretch));
      lastMove = { theta, stretch, t: performance.now() };
      omega = 0;
      stretchV = 0;
      card.dataset.dragging = "true";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      theta = clamp(pointerAngle(e.clientX, e.clientY) + grabOffset);
      stretch = rubber(grabRaw + pointerDist(e.clientX, e.clientY) - grabDist);
      const dt = (now - lastMove.t) / 1000;
      if (dt > 0.008) {
        omega = (theta - lastMove.theta) / dt;
        stretchV = (stretch - lastMove.stretch) / dt;
        lastMove = { theta, stretch, t: now };
      }
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      omega = Math.max(-8, Math.min(8, omega));
      stretchV = Math.max(-1500, Math.min(1500, stretchV));
      delete card.dataset.dragging;
    };

    // Keyboard: left/right give the badge a push, down gives the strap a tug.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") omega -= 2.5;
      else if (e.key === "ArrowRight") omega += 2.5;
      else if (e.key === "ArrowDown") stretchV += 900;
      else return;
      e.preventDefault();
      wake();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    io.observe(root);
    window.addEventListener("resize", measure);

    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    card.addEventListener("keydown", onKey);
    apply();
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", measure);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      card.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="lanyard relative mx-auto h-full w-full select-none">
      <div ref={swingRef} className="absolute top-0 left-1/2 flex origin-top -translate-x-1/2 flex-col items-center will-change-transform">
        {/* strap: runs up past the top of the viewport */}
        <div ref={strapRef} aria-hidden="true" className="lanyard-strap -mt-24 h-[calc(var(--strap)+6rem)] w-9 origin-top will-change-transform">
          <span>{"</>  ".repeat(40)}</span>
        </div>

        <div ref={lowerRef} className="flex flex-col items-center will-change-transform">
        {/* clip */}
        <div aria-hidden="true" className="flex flex-col items-center">
          <div className="h-3 w-7 rounded-b-md bg-gradient-to-b from-zinc-400 to-zinc-600" />
          <div className="-mt-0.5 h-5 w-3.5 rounded-full border-[3px] border-zinc-500" />
          <div className="-mt-1 h-4 w-1 rounded-full bg-zinc-600" />
        </div>

        {/* badge */}
        <div
          ref={cardRef}
          tabIndex={0}
          role="img"
          aria-label="Sami Farhat ID badge with the SF logo. Drag it to swing it or pull it down to stretch the strap; the arrow keys do the same."
          className="group relative -mt-1 w-[var(--card-w)] cursor-grab touch-none rounded-2xl border border-[var(--badge-border)] bg-[var(--badge-bg)] p-[calc(var(--card-w)*0.08)] shadow-[var(--badge-shadow)] outline-none focus-visible:ring-2 focus-visible:ring-accent data-[dragging=true]:cursor-grabbing"
          style={{ aspectRatio: "0.72" }}
        >
          {/* punched slot */}
          <div className="mx-auto mb-[8%] h-2 w-12 rounded-full bg-[var(--badge-slot)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.5)]" />

          <div className="flex h-[calc(100%-1.5rem)] flex-col">
            {/* the logo as a stencil, filled with the same accent as "Sami Farhat" in the hero */}
            <span
              aria-hidden="true"
              className="mx-auto mt-[9%] block aspect-[356/127] w-[86%] bg-accent [mask:url(/brand/sf-logo-mark.webp)_center/contain_no-repeat] [-webkit-mask:url(/brand/sf-logo-mark.webp)_center/contain_no-repeat]"
            />

            <div className="mt-auto">
              <div className="mb-3 h-px bg-gradient-to-r from-[var(--badge-accent)] via-[var(--badge-border)] to-transparent opacity-70" />
              <p className="text-[calc(var(--card-w)*0.085)] leading-tight font-semibold text-[var(--badge-fg)]">Sami Farhat</p>
              <p className="mt-0.5 text-[calc(var(--card-w)*0.056)] text-[var(--badge-accent)]">Software Engineer</p>
              <div className="mt-3 flex items-center justify-between font-mono text-[calc(var(--card-w)*0.042)] tracking-wider text-[var(--badge-muted)] uppercase">
                <span>ID · SF-47</span>
                <span>Beirut, LB</span>
              </div>
            </div>
          </div>

          {/* sheen */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--badge-sheen)] via-transparent to-transparent" />
        </div>
        </div>
      </div>
    </div>
  );
}
