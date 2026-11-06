import type { CSSProperties } from "react";
import { skillGroups } from "../../data/skills";
import { tech } from "../../data/tech";
import { SectionHeader } from "../ui/SectionHeader";
import { TechLogo } from "../ui/TechLogo";

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader
        id="skills-title"
        index="03"
        label="Toolbox"
        title="Skills"
        muted="& tools."
        aside="What I build with day to day, grouped the way the projects above use them."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <article
            key={group.title}
            data-reveal
            style={{ "--d": `${(gi % 3) * 110}ms` } as CSSProperties}
            aria-labelledby={`skills-${gi}`}
            className="shell"
          >
            <div className="core flex flex-col p-5 sm:p-6" data-spotlight>
              <header className="relative z-[2] mb-5 flex items-center justify-between">
                <h3 id={`skills-${gi}`} className="text-lg font-semibold text-fg">
                  {group.title}
                </h3>
                <span
                  className="grid h-6 min-w-6 place-items-center rounded-full border border-accent/40 bg-accent/10 px-2 font-mono text-[11px] text-accent"
                  aria-label={`${group.skills.length} tools`}
                >
                  {group.skills.length}
                </span>
              </header>

              <ul className="relative z-[2] grid grid-cols-3 gap-3">
                {group.skills.map((name) => {
                  const t = tech(name);
                  return (
                    <li key={name}>
                      <div
                        tabIndex={0}
                        aria-label={name}
                        role="img"
                        style={{ "--brand": t?.brand ?? "var(--accent)" } as CSSProperties}
                        className="skill-tile has-tip group/tile relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl sm:gap-2.5 border border-line bg-tint p-2 shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {t && <TechLogo t={t} size={52} className="max-sm:!size-10 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/tile:scale-110 group-hover/tile:-rotate-3" />}
                        <span aria-hidden="true" className="text-center text-xs leading-tight text-fg-3 transition-colors group-hover/tile:text-fg">
                          {name}
                        </span>
                        <span aria-hidden="true" className="tip z-30 rounded-lg border border-line-strong bg-bg px-2.5 py-1 text-xs font-medium text-fg shadow-raised">
                          {name}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {group.also && (
                <p className="relative z-[2] mt-auto border-t border-line pt-4 text-[13px] leading-relaxed text-fg-3 [&:not(:first-child)]:mt-5">
                  <span className="mr-1.5 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Also</span>
                  {group.also.join(" · ")}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
