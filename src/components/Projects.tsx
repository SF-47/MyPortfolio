import { projects } from '../data/portfolioData'
import type { Project } from '../types/portfolio'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
      {project.actions.map((action) =>
        action.href ? (
          <a
            className="arrow-link"
            href={action.href}
            key={action.label}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            aria-label={`${action.label} for ${project.title}`}
          >
            {action.label} ↗
          </a>
        ) : (
          <span className="mono text-ink-soft" key={action.label}>
            {action.label}
          </span>
        ),
      )}
    </div>
  )
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <dl className="mt-10 border-t border-rule">
      {project.meta.map((item) => (
        <div className="grid grid-cols-[88px_1fr] gap-4 border-b border-rule py-3" key={item.label}>
          <dt className="mono text-ink-soft">{item.label}</dt>
          <dd className="text-[15px] leading-6">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Projects() {
  return (
    <section className="page py-20 md:py-32" id="work">
      <SectionHead num="01" title="Selected work" aside="Two public projects" />

      <div className="space-y-24 md:space-y-40">
        {projects.map((project, index) => (
          <article className="grid gap-10 md:grid-cols-12 md:gap-x-12" key={project.id}>
            <Reveal className="md:col-span-4 md:self-start md:sticky md:top-28">
              <span className="display block text-[96px] text-accent md:text-[140px]">{project.id}</span>
              <h3 className="display mt-2 text-[48px] md:text-[64px]">{project.title}</h3>
              <p className="mt-4 text-[19px] leading-7 text-ink-soft">{project.kicker}</p>
              <ProjectActions project={project} />
              <ProjectMeta project={project} />
            </Reveal>

            <Reveal className="md:col-span-8" delay={120}>
              <a
                className="project-image block overflow-hidden border border-ink bg-paper-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                href={project.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open larger ${project.title} project image preview`}
              >
                <img
                  className={`w-full object-cover object-center ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
                  src={project.image}
                  alt={project.imageAlt}
                  width={index === 0 ? 960 : 900}
                  height={index === 0 ? 540 : 675}
                  loading="lazy"
                />
              </a>

              <p className="lede mt-10">{project.description}</p>

              <ol className="mt-10 border-t border-ink">
                {project.features.map((feature, featureIndex) => (
                  <li className="grid grid-cols-[40px_1fr] gap-4 border-b border-rule py-4" key={feature}>
                    <span className="mono pt-1 text-accent">{String(featureIndex + 1).padStart(2, '0')}</span>
                    <span className="text-[16px] leading-7 md:text-[17px]">{feature}</span>
                  </li>
                ))}
              </ol>

              <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                {project.technologies.map((tech) => (
                  <li className="chip" key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  )
}
