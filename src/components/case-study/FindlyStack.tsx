import { findlyStack } from '../../data/findly/caseStudy'
import { projects } from '../../data/portfolioData'
import { Surface } from '../layout/Surface'
import { TextLink } from '../ui/TextLink'

const rowClass = 'grid grid-cols-[1fr_36px] items-center gap-6 border-t border-fg py-[18px] last:border-b md:grid-cols-[1fr_260px_48px] md:py-[22px]'
const arrowIcon = (
  <svg aria-hidden="true" className="ml-auto h-6 w-6 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
  </svg>
)

// The close of the case study: the stack in plain lists, the two project links as large
// rows, a way back to the work, and the other featured project (its live website).
export function FindlyStack() {
  const findly = projects.find((project) => project.id === '01')
  const shawarma = projects.find((project) => project.id === '02')
  const links = [
    { label: 'View the repository on GitHub', note: 'github.com/SF-47/findly', href: findly?.actions.find((action) => /github/i.test(action.label))?.href },
    { label: 'Watch the demo video', note: 'Google Drive', href: findly?.actions.find((action) => /demo/i.test(action.label))?.href },
  ]

  return (
    <Surface aria-label="Stack and links" as="section" className="section-y pt-12 md:pt-14">
      <div className="wrap">
        <div className="grid gap-5 lg:grid-cols-[3fr_9fr] lg:gap-0">
          <h2 className="mono-label text-fg-muted">
            <span aria-hidden="true">05 — </span>Stack
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {findlyStack.map((group) => (
              <div className="border-t border-rule pt-3.5" key={group.title}>
                <h3 className="mono-label">{group.title}</h3>
                <ul className="mt-2">
                  {group.items.map((item) => (
                    <li className="py-[3px]" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ul className="mt-16 md:mt-24">
          {links.map((link) =>
            link.href ? (
              <li key={link.label}>
                <a className={rowClass} href={link.href} rel="noopener noreferrer" target="_blank">
                  <span className="font-serif text-[30px] font-light leading-[1.1] tracking-[-0.025em] md:text-[52px]">{link.label}</span>
                  <span className="mono-label hidden text-fg-muted md:inline">{link.note}</span>
                  {arrowIcon}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : null,
          )}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8">
          <TextLink to="/#work">← Back to selected work</TextLink>
        </div>

        <a
          className="mt-4 grid items-center gap-2 py-6 md:grid-cols-[3fr_9fr] md:py-9"
          href={shawarma?.liveUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="mono-label text-fg-muted">Next — 02 · Live website</span>
          <span className="flex items-center justify-between gap-4">
            <span className="font-serif text-[30px] leading-[1.15] tracking-[-0.015em] md:text-[40px]">{shawarma?.title}</span>
            {arrowIcon}
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </Surface>
  )
}
