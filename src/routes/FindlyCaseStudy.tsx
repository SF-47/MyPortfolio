import { Link } from 'react-router'
import { routes, usePageMeta } from '../app/meta'
import { projects } from '../data/portfolioData'

const findly = projects.find((project) => project.id === '01')

// Temporary Milestone 1 scaffold. The full case study is built in a later milestone.
export function FindlyCaseStudy() {
  usePageMeta('findly')

  return (
    <>
      <p className="mb-6">
        <Link className="label-caps underline underline-offset-4" to={routes.home.path}>
          ← Home
        </Link>
      </p>
      <p className="meta-num mb-4 text-primary">Case study 01 · scaffold</p>
      <h1 className="font-display text-5xl">{findly?.title}</h1>
      <p className="mt-4 max-w-xl text-on-surface-variant">{findly?.kicker}</p>
      <ul className="mt-8 flex flex-wrap gap-6">
        {findly?.actions.map((action) =>
          action.href ? (
            <li key={action.label}>
              <a className="underline underline-offset-4" href={action.href} rel="noopener noreferrer" target="_blank">
                {action.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ) : null,
        )}
      </ul>
    </>
  )
}
