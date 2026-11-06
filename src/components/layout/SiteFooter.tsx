import { profile, sections } from "../../data/profile";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../ui/icons";

const social = [
  { label: "GitHub", href: profile.github, icon: <GitHubIcon size={17} /> },
  { label: "LinkedIn", href: profile.linkedin, icon: <LinkedInIcon size={16} /> },
  { label: "Email", href: `mailto:${profile.email}`, icon: <MailIcon size={17} /> },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
      <div data-reveal className="shell [--r:2rem]">
      <div className="core">
        {/* sweeping accent line along the top edge */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent motion-safe:animate-[footer-sweep_6s_ease-in-out_infinite]" />
        </div>

        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <a href="#home" className="group flex items-center gap-4" aria-label="Sami Farhat, back to top">
            <span className="grid h-12 w-24 place-items-center rounded-xl border border-white/10 bg-[#0b131e] shadow-raised transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-3 group-hover:scale-105">
              <img src="/brand/sf-logo.webp" alt="" width={385} height={145} className="w-[78%]" />
            </span>
            <span>
              <span className="block font-semibold text-fg">{profile.name}</span>
              <span className="block text-sm text-fg-3">{profile.role}</span>
            </span>
          </a>

          <a
            href="#home"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-line-strong px-4 py-2 text-sm text-fg-2 transition-[background-color,color,transform] duration-300 hover:bg-tint hover:text-fg active:scale-95 sm:self-auto"
          >
            Back to top
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </a>
        </div>

        <div className="flex flex-col gap-5 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="relative text-sm text-fg-3 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-fg hover:after:scale-x-100"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-2">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="grid size-10 place-items-center rounded-full border border-line text-fg-3 transition-[transform,color,border-color,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-line-strong hover:text-fg hover:shadow-raised"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      <p className="mt-4 flex flex-wrap justify-between gap-2 px-2 text-xs text-muted">
        <span>
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </span>
        <span>Tip: pull the lamp cord up top.</span>
      </p>
    </footer>
  );
}
