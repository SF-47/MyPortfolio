import { Link } from 'react-router'
import { ArchitectureSection } from '../components/architecture/ArchitectureSection'
import { SeamRuler } from '../components/layout/SeamRuler'
import { Surface } from '../components/layout/Surface'
import { routes, usePageMeta } from '../app/meta'
import { projects } from '../data/portfolioData'

const findly = projects.find((project) => project.id === '01')

// Temporary scaffold. The architecture section is the real component from Milestone 3;
// the rest of the case study is built in a later milestone.
export function FindlyCaseStudy() {
  usePageMeta('findly')

  return (
    <>
      <div className="wrap section-y">
        <p className="mono-label text-fg-muted">
          <Link className="underline underline-offset-4" to={routes.home.path}>
            Home
          </Link>
          {' / '}
          Work / 01 Findly · scaffold
        </p>
        <h1 className="text-display mt-6">{findly?.title}</h1>
        <p className="mt-6 max-w-xl font-serif text-[length:var(--text-lede)] text-fg-muted">{findly?.kicker}</p>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
          {findly?.actions.map((action) =>
            action.href ? (
              <li key={action.label}>
                <a className="inline-flex min-h-11 items-center underline underline-offset-4" href={action.href} rel="noopener noreferrer" target="_blank">
                  {action.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : null,
          )}
        </ul>
      </div>
      <SeamRuler edge="bottom" />
      <Surface as="section" className="section-y" tone="canvas">
        <div className="wrap">
          <ArchitectureSection />
        </div>
      </Surface>
    </>
  )
}
