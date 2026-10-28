import { Link, useLocation } from 'react-router'
import { useActiveSection } from '../../app/activeSection'
import { currentNavKey, primaryNav } from '../../app/navigation'
import { profile } from '../../data/portfolioData'
import { heroCanvasPadding, heroColumns } from '../hero/heroLayout'
import { MobileMenu } from './MobileMenu'
import { Surface } from './Surface'

type SiteHeaderProps = {
  // On the home page, from xl up the header overlays the top of the hero: the wordmark sits
  // over the paper column and the navigation over the canvas column. Below xl, and on every
  // other route, it is the standard paper header.
  integrated?: boolean
}

export function SiteHeader({ integrated = false }: SiteHeaderProps) {
  const { pathname } = useLocation()
  const { active } = useActiveSection()
  const current = currentNavKey(pathname, active)
  // Applied only when integrated. Spelled out in full so Tailwind can see each class.
  const onHero = {
    header: `relative z-10 xl:-mb-[72px] xl:grid xl:grid-rows-[72px] xl:border-b-0 xl:bg-transparent ${heroColumns}`,
    wrap: 'xl:contents',
    wordmark: 'xl:col-start-1 xl:row-start-1 xl:self-center xl:pl-(--gutter)',
    nav: `xl:col-start-2 xl:row-start-1 xl:mr-0 xl:items-center xl:self-center xl:justify-self-start ${heroCanvasPadding.navStart}`,
    cv: `xl:col-start-2 xl:row-start-1 xl:self-center xl:justify-self-end ${heroCanvasPadding.cvEnd}`,
  }

  return (
    <Surface as="header" className={`border-b border-rule ${integrated ? onHero.header : ''}`}>
      <div className={`wrap flex h-[72px] items-center gap-8 ${integrated ? onHero.wrap : ''}`}>
        <Link className={`mr-auto inline-flex min-h-11 items-center text-[19px] font-semibold tracking-[-0.02em] ${integrated ? onHero.wordmark : ''}`} to="/">
          {profile.name}
        </Link>
        <nav
          aria-label="Primary"
          className={`mr-auto hidden text-fg lg:block ${integrated ? onHero.nav : ''}`}
          data-surface-xl={integrated ? 'canvas' : undefined}
        >
          <ul className="flex gap-8 text-[15px] font-medium">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  aria-current={current === item.key ? (pathname === '/' ? 'location' : 'page') : undefined}
                  className="inline-flex min-h-11 items-center underline-offset-[6px] hover:underline aria-[current]:underline aria-[current]:decoration-focus aria-[current]:decoration-2"
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a
          aria-label="Download CV"
          className={`mono-label hidden h-9 items-center bg-fg px-4 font-medium text-surface lg:inline-flex ${integrated ? onHero.cv : ''}`}
          data-surface-xl={integrated ? 'canvas' : undefined}
          download
          href="/cv.pdf"
        >
          CV ↓
        </a>
        <MobileMenu pathname={pathname} />
      </div>
    </Surface>
  )
}
