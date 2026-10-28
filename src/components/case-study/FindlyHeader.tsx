import { Link } from 'react-router'
import { findlyFacts } from '../../data/findly/caseStudy'
import { projects } from '../../data/portfolioData'
import { Surface } from '../layout/Surface'
import { ButtonLink } from '../ui/ButtonLink'

// The case study opening: breadcrumb back to the work, the large title, the overview line,
// the two project links, and a ruled table of status, scope, role and technology.
export function FindlyHeader() {
  const findly = projects.find((project) => project.id === '01')
  const github = findly?.actions.find((action) => /github/i.test(action.label))
  const demo = findly?.actions.find((action) => /demo/i.test(action.label))

  return (
    <Surface aria-labelledby="findly-title" as="section" className="pb-12 pt-4 md:pb-[72px] md:pt-6">
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <ol className="mono-label flex flex-wrap items-center gap-x-3 text-fg-muted">
            <li>
              <Link className="inline-flex min-h-11 items-center underline underline-offset-[5px]" to="/#work">
                ← Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">01 Findly</li>
          </ol>
        </nav>
        <div className="mt-1 grid items-start gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div>
            <h1 className="-ml-1.5 mb-2.5 font-serif text-[104px] font-light leading-none tracking-[-0.04em] md:text-[140px] lg:text-[160px] xl:text-[176px]" id="findly-title">
              Findly
            </h1>
            <p className="mt-2 max-w-[640px] font-serif text-[24px] leading-[1.25] tracking-[-0.015em] md:text-[30px]">{findly?.kicker}.</p>
            <p className="mt-[22px] max-w-[560px] text-fg-muted">A full-stack system: ASP.NET Core API, React admin dashboard and Expo React Native app.</p>
            <div className="mt-8 flex flex-wrap gap-3 md:mt-[34px]">
              {github?.href ? (
                <ButtonLink className="max-md:w-full md:min-w-[200px]" href={github.href} rel="noopener noreferrer" target="_blank">
                  View on GitHub <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              ) : null}
              {demo?.href ? (
                <ButtonLink className="max-md:w-full md:min-w-[200px]" href={demo.href} rel="noopener noreferrer" target="_blank" variant="outline">
                  Watch demo <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              ) : null}
            </div>
          </div>
          <div className="lg:pt-[30px]">
            <p className="mono-label mb-3.5 text-fg-muted">Case study 01</p>
            <dl>
              {findlyFacts.map((fact) => (
                <div className="grid grid-cols-[96px_1fr] gap-x-2 border-t border-rule py-3.5 last:border-b md:grid-cols-[120px_1fr] md:py-[18px]" key={fact.label}>
                  <dt className="mono-label pt-[3px] text-fg-muted">{fact.label}</dt>
                  <dd className="text-[16px] font-medium leading-[1.45] md:text-[17px]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Surface>
  )
}
