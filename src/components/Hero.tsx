import { profile, socialLinks } from '../data/portfolioData'

export function Hero() {
  return (
    <section className="section-shell grid items-start border-b border-outline-variant pt-16 md:min-h-screen md:grid-cols-[45%_55%] md:items-center md:pt-20" id="home">
      <div className="py-16 md:py-20 md:pr-10">
        <p className="meta-num mb-6 text-primary">[00] INTRODUCTION</p>
        <h1 className="editorial-title mb-8">{profile.name}.</h1>
        <p className="editorial-subtitle mb-10 text-on-surface-variant">{profile.title}.</p>
        <div className="max-w-[62ch] space-y-5 text-body text-on-surface-variant">
          <p>{profile.summary}</p>
          <p>{profile.growth}</p>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <a className="editorial-button editorial-button-primary" href="#work">
            View Projects
          </a>
          <a className="editorial-button" href="#contact">
            Contact Me
          </a>
          <button className="editorial-button cursor-not-allowed opacity-75" type="button" disabled title="Final CV PDF will be added later">
            CV Coming Soon
          </button>
        </div>
        <div className="mt-10 flex flex-wrap gap-6">
          {socialLinks.map((link) =>
            link.href ? (
              <a className="editorial-link" href={link.href} key={link.label} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>
                {link.label}
              </a>
            ) : (
              <span className="editorial-link text-on-surface-variant" key={link.label} aria-label={`${link.label} URL pending`}>
                {link.label}
              </span>
            ),
          )}
        </div>
      </div>
      <div className="grid-blueprint relative hidden min-h-[600px] items-center justify-center overflow-hidden border-l border-outline-variant md:flex">
        <div className="relative z-10 flex flex-col items-end p-12 text-right">
          <span className="hero-watermark">ENGINEER</span>
          <span className="hero-watermark">CODE</span>
          <span className="hero-watermark">BUILD</span>
          <div className="absolute bottom-12 right-12 flex items-center gap-4 text-primary">
            <span className="label-caps">BEIRUT / REMOTE</span>
            <span className="h-px w-12 bg-primary" />
          </div>
        </div>
      </div>
    </section>
  )
}
