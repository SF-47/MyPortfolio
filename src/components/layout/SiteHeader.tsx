import { Link, useLocation } from 'react-router'
import { currentNavKey, primaryNav } from '../../app/navigation'
import { profile } from '../../data/portfolioData'
import { MobileMenu } from './MobileMenu'
import { Surface } from './Surface'

export function SiteHeader() {
  const { pathname, hash } = useLocation()
  const current = currentNavKey(pathname, hash)

  return (
    <Surface as="header" className="border-b border-rule">
      <div className="wrap flex h-[72px] items-center gap-8">
        <Link className="mr-auto inline-flex min-h-11 items-center text-[19px] font-semibold tracking-[-0.02em]" to="/">
          {profile.name}
        </Link>
        <nav aria-label="Primary" className="mr-auto hidden lg:block">
          <ul className="flex gap-8 text-[15px] font-medium">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  aria-current={current === item.key ? (pathname === '/' ? 'location' : 'page') : undefined}
                  className="inline-flex min-h-11 items-center underline-offset-[6px] hover:underline aria-[current]:underline aria-[current]:decoration-2"
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
          className="mono-label hidden h-9 items-center bg-ink px-4 font-medium text-paper lg:inline-flex"
          download
          href="/cv.pdf"
        >
          CV ↓
        </a>
        <MobileMenu hash={hash} pathname={pathname} />
      </div>
    </Surface>
  )
}
