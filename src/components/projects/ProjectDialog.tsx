import { useEffect, useRef, useState } from "react";
import { caseStudies } from "../../data/caseStudies";
import type { Project } from "../../data/projects";
import { tech } from "../../data/tech";
import { PhoneFrame } from "../ui/Frames";
import { TechLogo } from "../ui/TechLogo";
import { ProjectLinks } from "./ProjectLinks";

type Props = { project: Project | null; open: boolean; onClose: () => void };

function CaseLabel({ n, title, className = "" }: { n: string; title: string; className?: string }) {
  return (
    <h4 className={`flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase ${className}`}>
      <span className="text-accent">{n}</span>
      <span className="text-fg-3">{title}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </h4>
  );
}

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
  const cs = p ? caseStudies[p.slug] : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="project-dialog-title"
      className="project-dialog m-auto max-h-[92svh] w-[min(1080px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-line bg-bg p-0 text-fg-2 shadow-float backdrop:bg-transparent"
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      {p && cs && (
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

          {/* body: the case study */}
          <div className="grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-12">
            <div className="min-w-0">
              <CaseLabel n="01" title="Problem" />
              <p className="mt-3 text-[17px] leading-relaxed text-fg">{cs.context}</p>

              <CaseLabel n="02" title="What I built" className="mt-10" />
              <p className="mt-3 leading-relaxed text-fg-2">{p.details.summary}</p>

              <CaseLabel n="03" title="Architecture" className="mt-10" />
              <ol aria-label="Request flow" className="mt-4 flex flex-wrap items-center gap-y-2">
                {cs.flow.map((step, i) => (
                  <li key={step} className="flex items-center">
                    {i > 0 && (
                      <span aria-hidden="true" className="mx-1.5 flex items-center text-accent/70">
                        <span className="h-px w-4 bg-current" />
                        <svg width="6" height="8" viewBox="0 0 6 8" fill="currentColor"><path d="M0 0l6 4-6 4z" /></svg>
                      </span>
                    )}
                    <span className="rounded-lg border border-line bg-tint px-2.5 py-1.5 font-mono text-[11.5px] text-fg-2">{step}</span>
                  </li>
                ))}
              </ol>

              <CaseLabel n="04" title="Key decisions" className="mt-10" />
              {/* decisions hang off one connector line */}
              <ol className="relative mt-5 space-y-6 border-l border-line pl-6">
                {cs.decisions.map((d) => (
                  <li key={d.title} className="relative">
                    <span aria-hidden="true" className="absolute top-[0.45em] -left-[29px] size-2.5 rounded-full border-2 border-bg bg-accent" />
                    <h5 className="font-semibold text-fg">{d.title}</h5>
                    <p className="mt-1 text-sm leading-relaxed text-fg-3">{d.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="min-w-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
              <div>
                <CaseLabel n="05" title="Outcome" />
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{cs.outcome}</p>
                {cs.next && (
                  <p className="mt-3 text-sm leading-relaxed text-fg-3">
                    <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">Next · </span>
                    {cs.next.join(" · ")}
                  </p>
                )}
              </div>
              <dl className="grid grid-cols-3 gap-3 border-y border-line py-4">
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
              <div>
                <CaseLabel n="06" title="Links" />
                <div className="mt-3">
                  <ProjectLinks project={p} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </dialog>
  );
}
