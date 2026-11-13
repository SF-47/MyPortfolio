import type { CSSProperties } from "react";
import { experience, type Experience, type ExperienceLink } from "../../data/experience";
import { SectionHeader } from "../ui/SectionHeader";
import { ArrowUpRight } from "../ui/icons";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const secondary = `group/l inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-[13px] leading-none font-medium text-fg-2 transition-[border-color,color] hover:border-accent/50 hover:text-fg ${focus}`;
const primary = `group/l inline-flex items-center gap-1.5 rounded-full bg-btn px-4 py-2 text-[13px] leading-none font-medium text-btn-fg shadow-raised transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:shadow-float active:scale-[0.98] ${focus}`;

function EntryLink({ link, strong }: { link: ExperienceLink; strong?: boolean }) {
  return (
    <a href={link.href} className={strong ? primary : secondary} {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {link.label}
      <ArrowUpRight className="transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
      {link.external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

function Entry({ item, index }: { item: Experience; index: number }) {
  const big = item.featured;
  return (
    <li className="relative pl-8 sm:pl-10">
      {/* timeline node */}
      <span aria-hidden="true" className="absolute top-7 left-0 grid size-6 place-items-center">
        <span
          className={`rounded-full ${
            big ? "size-3 bg-accent shadow-[0_0_10px_2px_rgb(59_130_246/0.55)]" : "size-2.5 border-2 border-line-strong bg-bg"
          }`}
        />
      </span>

      <article
        data-reveal
        style={{ "--d": `${index * 110}ms` } as CSSProperties}
        aria-labelledby={`${item.id}-title`}
        className={`shell ${big ? "[--r:2rem]" : "[--r:1.5rem]"}`}
      >
        <div className={`core relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 ${big ? "p-6 sm:p-8" : "p-5 sm:p-6"}`} data-spotlight>
          {big && <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-accent/15 blur-3xl" />}

          <div className="relative z-[2] lg:max-w-xl">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase sm:tracking-[0.16em]">
              <span className="text-accent">{item.kind}</span> · {item.period}
            </p>
            <h3 id={`${item.id}-title`} className={`mt-2.5 font-semibold tracking-tight text-fg ${big ? "text-2xl sm:text-[28px]" : "text-xl"}`}>
              {item.role}
            </h3>
            <p className="mt-1 text-fg-2">
              {item.org} <span className="text-fg-3">· {item.place}</span>
            </p>
            <p className="mt-3 leading-relaxed text-fg-3">{item.summary}</p>
          </div>

          <div className="relative z-[2] flex flex-col gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              {item.links.map((l, i) => (
                <EntryLink key={l.href} link={l} strong={big && i === 0} />
              ))}
            </div>
            {item.credentialId && (
              <p className="font-mono text-[11px] tracking-wider text-muted">
                Credential ID <span className="text-fg-3">{item.credentialId}</span>
              </p>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader id="experience-title" index="02" label="Experience" title="Where I've" muted="worked." aside="Internships and client work, newest first." />

      <ol className="relative space-y-5 sm:space-y-6">
        <span aria-hidden="true" className="absolute top-8 bottom-8 left-3 w-px bg-gradient-to-b from-accent/60 via-line-strong to-line" />
        {experience.map((item, i) => (
          <Entry key={item.id} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
}
