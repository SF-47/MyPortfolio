import { projects } from '../data/portfolioData'
import type { Project } from '../types/portfolio'

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {project.actions.map((action) =>
        action.href ? (
          <a
            className="editorial-button editorial-button-large text-center"
            href={action.href}
            key={action.label}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            aria-label={`${action.label} for ${project.title}`}
          >
            {action.label}
          </a>
        ) : (
          <button className="editorial-button cursor-not-allowed text-on-surface-variant" key={action.label} type="button" disabled>
            {action.label}
          </button>
        ),
      )}
    </div>
  )
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="mt-8 grid gap-3 border-t border-outline-variant pt-6 sm:grid-cols-3 md:grid-cols-1">
      {project.meta.map((item) => (
        <div className="border-l border-outline-variant pl-4" key={item.label}>
          <dt className="label-caps mb-1 text-primary">{item.label}</dt>
          <dd className="meta-num text-on-surface">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Projects() {
  const [findly, shawarma] = projects

  return (
    <section className="section-shell py-24 md:py-32" id="work">
      <div className="section-rule mb-16 md:mb-20">
        <h2 className="label-caps tracking-[0.2em]">[01] Selected Work</h2>
        <span className="meta-num text-on-surface-variant">FEATURED PUBLIC PROJECTS</span>
      </div>

      <article className="mb-28 md:mb-40">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-5">
            <span className="meta-num mb-4 block text-primary">[{findly.id}] CASE STUDY</span>
            <h3 className="section-title mb-4">{findly.title}</h3>
            <p className="mb-6 font-display text-[24px] leading-9 text-on-surface">{findly.kicker}</p>
            <p className="text-body text-on-surface-variant">{findly.description}</p>
            <ProjectActions project={findly} />
            <ProjectMeta project={findly} />
          </div>
          <div className="order-1 md:order-2 md:col-span-7">
            <div className="aspect-[16/9] overflow-hidden bg-surface-variant">
              <a className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href={findly.image} target="_blank" rel="noopener noreferrer" aria-label="Open larger Findly project image preview">
                <img className="h-full w-full object-cover object-center transition duration-700" src={findly.image} alt={findly.imageAlt} width="960" height="540" loading="lazy" />
              </a>
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <FeatureList title="Verified Technologies" items={findly.technologies} />
              <FeatureList title="Verified Features" items={findly.features} />
            </div>
          </div>
        </div>
      </article>

      <article>
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="aspect-[4/3] overflow-hidden bg-surface-variant">
              <a className="block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href={shawarma.image} target="_blank" rel="noopener noreferrer" aria-label="Open larger Shawarma Story project image preview">
                <img className="h-full w-full object-cover object-center transition duration-700" src={shawarma.image} alt={shawarma.imageAlt} width="900" height="675" loading="lazy" />
              </a>
            </div>
          </div>
          <div className="md:col-span-5">
            <span className="meta-num mb-4 block text-primary">[{shawarma.id}] WEB PLATFORM</span>
            <h3 className="section-title mb-4">{shawarma.title}</h3>
            <p className="mb-6 font-display text-[24px] leading-9 text-on-surface">{shawarma.kicker}</p>
            <p className="text-body text-on-surface-variant">{shawarma.description}</p>
            <ProjectActions project={shawarma} />
            <ProjectMeta project={shawarma} />
          </div>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <FeatureList title="Verified Technologies" items={shawarma.technologies} />
          <FeatureList title="Verified Features" items={shawarma.features} />
        </div>
      </article>
    </section>
  )
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t border-outline-variant pt-5">
      <h4 className="label-caps mb-4 text-primary">{title}</h4>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 text-[16px] leading-7 text-on-surface-variant md:text-[17px]" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
