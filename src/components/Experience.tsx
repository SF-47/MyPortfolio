import { education, experience } from '../data/portfolioData'

export function Experience() {
  return (
    <section className="border-t border-outline-variant bg-surface-container py-24 md:py-32" id="experience">
      <div className="section-shell grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="label-caps mb-12 tracking-[0.2em]">[04] Experience</h2>
          <div className="space-y-12">
            {experience.map((item) => (
              <article className="group grid grid-cols-[64px_1fr] gap-6 border-b border-outline-variant pb-10" key={`${item.year}-${item.role}`}>
                <span className="meta-num pt-1 text-primary">{item.year}</span>
                <div>
                  <h3 className="mb-2 font-display text-2xl font-semibold transition-colors group-hover:text-primary">{item.role}</h3>
                  <p className="label-caps mb-4 text-on-surface-variant">
                    {item.organization}
                    {item.location ? ` | ${item.location}` : ''}
                  </p>
                  <ul className="space-y-3">
                    {item.details.map((detail) => (
                      <li className="flex gap-3 text-body text-on-surface-variant" key={detail}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2 className="label-caps mb-12 tracking-[0.2em]">Education</h2>
          {education.map((item) => (
            <article className="border-l-2 border-primary pl-6" key={item.degree}>
              <span className="meta-num mb-4 block text-primary">{item.year}</span>
              <h3 className="mb-3 font-display text-3xl font-semibold">{item.degree}</h3>
              <p className="mb-4 text-body text-on-surface-variant">{item.institution}</p>
              <p className="text-body text-on-surface-variant">{item.status}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
