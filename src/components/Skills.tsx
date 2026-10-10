import { skillGroups } from '../data/portfolioData'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Skills() {
  return (
    <section className="page py-20 md:py-32" id="capabilities">
      <SectionHead num="03" title="Skills" aside="Technical index" />
      <div className="border-t border-ink">
        {skillGroups.map((group, index) => (
          <Reveal
            className="row-hover grid gap-4 border-b border-rule py-7 md:grid-cols-12 md:gap-8 md:px-3"
            delay={index * 40}
            key={group.title}
          >
            <span className="mono text-ink-soft md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="display text-[30px] md:col-span-3 md:text-[36px]">{group.title}</h3>
            <ul className="flex flex-wrap content-start gap-2 md:col-span-8">
              {group.items.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
