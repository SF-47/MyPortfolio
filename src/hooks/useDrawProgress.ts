import { useEffect, type RefObject } from "react";

/**
 * Sets --draw (0 → 1) on an element as it scrolls into view, so its contents can draw
 * themselves in step with the scroll. Desktop and normal motion only; everywhere else it is
 * 1 straight away. Progress only ever increases (no un-drawing on scroll back), and the
 * scroll listener exists only while the element is on screen and removes itself once done.
 */
export function useDrawProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (v: number) => el.style.setProperty("--draw", v.toFixed(3));
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!wide.matches || reduced.matches) {
      set(1);
      return;
    }

    let progress = 0;
    let frame = 0;
    let listening = false;
    set(0);

    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // starts when the top is 85% down the screen, complete by the time it reaches 30%
      const t = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
      if (t > progress) {
        progress = t;
        set(progress);
      }
      if (progress >= 1) stop();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const start = () => {
      if (listening || progress >= 1) return;
      listening = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    };
    const stop = () => {
      listening = false;
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : (listening = false, window.removeEventListener("scroll", onScroll))));
    io.observe(el);
    const finish = () => {
      progress = 1;
      set(1);
      stop();
    };
    reduced.addEventListener("change", finish);
    wide.addEventListener("change", finish);

    return () => {
      stop();
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", finish);
      wide.removeEventListener("change", finish);
    };
  }, [ref]);
}
