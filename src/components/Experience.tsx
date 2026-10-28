import { useLayoutEffect, useRef } from 'react'
import { education, experience } from '../data/portfolioData'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { SectionHead } from './ui/SectionHead'

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tl-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.tl', start: 'top 70%', end: 'bottom 60%', scrub: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('.tl-item').forEach((item) => {
        gsap.from(item, {
          x: 60,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        })
      })
      gsap.from('.edu-card', {
        y: 60,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.edu-card', start: 'top 88%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="shell py-28 md:py-40" id="experience" ref={root}>
      <SectionHead
        index="04"
        label="Experience"
        title={
          <>
            Where I&rsquo;ve <span className="serif text-grad">worked</span> &amp; learned.
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="tl relative pl-8 md:pl-12">
          <div className="absolute bottom-0 left-[7px] top-2 w-px bg-white/10 md:left-[11px]" aria-hidden="true">
            <div className="tl-line h-full origin-top bg-gradient-to-b from-violet via-cyan to-mint" />
          </div>
          <div className="grid gap-8">
            {experience.map((item) => (
              <article className="tl-item glass relative p-7 md:p-9" data-spot key={`${item.year}-${item.role}`}>
                <span
                  className="absolute -left-[33px] top-9 h-4 w-4 rounded-full border-2 border-cyan bg-ink shadow-[0_0_18px_var(--color-cyan)] md:-left-[49px]"
                  aria-hidden="true"
                />
                <p className="mono mb-3 text-cyan">{item.year}</p>
                <h3 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">{item.role}</h3>
                <p className="serif mt-1 text-xl text-white/70">
                  {item.organization}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
                <ul className="mt-5 grid gap-3">
                  {item.details.map((detail) => (
                    <li className="flex gap-3 leading-7 text-mute" key={detail}>
                      <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mono mb-5 text-mute">Education</h3>
          {education.map((item) => (
            <article className="edu-card glass p-8" data-spot key={item.degree}>
              <p className="mono mb-4 text-cyan">{item.year}</p>
              <h4 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em]">{item.degree}</h4>
              <p className="serif mt-3 text-2xl text-white/70">{item.institution}</p>
              {item.status ? <p className="mt-4 text-mute">{item.status}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
