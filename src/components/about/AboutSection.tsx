import type { CSSProperties, ReactNode } from "react";
import { profile } from "../../data/profile";
import { useLocalTime } from "../../hooks/useLocalTime";
import { SectionHeader } from "../ui/SectionHeader";
import { ArrowUpRight } from "../ui/icons";
import { StackDiagram } from "./StackDiagram";

const record: { icon: ReactNode; label: string; title: string; sub: string; link?: { label: string; href: string } }[] = [
  {
    icon: <path d="m2 9 10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />,
    label: "Degree",
    title: "B.Sc. Computer Science",
    sub: "Islamic University of Lebanon · July 2026",
  },
  {
    icon: <path d="m8 6-6 6 6 6M16 6l6 6-6 6" />,
    label: "Freelance",
    title: "Shawarma Story",
    sub: "Frontend developer · Jan – Jul 2026",
    link: { label: "Live site", href: "https://shawarmastory.com" },
  },
  {
    icon: <path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16" />,
    label: "Internship",
    title: "TechTalks Community",
    sub: "Frontend intern · Nov – Dec 2025",
    link: { label: "Certificate", href: "https://verify.techtalkslb.com/" },
  },
  {
    icon: <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />,
    label: "Competition",
    title: "Semicolon CTF",
    sub: "Cybersecurity challenges",
  },
];

function StatusCard() {
  const time = useLocalTime(profile.timeZone);
  return (
    <div data-reveal style={{ "--d": "120ms" } as CSSProperties} className="shell flex-1 [--r:2rem]">
      <div className="core flex h-full flex-col justify-between gap-8 p-6 sm:p-7" data-spotlight>
        {/* soft green glow */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative z-[2]">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {profile.status}
          </span>
          <p className="mt-5 text-2xl leading-snug font-semibold tracking-tight text-fg sm:text-[26px]">{profile.statusDetail}</p>
        </div>

        <div className="relative z-[2] flex flex-wrap items-end justify-between gap-5">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-1">
            <dt className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Based in</dt>
            <dt className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Languages</dt>
            <dd className="text-sm text-fg-2">
              Beirut · <time className="font-mono text-fg">{time}</time>
            </dd>
            <dd className="text-sm text-fg-2">Arabic, English</dd>
          </dl>
          <a
            href="#contact"
            className="group/cta inline-flex items-center gap-2.5 rounded-full bg-btn py-1.5 pr-1.5 pl-4 text-sm font-medium text-btn-fg shadow-raised transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:shadow-float active:scale-[0.98]"
          >
            Get in touch
            <span className="grid size-8 place-items-center rounded-full bg-btn-fg/10 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-px group-hover/cta:scale-105">
              <ArrowUpRight size={12} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function RecordCard() {
  return (
    <div data-reveal style={{ "--d": "220ms" } as CSSProperties} className="shell [--r:2rem]">
      <ul className="core divide-y divide-line">
        {record.map((r) => (
          <li key={r.title} className="group/row flex items-center gap-4 px-5 py-4 transition-colors duration-300 hover:bg-tint">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-tint text-accent transition-transform duration-500 ease-[var(--ease-spring)] group-hover/row:scale-110 group-hover/row:-rotate-6">
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                {r.icon}
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{r.label}</span>
              <span className="mt-0.5 block font-medium text-fg">{r.title}</span>
              <span className="block text-sm text-fg-3">{r.sub}</span>
            </span>
            {r.link && (
              <a
                href={r.link.href}
                target="_blank"
                rel="noreferrer"
                className="group/l inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-fg-2 transition-[border-color,color] hover:border-line-strong hover:text-fg"
              >
                {r.link.label}
                <ArrowUpRight className="transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader id="about-title" index="01" label="About" title="From Beirut," muted="building end to end." />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8">
        <div className="flex flex-col gap-8">
          <p data-reveal className="text-xl leading-relaxed text-fg-2 sm:text-[22px] sm:leading-relaxed">
            I graduated in Computer Science in 2026 and I like taking a feature all the way: the schema, the API behind it, and the
            screen people actually touch. <span className="text-fg">Findly</span> was built that way across three apps, and{" "}
            <span className="text-fg">Shawarma Story</span> is live at a real restaurant.
          </p>
          <StackDiagram />
        </div>

        <div className="flex flex-col gap-5">
          <StatusCard />
          <RecordCard />
        </div>
      </div>
    </section>
  );
}
