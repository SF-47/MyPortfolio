import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import { ArrowUpRight, GitHubIcon } from "../ui/icons";

/**
 * ID badge hanging from an elastic lanyard strap.
 *  - swing: strap + badge rotate as a pendulum around the anchor at the top;
 *  - stretch: pulling the badge away from the anchor stretches the strap (with growing
 *    resistance), and it snaps back with a bounce on release;
 *  - tilt: on devices with a fine pointer, the badge leans toward the cursor in 3D;
 *  - flip: a click, tap, Enter or Space turns it over to a spec sheet.
 * A drag (more than DRAG_SLOP px) swings instead of flipping. The animation loop only runs
 * while something is moving and sleeps once everything has settled. Under
 * prefers-reduced-motion there is no tilt, releases are critically damped and the flip is instant.
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
const REST = 0.002; // rad (~0.1°): invisible, lets the loop sleep sooner
const DRAG_SLOP = 6; // px of movement before a press counts as a drag, not a flip
const TILT_X = 12; // deg, max lean toward the cursor (up/down)
const TILT_Y = 16; // deg (left/right)

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
  const [flipped, setFlipped] = useState(false);
  // lets the event handlers (set up once) give the badge a little swing when it flips
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    const lower = lowerRef.current;
    if (!root || !swing || !card || !strap || !lower) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const canTilt = () => finePointer.matches && !reduced.matches;
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
    // tilt: current and target lean, in degrees
    let tiltX = 0;
    let tiltY = 0;
    let goalX = 0;
    let goalY = 0;
    // press tracking, to tell a click (flip) from a drag (swing)
    let downAt = { x: 0, y: 0 };
    let moved = false;
    let dragEndedAt = 0;

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
      // Lean toward the cursor, plus a little turn while it swings, for depth.
      const turn = Math.max(-25, Math.min(25, omega * 9));
      card.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${(tiltY + turn).toFixed(2)}deg)`;
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
        const damping = reduced.matches ? DAMPING_REDUCED : DAMPING;
        // A longer strap swings more slowly (pendulum: ω² ∝ 1/L).
        const stiffness = STIFFNESS / (1 + stretch / 250);
        omega += (-stiffness * Math.sin(theta) - damping * omega) * dt;
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
      // ease the tilt toward its target (critically damped feel, no overshoot)
      const k = 1 - Math.exp(-dt * 12);
      tiltX += (goalX - tiltX) * k;
      tiltY += (goalY - tiltY) * k;
      apply();
      const settled =
        !dragging &&
        Math.abs(omega) < REST &&
        Math.abs(theta) < REST &&
        Math.abs(stretchV) < 0.05 &&
        Math.abs(stretch) < 0.05 &&
        Math.abs(goalX - tiltX) < 0.02 &&
        Math.abs(goalY - tiltY) < 0.02;
      if (settled) {
        theta = omega = stretch = stretchV = 0;
        tiltX = goalX;
        tiltY = goalY;
        apply();
      }
      frame = visible && !settled ? requestAnimationFrame(step) : 0;
    };

    const onDown = (e: PointerEvent) => {
      // the GitHub link on the back works like a normal link: no drag, no flip
      if ((e.target as Element).closest("a")) return;
      if (e.button !== 0) return;
      downAt = { x: e.clientX, y: e.clientY };
      moved = false;
      goalX = goalY = 0; // flatten while held
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
      if (!dragging) {
        // hover tilt (desktop only)
        if (!canTilt() || e.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
        goalX = (0.5 - py) * TILT_X * 2;
        goalY = (px - 0.5) * TILT_Y * 2;
        wake();
        return;
      }
      if (!moved && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < DRAG_SLOP) return;
      moved = true;
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
      if (moved) dragEndedAt = performance.now();
      omega = Math.max(-8, Math.min(8, omega));
      stretchV = Math.max(-1500, Math.min(1500, stretchV));
      delete card.dataset.dragging;
    };

    const onLeave = () => {
      goalX = goalY = 0;
      wake();
    };

    // One handler for mouse, touch and keyboard (Enter/Space on the button fire "click").
    // A drag that just ended, or a click on the GitHub link, does not flip.
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a")) return;
      if (performance.now() - dragEndedAt < 350) return;
      setFlipped((f) => !f);
    };

    kickRef.current = () => {
      if (reduced.matches) return;
      omega += 0.9;
      wake();
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
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("click", onClick);
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
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("click", onClick);
      kickRef.current = () => {};
    };
  }, []);

  // a small swing each time it turns over
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    kickRef.current();
  }, [flipped]);

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

        {/* badge: drag + tilt surface */}
        <div
          ref={cardRef}
          className="badge relative -mt-1 w-[var(--card-w)] cursor-grab touch-none data-[dragging=true]:cursor-grabbing"
          style={{ aspectRatio: "0.72" }}
        >
          <button
            type="button"
            aria-pressed={flipped}
            aria-label={flipped ? "ID badge, spec sheet side. Flip back to the front" : "ID badge. Flip to see the spec sheet"}
            aria-describedby={flipped ? "badge-back" : "badge-front"}
            className="badge-hit absolute inset-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
          >
            <span className={`badge-flipper ${flipped ? "is-flipped" : ""}`}>
              {/* front */}
              <span id="badge-front" aria-hidden={flipped} className="badge-face p-[calc(var(--card-w)*0.08)]">
                <span aria-hidden="true" className="mx-auto mb-[8%] block h-2 w-12 rounded-full bg-[var(--badge-slot)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.5)]" />
                {/* turn-over hint */}
                <svg aria-hidden="true" viewBox="0 0 16 16" className="badge-hint absolute top-[7%] right-[8%] size-[calc(var(--card-w)*0.07)] text-[var(--badge-muted)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.5v2.3h-2.3" />
                </svg>

                <span className="flex h-[calc(100%-1.5rem)] flex-col text-left">
                  {/* the logo as a stencil, filled with the same accent as "Sami Farhat" in the hero */}
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-[9%] block aspect-[356/127] w-[86%] bg-accent [mask:url(/brand/sf-logo-mark.webp)_center/contain_no-repeat] [-webkit-mask:url(/brand/sf-logo-mark.webp)_center/contain_no-repeat]"
                  />
                  <span className="mt-auto block">
                    <span aria-hidden="true" className="mb-3 block h-px bg-gradient-to-r from-[var(--badge-accent)] via-[var(--badge-border)] to-transparent opacity-70" />
                    <span className="block text-[calc(var(--card-w)*0.085)] leading-tight font-semibold text-[var(--badge-fg)]">{profile.name}</span>
                    <span className="mt-0.5 block text-[calc(var(--card-w)*0.056)] text-[var(--badge-accent)]">Software Engineer</span>
                    <span className="mt-3 flex items-center justify-between font-mono text-[calc(var(--card-w)*0.042)] tracking-wider text-[var(--badge-muted)] uppercase">
                      <span>ID · SF-47</span>
                      <span>Beirut, LB</span>
                    </span>
                  </span>
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--badge-sheen)] via-transparent to-transparent" />
              </span>

              {/* back: spec sheet */}
              <span id="badge-back" aria-hidden={!flipped} className="badge-face badge-back p-[calc(var(--card-w)*0.08)] text-left">
                <span aria-hidden="true" className="mx-auto mb-[6%] block h-2 w-12 rounded-full bg-[var(--badge-slot)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.5)]" />
                <span className="flex items-baseline justify-between font-mono text-[calc(var(--card-w)*0.045)] tracking-[0.14em] uppercase">
                  <span className="text-[var(--badge-accent)]">Spec sheet</span>
                  <span className="text-[var(--badge-muted)]">SF-47</span>
                </span>
                <span aria-hidden="true" className="mt-[4%] mb-[4%] block h-px bg-[var(--badge-border)]" />
                <span className="grid gap-[calc(var(--card-w)*0.022)] sm:gap-[calc(var(--card-w)*0.028)]">
                  {[
                    ["Role", profile.role],
                    ["Base", profile.location],
                    ["Stack", profile.coreStack.join(" · ")],
                    ["Education", "B.Sc. Computer Science, 2026"],
                  ].map(([k, v]) => (
                    <span key={k} className="block">
                      <span className="block font-mono text-[calc(var(--card-w)*0.036)] tracking-[0.14em] text-[var(--badge-muted)] uppercase">{k}</span>
                      <span className="mt-[1px] block text-[calc(var(--card-w)*0.048)] leading-[1.25] sm:text-[calc(var(--card-w)*0.052)] sm:leading-[1.3] font-medium text-[var(--badge-fg)]">{v}</span>
                    </span>
                  ))}
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-bl from-[var(--badge-sheen)] via-transparent to-transparent" />
              </span>
            </span>
          </button>

          {/* GitHub link: beside the button (never inside it), shown with the back */}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            tabIndex={flipped ? 0 : -1}
            aria-hidden={!flipped}
            className={`badge-link absolute inset-x-[8%] bottom-[6%] z-10 flex items-center justify-between rounded-lg border border-[var(--badge-border)] px-[calc(var(--card-w)*0.045)] py-[calc(var(--card-w)*0.03)] font-mono text-[calc(var(--card-w)*0.048)] text-[var(--badge-fg)] transition-[opacity,background-color,border-color] hover:border-[var(--badge-accent)] hover:bg-[var(--badge-accent)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              flipped ? "is-shown" : ""
            }`}
          >
            <span className="flex items-center gap-1.5">
              <GitHubIcon size={12} />
              github.com/{profile.githubHandle}
            </span>
            <ArrowUpRight size={10} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        </div>
      </div>
    </div>
  );
}
