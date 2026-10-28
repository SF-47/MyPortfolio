import { Link } from 'react-router'
import { routes } from '../../app/meta'
import { ArchitectureDiagram } from '../architecture/ArchitectureDiagram'
import { SeamRuler } from '../layout/SeamRuler'
import { Surface } from '../layout/Surface'
import { ButtonLink } from '../ui/ButtonLink'
import { textLinkClass } from '../ui/textLinkClass'
import { chipClass } from '../ui/chipStyles'
import { profile, socialLinks } from '../../data/portfolioData'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { heroCanvasPadding, heroColumns } from './heroLayout'
import { MatchFieldPreview } from './MatchFieldPreview'
import { SelectedSystems } from './SelectedSystems'


// The home page hero: editorial paper column, dark engineering canvas, and the ruler seam
// between them. From xl up the two sit side by side and the shared header overlays the top
// 72px; below that they stack. Everything here is still: no animation runs.
export function Hero() {
  const wide = useMediaQuery('(min-width: 760px)')

  return (
    <div className={`xl:grid xl:min-h-[900px] ${heroColumns}`}>
      <Surface className="relative flex flex-col px-(--gutter) pb-9 pt-7 md:pt-9 xl:pl-(--gutter) xl:pr-[76px] xl:pt-[124px]" tone="paper">
        <SeamRuler className="absolute inset-y-0 right-0 hidden xl:block" edge="right" />
        <p className="mono-label eyebrow text-balance text-fg-muted">
          {profile.title} · Full-stack & Mobile
        </p>
        <h1 className="text-display mt-6 xl:text-[clamp(54px,4.45vw,64px)] md:mt-7">
          <span className="sr-only">{profile.name}: </span>
          Full-stack systems, <em>drawn end to end.</em>
        </h1>
        <p className="mt-6 max-w-[470px] font-serif text-[18px] leading-[1.5] text-fg-muted md:mt-7 md:text-[length:var(--text-lede)]">
          Computer Science graduate building APIs, admin dashboards and mobile apps with React, React Native, ASP.NET Core and PostgreSQL. The diagram is a simplified map of Findly, my largest
          project.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink className="max-md:flex-1 md:min-w-[176px]" to="/#work">
            View work <span aria-hidden="true">↓</span>
          </ButtonLink>
          <ButtonLink className="max-md:flex-1 md:min-w-[176px]" download href="/cv.pdf" variant="outline">
            Download CV
          </ButtonLink>
        </div>
        <p className="mt-3 flex flex-wrap gap-x-7">
          {socialLinks.map((link) =>
            link.href ? (
              <a className={textLinkClass} href={link.href} key={link.label} rel="noopener noreferrer" target="_blank">
                {link.label} →<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null,
          )}
        </p>
        <div className="mt-8 md:mt-10">
          <SelectedSystems />
        </div>
        <p className="mono-label mt-auto pt-7 text-fg-muted">● Open to work — {profile.location}</p>
      </Surface>

      <SeamRuler className="xl:hidden" edge="bottom" />

      <Surface className={`relative px-(--gutter) pb-12 pt-8 md:pb-14 xl:pb-[200px] xl:pt-[116px] ${heroCanvasPadding.column}`} tone="canvas">
        <div className="flex flex-wrap items-center gap-3">
          <p className="mono-label mr-auto text-fg-muted">Fig. 1 — Findly architecture, simplified</p>
          <Link className={chipClass(true)} to={`${routes.findly.path}#trace`}>
            Trace a request →
          </Link>
        </div>
        <div className="mt-7 xl:mt-9">
          <ArchitectureDiagram interactive={false} layout={wide ? 'wide' : 'tall'} merged />
        </div>
        <p className="mt-6">
          <Link className={`${textLinkClass} font-medium`} to={routes.findly.path}>
            Read the case study →
          </Link>
        </p>
        <div className={`mt-8 flex flex-col items-start gap-2 border-t border-rule pt-3.5 md:flex-row md:items-center md:justify-between md:gap-6 xl:absolute xl:bottom-[26px] xl:mt-0 xl:pt-2.5 ${heroCanvasPadding.bandInset}`}>
          <p className="mono-label text-signal">
            Match field preview
            <br />
            Simulation · illustrative
          </p>
          <MatchFieldPreview className="w-full flex-none md:w-[460px]" />
        </div>
      </Surface>
    </div>
  )
}
