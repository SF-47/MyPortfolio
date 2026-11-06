import { useEffect, useRef, type CSSProperties } from "react";
import { sections } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import { MobileMenu } from "./MobileMenu";

const ids = sections.map((s) => s.id);

export function SiteNav() {
  const active = useActiveSection(ids);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Slide the highlight under the current link; on narrow screens keep it scrolled into view.
  useEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    // Measure the <li> (positioned inside the list), not the <a> (positioned inside its <li>).
    const link = list?.querySelector<HTMLElement>(`a[href="#${active}"]`)?.parentElement;
    if (!list || !pill || !link) return;
    const place = () => {
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.style.opacity = "1";
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <>
    <MobileMenu active={active} />
    <nav
      aria-label="Sections"
      className="rise-in fixed top-5 left-1/2 z-40 hidden w-max -translate-x-1/2 md:block"
      style={{ "--d": "650ms" } as CSSProperties}
    >
      <ul
        ref={listRef}
        className="nav-glass relative flex items-center gap-0.5 rounded-full p-1.5 shadow-float"
      >
        <span
          ref={pillRef}
          aria-hidden="true"
          className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-accent/15 opacity-0 ring-1 ring-accent/40 transition-[transform,width,opacity] duration-500 ease-[var(--ease-out-expo)]"
        />
        {sections.map((s) => {
          const current = active === s.id;
          return (
            <li key={s.id} className="relative shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={current ? "true" : undefined}
                className={`block rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  current ? "text-fg" : "text-fg-3 hover:text-fg"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
    </>
  );
}
