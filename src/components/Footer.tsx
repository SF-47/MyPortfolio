import { profile, socialLinks } from '../data/portfolioData'

export function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-container flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="label-caps text-on-surface">(c) 2026 {profile.name} - Built in Beirut</p>
        <div className="flex flex-wrap gap-6">
          {socialLinks.map((link) =>
            link.href ? (
              <a className="meta-num text-on-surface-variant underline underline-offset-4 transition hover:text-primary" href={link.href} key={link.label} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>
                {link.label}
              </a>
            ) : (
              <span className="meta-num text-on-surface-variant" key={link.label}>{link.label}</span>
            ),
          )}
          <a className="meta-num text-on-surface-variant underline underline-offset-4 transition hover:text-primary" href="#home">Top</a>
        </div>
      </div>
    </footer>
  )
}
