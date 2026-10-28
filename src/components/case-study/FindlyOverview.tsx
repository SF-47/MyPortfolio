import { buildDetails, findlyGlance, findlyOverview } from '../../data/findly/caseStudy'
import { decisions } from '../../data/findly/decisions'
import { traceSourceLabel } from '../../data/findly/trace'
import { Surface } from '../layout/Surface'

const twoColumns = 'grid gap-5 lg:grid-cols-[3fr_9fr] lg:gap-0'
const label = 'mono-label text-fg-muted'

// The engineering overview: the numbers, a one-paragraph overview, the four engineering
// decisions, and how the backend and the clients are built.
export function FindlyOverview() {
  return (
    <Surface aria-label="Engineering overview" as="section" className="section-y pt-12 md:pt-14">
      <div className="wrap">
        <h2 className={`${label} eyebrow`}>At a glance</h2>
        <ul className="mt-7 grid grid-cols-2 gap-y-9 md:grid-cols-4 md:gap-y-0">
          {findlyGlance.map((item, index) => (
            <li
              className={`border-rule pr-3 md:pr-6 ${index % 2 === 0 ? 'border-l-0 pl-0' : 'border-l pl-4'} ${index === 0 ? 'md:border-l-0 md:pl-0' : 'md:border-l md:pl-6'}`}
              key={item.label}
            >
              <span className="mb-[18px] block font-serif text-[84px] font-light leading-none tracking-[-0.04em] md:text-[96px] lg:text-[128px]">{item.value}</span>
              <span className="block text-[18px] font-medium">{item.label}</span>
              <span className={label}>{item.note}</span>
            </li>
          ))}
        </ul>

        <div className={`${twoColumns} mt-16 md:mt-24`}>
          <h2 className={label}>
            <span aria-hidden="true">01 — </span>Overview
          </h2>
          <p className="max-w-[760px] font-serif text-[22px] leading-[1.4] tracking-[-0.005em] md:text-[27px]">{findlyOverview}</p>
        </div>

        <div className={`${twoColumns} mt-16 md:mt-24`}>
          <h2 className={label}>
            <span aria-hidden="true">02 — </span>Engineering decisions
          </h2>
          <ul>
            {decisions.map((decision) => (
              <li className="grid gap-2 border-t border-rule py-[22px] last:border-b md:grid-cols-[3fr_5fr_1.4fr] md:items-start md:gap-x-8 md:py-7" key={decision.id}>
                <span className={`${label} text-fg md:order-last md:text-right`}>{decision.tag}</span>
                <h3 className="text-h3 md:order-first">{decision.title}</h3>
                <p className="text-fg-muted">{decision.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${twoColumns} mt-16 md:mt-24`}>
          <h2 className={label}>Under the hood</h2>
          <div>
            <div className="grid gap-10 md:grid-cols-2 md:gap-14">
              {(
                [
                  ['Backend', buildDetails.backend],
                  ['Clients', buildDetails.clients],
                ] as const
              ).map(([title, items]) => (
                <div key={title}>
                  <h3 className="mono-label">{title}</h3>
                  <ul className="mt-3.5 border-t border-rule">
                    {items.map((item) => (
                      <li className="border-b border-rule py-3.5 text-fg-muted" key={item.text}>
                        {item.text}
                        {item.source ? <span className={`${label} mt-1.5 block`}>{traceSourceLabel[item.source]}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-[560px] text-[15px] text-fg-muted">
              Items marked Project README come from the repository README. The rest are confirmed in the Findly code or in the project data.
            </p>
          </div>
        </div>
      </div>
    </Surface>
  )
}
