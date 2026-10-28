import { featuredProjects } from '../../data/featured'
import { projects } from '../../data/portfolioData'
import { routes } from '../../app/meta'
import { SeamRuler } from '../layout/SeamRuler'
import { Surface } from '../layout/Surface'
import { ButtonLink } from '../ui/ButtonLink'
import { TextLink } from '../ui/TextLink'
import { ZoomableImage } from '../ui/ZoomableImage'

// "Selected work": each project is a large editorial spread, text beside a dark plate holding
// the real screenshot. The two spreads mirror each other. No cards.
export function FeaturedProjects() {
  return (
    <Surface aria-labelledby="work-heading" as="section" className="section-y" id="work">
      <div className="wrap">
        <h2 className="mono-label eyebrow mb-7 text-fg-muted" id="work-heading">
          <span aria-hidden="true">01 — </span>Selected work
        </h2>
        {featuredProjects.map((featured, index) => {
          const project = projects.find((item) => item.id === featured.id)
          if (!project) return null
          const findly = featured.id === '01'
          const flip = index % 2 === 1
          const secondary = project.actions.filter((action) => action.href && action.label !== 'Live Website')
          return (
            <article
              className={`grid items-center gap-8 border-t border-rule py-12 md:gap-9 md:py-14 xl:gap-[72px] xl:py-[72px] ${flip ? 'xl:grid-cols-[7fr_5fr]' : 'xl:grid-cols-[5fr_7fr]'}`}
              key={project.id}
            >
              <div>
                <p className="mono-label text-fg-muted">{featured.eyebrow}</p>
                <h3 className="mb-3.5 mt-[18px] font-serif text-[56px] font-light leading-none tracking-[-0.03em] md:text-[72px]">{project.title}</h3>
                <p className="max-w-[460px] font-serif text-[20px] leading-[1.35] md:text-[22px]">{featured.descriptor}</p>
                <ul className="my-7">
                  {featured.facts.map((fact) => (
                    <li className="grid grid-cols-[96px_1fr] border-t border-rule py-[11px] font-medium last:border-b md:grid-cols-[110px_1fr]" key={fact.label}>
                      <span className="mono-label text-fg-muted">{fact.label}</span>
                      <span>{fact.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  {findly ? (
                    <ButtonLink className="mr-3" to={routes.findly.path}>
                      Read case study <span aria-hidden="true">→</span>
                    </ButtonLink>
                  ) : (
                    <ButtonLink className="mr-3" href={project.liveUrl} rel="noopener noreferrer" target="_blank">
                      Live website <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </ButtonLink>
                  )}
                  {secondary.map((action) => (
                    <TextLink external href={action.href} key={action.label}>
                      {action.label} →
                    </TextLink>
                  ))}
                </div>
              </div>
              <div className={`bg-plate px-4 pb-3.5 pt-5 text-fg md:px-[26px] md:pb-[18px] md:pt-7 ${flip ? 'xl:order-first' : ''}`} data-surface="canvas">
                <SeamRuler className="mb-3.5 bg-transparent opacity-55" edge="top" tone="canvas" />
                <ZoomableImage alt={project.imageAlt} crop={featured.crop} fullWidth={featured.imageWidth} label={project.imageAlt} small={{ src: featured.smallImage, width: 800, sizes: '(min-width: 1280px) 740px, 106vw' }} src={project.image} />
                <p className="mono-label mt-3.5 text-fg-muted">{featured.caption}</p>
              </div>
            </article>
          )
        })}
      </div>
    </Surface>
  )
}
