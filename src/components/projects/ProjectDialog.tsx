import { useEffect, useRef, useState } from "react";
import type { Project } from "../../data/projects";
import { tech } from "../../data/tech";
import { PhoneFrame } from "../ui/Frames";
import { TechLogo } from "../ui/TechLogo";
import { ArrowUpRight } from "../ui/icons";
import { ProjectLinks } from "./ProjectLinks";

type Props = { project: Project | null; open: boolean; onClose: () => void };

/** Rendered with key={project.slug} by the parent, so the gallery index resets per project. */
export function ProjectDialog({ project, open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    d.addEventListener("close", onDialogClose);
    return () => d.removeEventListener("close", onDialogClose);
  }, [onClose]);

  const p = project;
  const shots = p ? [...p.desktop.map((s) => ({ s, kind: "desktop" as const })), ...p.phone.map((s) => ({ s, kind: "phone" as const }))] : [];
  const current = shots[active];

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      className="project-dialog m-auto max-h-[92svh] w-[min(1080px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-line bg-bg p-0 text-fg-2 shadow-float backdrop:bg-transparent"
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {p && (
        <div className="max-h-[92svh] overflow-y-auto overscroll-contain [scrollbar-color:var(--line-strong)_transparent] [scrollbar-width:thin]">
          {/* header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-bg/90 px-5 py-4 backdrop-blur-md sm:px-8">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">{p.label}</p>
              <h3 id="project-dialog-title" className="mt-1 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {p.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close details"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg-2 transition-[transform,background-color] duration-300 hover:rotate-90 hover:bg-tint hover:text-fg"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 2l10 10M12 2 2 12" />
              </svg>
            </button>
          </div>

          {/* gallery */}
          {current && (
            <div className="border-b border-line bg-[#0b0d12] px-4 py-6 sm:px-8">
              <div key={`${p.slug}-${active}`} className="rise-in mx-auto grid min-h-[240px] place-items-center">
                {current.kind === "desktop" ? (
                  <img
                    src={current.s.src}
                    width={current.s.width}
                    height={current.s.height}
                    alt={current.s.alt}
                    className="max-h-[56svh] w-auto rounded-xl border border-white/10 shadow-float"
                  />
                ) : (
                  <PhoneFrame shot={current.s} className="w-[min(240px,60vw)]" eager />
                )}
              </div>
              {shots.length > 1 && (
                <div className="mt-5 flex justify-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Screenshots">
                  {shots.map(({ s, kind }, i) => (
                    <button
                      key={s.src}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={s.alt}
                      onClick={() => setActive(i)}
                      className={`shrink-0 overflow-hidden rounded-lg border transition-[opacity,transform,border-color] duration-300 ${
                        kind === "desktop" ? "h-12 w-20" : "h-14 w-7"
                      } ${i === active ? "scale-105 border-accent opacity-100" : "border-white/15 opacity-50 hover:opacity-90"}`}
                    >
                      <img src={s.srcSmall ?? s.src} alt="" className="h-full w-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* body */}
          <div className="grid gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div>
              <p className="text-[17px] leading-relaxed text-fg-2">{p.details.summary}</p>
              <ul className="mt-6 space-y-3">
                {p.details.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-fg-3">
                    <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-tint p-4">
                {p.details.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="font-mono text-[10px] tracking-wider text-muted uppercase">{f.label}</dt>
                    <dd className="mt-1 text-xs text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted uppercase">Stack</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.details.fullStack.map((n) => {
                    const t = tech(n) ?? tech(n.replace(/ \d+$/, "")) ?? tech(n.replace(/^Firebase .*/, "Firebase"));
                    return (
                      <li key={n} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-tint px-2 py-1 text-xs text-fg-2">
                        {t && <TechLogo t={t} size={14} />}
                        {n}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <ProjectLinks project={p} />
              {p.links.some((l) => l.kind === "repo") && (
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <ArrowUpRight /> Source and setup steps are in the repository README.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
