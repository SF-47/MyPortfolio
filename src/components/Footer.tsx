import { profile, socialLinks } from '../data/portfolioData'
import { scrollToTarget } from '../lib/scroll'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-16">
      <div className="shell">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-center md:justify-between">
          <p className="mono text-mute">© 2026 {profile.name} · Built in Beirut</p>
          <div className="flex flex-wrap items-center gap-6">
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  className="mono text-mute transition-colors hover:text-cyan"
                  href={link.href}
                  key={link.label}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label} ↗
                </a>
              ) : null,
            )}
            <a
              className="mono text-mute transition-colors hover:text-cyan"
              href="#home"
              onClick={(event) => {
                event.preventDefault()
                scrollToTarget('#home')
              }}
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
      <p
        className="pointer-events-none -mb-[0.16em] select-none whitespace-nowrap text-center font-display text-[clamp(4rem,19vw,17rem)] font-bold leading-[0.85] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.14)]"
        aria-hidden="true"
      >
        SAMI FARHAT
      </p>
    </footer>
  )
}
