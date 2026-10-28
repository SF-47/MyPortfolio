import { education, experience } from '../../data/portfolioData'
import { monthName, parseMonthRange, yearOf } from '../../lib/monthRange'
import { Surface } from '../layout/Surface'

const shortRole = (role: string) => (/intern/i.test(role) ? 'Intern' : /freelance/i.test(role) ? 'Freelance' : role)

// "Experience & education": a timeline drawn to scale from the dates in the data (education
// as the long bar, the two roles as shorter bars), followed by the full entries. The timeline
// is a picture; every date and detail is also in the text below it.
export function ExperienceSection() {
  const degree = education[0]
  const span = parseMonthRange(degree.year)
  const total = span.end - span.start + 1
  const percent = (month: number) => ((month - span.start) / total) * 100
  const roles = experience.map((item) => ({ ...item, ...parseMonthRange(item.year) }))
  const years = Array.from({ length: yearOf(span.end) - yearOf(span.start) + 1 }, (_, i) => yearOf(span.start) + i)
  const timelineLabel = `Timeline from ${degree.year.replace(' – ', ' to ')}: ${degree.degree} throughout. ${roles.map((role) => `${role.role}, ${role.year}`).join('. ')}.`

  return (
    <Surface aria-labelledby="experience-heading" as="section" className="section-y pt-16" id="experience">
      <div className="wrap">
        <p className="mono-label eyebrow text-fg-muted">04 — Experience</p>
        <h2 className="text-h2 mt-7" id="experience-heading">
          Experience &amp; education.
        </h2>

        <div aria-label={timelineLabel} className="relative mb-12 mt-10 md:mb-16 md:mt-14" role="img">
          <div className="relative h-[30px] border-b border-fg">
            {years.map((year) => {
              const left = year === yearOf(span.start) ? 0 : percent(year * 12)
              // On phones the second tick sits too close to the first to read.
              return (
                <span
                  className={`mono-label absolute top-0 after:absolute after:left-0 after:top-[18px] after:h-3 after:w-px after:bg-fg after:content-[''] ${left > 0 && left < 15 ? 'hidden md:block' : ''}`}
                  key={year}
                  style={{ left: `${left}%` }}
                >
                  {year}
                </span>
              )
            })}
            <span className="mono-label absolute right-0 top-0 hidden after:absolute after:right-0 after:top-[18px] after:h-3 after:w-px after:bg-fg after:content-[''] md:block">
              {monthName(span.end).slice(0, 3)} {yearOf(span.end)}
            </span>
          </div>
          <div className="relative h-[58px] border-b border-rule">
            <div className="mono-label absolute left-0 top-3 flex h-[34px] w-full items-center overflow-hidden whitespace-nowrap bg-fg px-3 font-medium text-surface md:px-3">
              <span className="md:hidden">{degree.degree.replace('Bachelor of Science in', 'B.Sc.')}</span>
              <span className="hidden truncate md:inline">
                {degree.degree} · {degree.institution}
              </span>
            </div>
          </div>
          <div className="relative h-[58px] border-b border-rule">
            <span className="mono-label absolute left-0 top-5 text-fg-muted">Experience</span>
            {roles.map((role, index) => (
              <div
                className={`mono-label absolute top-3 flex h-[34px] items-center overflow-hidden whitespace-nowrap border-[1.5px] border-fg px-1.5 font-medium md:px-3 ${
                  index === 0 ? 'bg-[repeating-linear-gradient(135deg,var(--surface-fg)_0_1.5px,transparent_1.5px_7px)]' : ''
                }`}
                key={role.role}
                style={{ left: `${percent(role.start)}%`, width: `${((role.end - role.start + 1) / total) * 100}%` }}
              >
                <span className={`hidden md:inline ${index === 0 ? 'bg-surface px-1.5 py-0.5' : ''}`}>{shortRole(role.role)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-x-[72px]">
          {experience.map((item) => (
            <article className="border-t border-rule py-[26px]" key={`${item.year}-${item.role}`}>
              <p className="mono-label text-fg-muted">{item.year}</p>
              <h3 className="text-h3 mb-1.5 mt-2.5">{item.role}</h3>
              <p className="mono-label">
                {item.organization}
                {item.location ? ` | ${item.location}` : ''}
              </p>
              <ul className="mt-3.5">
                {item.details.map((detail) => (
                  <li className="relative mt-2 pl-[26px] text-fg-muted before:absolute before:left-0 before:font-mono before:content-['—']" key={detail}>
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {education.map((item) => (
            <article className="border-y border-rule py-[26px] md:col-span-2 md:grid md:grid-cols-2 md:items-baseline md:gap-x-[72px]" key={item.degree}>
              <p className="mono-label text-fg-muted md:col-span-2">{item.year}</p>
              <h3 className="text-h3 mt-2.5 md:mt-2.5">{item.degree}</h3>
              <p className="mono-label mt-2.5">{item.institution}</p>
              {item.status ? <p className="mt-2.5 text-fg-muted md:col-span-2">{item.status}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </Surface>
  )
}
