import { useState, type CSSProperties } from "react";
import { profile } from "../../data/profile";
import { trackEvent } from "../../lib/analytics";
import { useLocalTime } from "../../hooks/useLocalTime";
import { SectionHeader } from "../ui/SectionHeader";
import { ArrowUpRight, FileIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "../ui/icons";
import { ContactForm } from "./ContactForm";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          trackEvent("Email copied");
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] tracking-wider text-fg-2 uppercase transition-[background-color,color,transform] duration-300 hover:bg-tint hover:text-fg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}

const channels = [
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, icon: <LinkedInIcon size={18} /> },
  { label: "GitHub", value: profile.githubHandle, href: profile.github, icon: <GitHubIcon size={19} /> },
  { label: "Résumé", value: "PDF · 1 page", href: profile.cv, icon: <FileIcon size={18} /> },
];

export function ContactSection() {
  const time = useLocalTime(profile.timeZone);

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader
        id="contact-title"
        index="05"
        label="Contact"
        title="Let's work"
        muted="together."
        aside="Have a role, a project or a question about something I built? Send a message and it lands in my inbox."
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div data-reveal="left" className="shell [--r:2rem]">
          <div className="core" data-spotlight>
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-accent/12 blur-3xl" />
            <div className="relative z-[2]">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div data-reveal="right" className="shell [--r:2rem]">
            <div className="core p-6" data-spotlight>
              <p className="relative z-[2] font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Or email directly</p>
              <a
                href={`mailto:${profile.email}`}
                className="relative z-[2] mt-3 flex items-center gap-2.5 text-lg font-semibold tracking-tight break-all text-fg transition-colors hover:text-accent sm:text-xl"
              >
                <MailIcon size={20} className="shrink-0 text-accent" />
                {profile.email}
              </a>
              <div className="relative z-[2] mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <PinIcon size={12} /> {profile.location}
                  </span>
                  <span>
                    <time className="text-fg-2">{time}</time> local
                  </span>
                </p>
                <CopyEmail />
              </div>
            </div>
          </div>

          <ul className="grid flex-1 gap-3">
            {channels.map((c, i) => (
              <li key={c.label} data-reveal="right" style={{ "--d": `${100 + i * 90}ms` } as CSSProperties}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="shell shell-hover group flex h-full [--gap:4px] [--r:1.25rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="core flex w-full items-center gap-4 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-tint text-fg-2 transition-[transform,color] duration-500 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:text-fg">
                      {c.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-fg">{c.label}</span>
                      <span className="block truncate font-mono text-xs text-muted">{c.value}</span>
                    </span>
                    <span className="grid size-8 place-items-center rounded-full bg-tint ring-1 ring-line transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <ArrowUpRight size={12} />
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
