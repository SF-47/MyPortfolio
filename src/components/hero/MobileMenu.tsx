import { useEffect, useRef, useState, type CSSProperties } from "react";
import { profile, sections } from "../../data/profile";

/** Below md: floating island with a hamburger that morphs into an X and opens a full-screen menu. */
export function MobileMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const t = window.setTimeout(() => firstLink.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div
        className="rise-in nav-glass fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full p-1.5 pl-2 shadow-float"
        style={{ "--d": "650ms" } as CSSProperties}
      >
        <a href="#home" aria-label="Sami Farhat, home" onClick={() => setOpen(false)} className="grid h-9 w-16 place-items-center rounded-full bg-[#0b131e]">
          <img src="/brand/sf-logo.png" alt="" width={385} height={145} className="w-[74%]" />
        </a>
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-9 place-items-center rounded-full bg-tint ring-1 ring-line transition-transform duration-300 active:scale-95"
        >
          <span className={`absolute h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
          <span className={`absolute h-[1.5px] w-4 rounded-full bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
        </button>
      </div>

      <div
        id="mobile-menu"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-bg/[0.97] px-6 pt-28 pb-10 backdrop-blur-2xl transition-opacity duration-500 ease-[var(--ease-out-expo)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Sections">
          <ul className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id} className="overflow-hidden">
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === s.id ? "true" : undefined}
                  className="menu-link flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight text-fg"
                  style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                >
                  <span className="font-mono text-xs text-accent">{String(i).padStart(2, "0")}</span>
                  <span className={active === s.id ? "text-fg" : "text-fg-3"}>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-link space-y-3" style={{ transitionDelay: open ? "460ms" : "0ms" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
            <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
            {profile.status}
          </span>
          <a href={`mailto:${profile.email}`} className="block text-lg text-fg-2">
            {profile.email}
          </a>
        </div>
      </div>
    </div>
  );
}
