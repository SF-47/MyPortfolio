import { education, experience } from '../data/portfolioData'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Experience() {
  return (
    <section className="bg-paper-deep py-20 md:py-32" id="experience">
      <div className="page">
        <SectionHead num="04" title="Experience" aside="Work · Education" />

        <div className="border-t border-ink">
          {experience.map((item) => (
            <Reveal className="grid gap-4 border-b border-rule py-10 md:grid-cols-12 md:gap-8" key={`${item.year}-${item.role}`}>
              <span className="mono text-accent md:col-span-3">{item.year}</span>
              <div className="md:col-span-4">
                <h3 className="display text-[34px] md:text-[44px]">{item.role}</h3>
                <p className="mono mt-3 text-ink-soft">
                  {item.organization}
                  {item.location ? ` / ${item.location}` : ''}
                </p>
              </div>
              <ul className="space-y-3 md:col-span-5">
                {item.details.map((detail) => (
                  <li className="flex gap-3 text-[17px] leading-7 text-ink-soft" key={detail}>
                    <span className="mt-3 h-px w-4 shrink-0 bg-accent" />
                    {detail}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
          {education.map((item) => (
            <Reveal className="grid gap-4 border-b border-ink py-10 md:grid-cols-12 md:gap-8" key={item.degree}>
              <span className="mono text-accent md:col-span-3">{item.year}</span>
              <div className="md:col-span-4">
                <h3 className="display text-[34px] md:text-[44px]">Education</h3>
                <p className="mono mt-3 text-ink-soft">{item.institution}</p>
              </div>
              <div className="md:col-span-5">
                <p className="text-[17px] leading-7">{item.degree}</p>
                {item.status ? <p className="mt-2 text-ink-soft">{item.status}</p> : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
