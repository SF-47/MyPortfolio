import { skillGroups } from '../../data/portfolioData'
import { Surface } from '../layout/Surface'

// "The toolbox": a ruled index of what the owner works with, grouped by engineering area.
// Plain lines, no badges or bars; each technology appears once.
export function SkillsSection() {
  return (
    <Surface aria-labelledby="skills-heading" as="section" className="section-y" id="capabilities" tone="canvas">
      <div className="wrap">
        <div className="mb-7 flex items-baseline justify-between">
          <p className="mono-label eyebrow text-signal">03 — Skills</p>
          <p className="mono-label hidden text-fg-muted md:block">Verified technical index</p>
        </div>
        <h2 className="text-h2" id="skills-heading">
          The toolbox.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-y-10 md:mt-16 md:gap-y-14 xl:grid-cols-4">
          {skillGroups.map((group, index) => (
            <section
              aria-label={group.title}
              className={`border-l pl-3.5 pr-3 md:pl-5 xl:px-6 ${group.title === 'Academic Exposure' ? 'border-dashed border-rule' : 'border-rule'}`}
              key={group.title}
            >
              <p className="mono-label text-fg-muted">
                {String(index + 1).padStart(2, '0')} · {group.items.length} items
              </p>
              <h3 className="mb-[18px] mt-3 font-serif text-[22px] leading-[1.15] tracking-[-0.015em] md:text-[28px]">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li className="text-[15px] leading-[1.9] md:text-base" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Surface>
  )
}
