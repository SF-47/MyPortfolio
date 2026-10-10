import { skillGroups } from '../data/portfolioData'

export function Skills() {
  return (
    <section className="section-shell py-24 md:py-32" id="capabilities">
      <div className="section-rule mb-12">
        <h2 className="label-caps tracking-[0.2em]">[03] Skills</h2>
        <span className="meta-num text-on-surface-variant">VERIFIED TECHNICAL INDEX</span>
      </div>
      <div className="grid border-l border-t border-outline-variant md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => (
          <article className="border-b border-r border-outline-variant p-8 transition-colors hover:bg-surface-variant/40 md:p-10" key={group.title}>
            <span className="meta-num mb-6 block text-primary">{String(index + 1).padStart(2, '0')} / INDEX</span>
            <h3 className="mb-7 border-b border-outline-variant pb-4 font-display text-2xl font-semibold">{group.title}</h3>
            <ul className="space-y-5">
              {group.items.map((item) => (
                <li className="flex items-start gap-3 skill-item text-on-surface-variant" key={item}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
