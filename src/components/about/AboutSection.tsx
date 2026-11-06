import type { CSSProperties, ReactNode } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { ArrowUpRight } from "../ui/icons";

/**
 * Editorial About: a lead sentence, three short beats and a one-line record.
 * No cards: the section reads as text, which sets it apart from Projects and Skills.
 * Every statement comes from the CV and the project READMEs.
 */
const beats: { title: string; body: ReactNode }[] = [
  {
    title: "What I build",
    body: (
      <>
        Full-stack web and mobile apps. <strong className="font-medium text-fg">Findly</strong> is three of them working together: an
        ASP.NET Core API, a React admin dashboard and a React Native app for students.
      </>
    ),
  },
  {
    title: "How I work",
    body: <>Data and access first: a clear schema, versioned migrations, JWT and role-based permissions. Then the interface, built to work as well on a phone as on a laptop.</>,
  },
  {
    title: "What I care about",
    body: (
      <>
        Shipping to real people. <strong className="font-medium text-fg">Shawarma Story</strong>&apos;s menu is live at a restaurant in
        Lebanon, in English and Arabic, with orders going straight to WhatsApp.
      </>
    ),
  },
];

function RecordLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group/l inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline">
      {children}
      <ArrowUpRight className="transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const record: { label: string; value: ReactNode }[] = [
  { label: "Education", value: "B.Sc. Computer Science, Islamic University of Lebanon, 2026" },
  {
    label: "Freelance",
    value: (
      <>
        Shawarma Story, Jan – Jul 2026 · <RecordLink href="https://shawarmastory.com">live site</RecordLink>
      </>
    ),
  },
  {
    label: "Internship",
    value: (
      <>
        TechTalks Community, Nov – Dec 2025 · <RecordLink href="https://verify.techtalkslb.com/">certificate</RecordLink>
      </>
    ),
  },
  { label: "Also", value: "Semicolon CTF · Arabic (native), English" },
];

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="veil relative isolate mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader id="about-title" index="01" label="About" title="Who I am," muted="and how I work." />

      <p data-reveal className="max-w-[30ch] text-[1.75rem] leading-[1.25] font-medium tracking-tight text-balance text-fg sm:text-4xl sm:leading-[1.2] lg:text-[2.75rem]">
        A Computer Science graduate from Beirut who likes owning a feature from the first database table to the last detail on screen.
      </p>

      <ol className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
        {beats.map((b, i) => (
          <li key={b.title} data-reveal style={{ "--d": `${i * 120}ms` } as CSSProperties}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-line-strong" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-fg">{b.title}</h3>
            <p className="mt-2 leading-relaxed text-fg-3">{b.body}</p>
          </li>
        ))}
      </ol>

      <dl data-reveal className="mt-16 grid gap-x-10 gap-y-4 border-t border-line pt-8 sm:mt-20 md:grid-cols-2">
        {record.map((r) => (
          <div key={r.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-4">
            <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{r.label}</dt>
            <dd className="text-sm leading-relaxed text-fg-2">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
