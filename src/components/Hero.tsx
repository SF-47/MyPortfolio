import { heroStack, profile, socialLinks } from '../data/portfolioData'

export function Hero() {
  return (
    <section className="page pb-16 pt-28 md:pb-24 md:pt-40" id="home">
      <div className="rise mono mb-10 flex flex-wrap items-center justify-between gap-3 text-ink-soft md:mb-16" style={{ '--i': 0 } as React.CSSProperties}>
        <span>Portfolio / 2026</span>
        <span>{profile.location}</span>
        <span className="flex items-center gap-2 text-ink">
          <span className="dot-live" aria-hidden="true" />
          Open to work
        </span>
      </div>

      <h1 className="display rise whitespace-nowrap text-[18vw] md:text-[clamp(60px,15.5vw,236px)]" style={{ '--i': 1 } as React.CSSProperties}>
        Sami <em className="text-accent">Farhat</em>
      </h1>

      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
        <div className="rise md:col-span-5" style={{ '--i': 2 } as React.CSSProperties}>
          <p className="display text-[34px] md:text-[44px]">{profile.title}</p>
          <p className="mono mt-4 text-accent">{profile.specialization}</p>
        </div>
        <div className="rise md:col-span-6 md:col-start-7" style={{ '--i': 3 } as React.CSSProperties}>
          <p className="lede">{profile.summary}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a className="btn btn-solid" href="#work">
              View projects ↓
            </a>
            <a className="btn" href="/cv.pdf" download>
              Download CV
            </a>
            {socialLinks.map((link) =>
              link.href ? (
                <a
                  className="arrow-link self-start sm:self-center"
                  href={link.href}
                  key={link.label}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-label={`Open Sami Farhat's ${link.label} profile`}
                >
                  {link.label} ↗
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <ul className="rise mt-16 flex flex-wrap gap-x-8 gap-y-3 border-y border-ink py-5 md:mt-24 md:justify-between" style={{ '--i': 4 } as React.CSSProperties}>
        {heroStack.map((item) => (
          <li className="mono" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
