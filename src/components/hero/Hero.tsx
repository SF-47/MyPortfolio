import type { CSSProperties, ReactNode } from "react";
import { profile } from "../../data/profile";
import { ArrowUpRight, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "../ui/icons";
import { LampSwitch } from "./LampSwitch";
import { StatusBadge } from "../ui/StatusBadge";
import { Lanyard } from "./Lanyard";

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="panel grid size-12 place-items-center rounded-full text-fg-2 transition-[color,border-color,transform,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:shadow-raised hover:border-line-strong hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </a>
  );
}

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate min-h-[100dvh] overflow-hidden">
      <LampSwitch className="absolute top-0 right-5 z-20 sm:right-10" />

      <div className="mx-auto grid min-h-[100dvh] w-full max-w-6xl grid-rows-[auto_1fr] px-4 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:grid-rows-1 lg:gap-12">
        {/* badge column */}
        <div className="rise-in [--card-w:148px] [--strap:76px] h-[380px] sm:[--card-w:176px] sm:[--strap:100px] sm:h-[440px] lg:[--card-w:212px] lg:[--strap:200px] lg:h-full">
          <Lanyard />
        </div>

        {/* text column */}
        <div className="flex flex-col justify-center pb-24 lg:py-32">
          {/* role line, with availability joined on in green */}
          <p className="rise-in flex flex-wrap items-center gap-x-3 gap-y-2" style={{ "--d": "100ms" } as CSSProperties}>
            <span className="font-mono text-xs tracking-wider text-accent uppercase">{profile.role}</span>
            <span aria-hidden="true" className="h-px w-5 bg-fg-3/50" />
            <StatusBadge href="#contact" />
          </p>
          <h1 id="hero-title" style={{ "--d": "200ms" } as CSSProperties} className="rise-in mt-5 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Hi, I&apos;m <span className="text-accent">Sami Farhat</span>
          </h1>
          <p className="rise-in mt-4 flex items-center gap-2 font-mono text-sm text-fg-3" style={{ "--d": "320ms" } as CSSProperties}>
            <PinIcon />
            {profile.location}
          </p>
          <p className="rise-in mt-6 max-w-xl text-lg leading-relaxed text-fg-2" style={{ "--d": "420ms" } as CSSProperties}>{profile.intro}</p>

          <div className="rise-in mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "540ms" } as CSSProperties}>
            <a
              href="#projects"
              className="group/cta inline-flex items-center gap-3 rounded-full bg-btn py-1.5 pr-1.5 pl-5 text-sm font-medium text-btn-fg shadow-raised transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:shadow-float active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              View projects
              <span className="grid size-9 place-items-center rounded-full bg-btn-fg/10 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/cta:translate-y-0.5 group-hover/cta:scale-105">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2.5v7M3 6.5l3 3 3-3" />
                </svg>
              </span>
            </a>
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="panel group/cv inline-flex items-center gap-3 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-medium text-fg transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] hover:border-line-strong hover:shadow-raised active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Resume
              <span className="grid size-9 place-items-center rounded-full bg-tint ring-1 ring-line transition-transform duration-500 ease-[var(--ease-spring)] group-hover/cv:translate-x-0.5 group-hover/cv:-translate-y-px group-hover/cv:scale-105">
                <ArrowUpRight size={12} />
              </span>
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>

            <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-line-strong sm:block" />

            <div className="flex gap-2">
              <SocialLink href={profile.github} label="GitHub">
                <GitHubIcon size={20} />
              </SocialLink>
              <SocialLink href={profile.linkedin} label="LinkedIn">
                <LinkedInIcon />
              </SocialLink>
              <SocialLink href={`mailto:${profile.email}`} label={`Email ${profile.email}`}>
                <MailIcon />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#projects"
        aria-label="Scroll to projects"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-fg-3/60 pt-2">
          <span className="h-2 w-1 rounded-full bg-fg-3 motion-safe:animate-bounce" />
        </span>
      </a>
    </section>
  );
}
