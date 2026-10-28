import { useLayoutEffect, useRef } from 'react'
import { projects } from '../data/portfolioData'
import { gsap, prefersReducedMotion } from '../lib/motion'
import type { Project } from '../types/portfolio'
import { Magnetic } from './ui/Magnetic'
import { SectionHead } from './ui/SectionHead'

function ProjectCard({ project, reverse }: { project: Project; reverse: boolean }) {
  const media = useRef<HTMLDivElement>(null)

  const handleTilt = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || event.pointerType !== 'mouse' || !media.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(media.current, { rotationY: px * 10, rotationX: -py * 10, duration: 0.6, ease: 'power3.out' })
  }
  const resetTilt = () => {
    if (media.current) gsap.to(media.current, { rotationY: 0, rotationX: 0, duration: 0.9, ease: 'elastic.out(1,0.6)' })
  }

  return (
    <article className="project-card relative" aria-labelledby={`project-${project.id}`}>
      <span
        className="pointer-events-none absolute -top-10 select-none font-display text-[clamp(8rem,22vw,18rem)] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.1)] md:-top-24"
        style={reverse ? { right: 0 } : { left: 0 }}
        aria-hidden="true"
      >
        {project.id}
      </span>

      <div className={`relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14 ${reverse ? '' : ''}`}>
        <div className={`lg:col-span-7 ${reverse ? 'lg:order-2' : ''}`}>
          <div className="[perspective:1400px]" onPointerMove={handleTilt} onPointerLeave={resetTilt}>
            <div className="glass overflow-hidden !rounded-[32px] p-2 will-change-transform md:p-3" ref={media} data-cursor>
              <div className="project-img-wrap overflow-hidden rounded-[24px] bg-ink-2">
                <a
                  className="block"
                  href={project.liveUrl ?? project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title}`}
                >
                  <img
                    className="project-img aspect-[16/10] w-full scale-[1.18] object-cover"
                    src={project.image}
                    alt={project.imageAlt}
                    width="960"
                    height="600"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`lg:col-span-5 ${reverse ? 'lg:order-1' : ''}`}>
          <p className="mono mb-4 text-cyan">{project.meta[0]?.value}</p>
          <h3
            className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
            id={`project-${project.id}`}
          >
            {project.title}
          </h3>
          <p className="serif mt-4 text-[1.6rem] leading-8 text-white/80">{project.kicker}</p>
          <p className="mt-5 leading-8 text-mute">{project.description}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.actions.map((action) =>
              action.href ? (
                <Magnetic key={action.label}>
                  <a
                    className={`btn ${action === project.actions[0] ? 'btn-primary' : ''}`}
                    href={action.href}
                    target={action.external ? '_blank' : undefined}
                    rel={action.external ? 'noopener noreferrer' : undefined}
                    aria-label={`${action.label} for ${project.title}`}
                  >
                    {action.label} <span aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              ) : null,
            )}
          </div>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {project.meta.map((item) => (
              <div className="bg-ink/70 p-4 backdrop-blur" key={item.label}>
                <dt className="mono mb-1.5 text-mute">{item.label}</dt>
                <dd className="text-sm leading-6">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="relative mt-10 grid gap-6 lg:grid-cols-12">
        <div className="glass self-start p-7 lg:col-span-5" data-spot>
          <h4 className="mono mb-5 text-cyan">Stack</h4>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li className="chip" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass p-7 lg:col-span-7" data-spot>
          <h4 className="mono mb-5 text-cyan">What I built</h4>
          <ol className="grid gap-4">
            {project.features.map((feature, index) => (
              <li className="flex gap-4 text-[15px] leading-7 text-mute" key={feature}>
                <span className="mono mt-1 text-violet">{String(index + 1).padStart(2, '0')}</span>
                {feature}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.from(card.querySelector('.project-img-wrap'), {
          clipPath: 'inset(14% 10% 14% 10% round 40px)',
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 25%', scrub: true },
        })
        gsap.to(card.querySelector('.project-img'), {
          scale: 1,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 90%', end: 'bottom 20%', scrub: true },
        })
        gsap.from(card.querySelectorAll('.glass[data-spot]'), {
          y: 60,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card.querySelector('.glass[data-spot]'), start: 'top 90%', once: true },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="shell pb-28 pt-32 md:pb-40 md:pt-44" id="work" ref={root}>
      <SectionHead
        index="01"
        label="Selected work"
        title={
          <>
            Things I&rsquo;ve <span className="serif text-grad">built</span> &amp; shipped.
          </>
        }
      />
      <div className="grid gap-32 md:gap-48">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} reverse={index % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
