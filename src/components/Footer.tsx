import { profile, socialLinks } from '../data/portfolioData'

export function Footer() {
  return (
    <footer className="border-t border-ink">
      <div className="page flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="mono">
          © 2026 {profile.name} · Built in Beirut
        </p>
        <div className="flex flex-wrap gap-6">
          {socialLinks.map((link) =>
            link.href ? (
              <a
                className="arrow-link"
                href={link.href}
                key={link.label}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
              >
                {link.label} ↗
              </a>
            ) : (
              <span className="mono text-ink-soft" key={link.label}>
                {link.label}
              </span>
            ),
          )}
          <a className="arrow-link" href="#home">
            Top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
