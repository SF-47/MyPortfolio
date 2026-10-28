import { useLayoutEffect, useRef } from 'react'
import { skillGroups } from '../data/portfolioData'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { SectionHead } from './ui/SectionHead'

export function Skills() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.skill-card', {
        y: 70,
        rotateX: -12,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.skill-grid', start: 'top 85%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="shell py-28 md:py-40" id="capabilities" ref={root}>
      <SectionHead
        index="03"
        label="Skills"
        title={
          <>
            The <span className="serif text-grad">toolbox</span>.
          </>
        }
      />
      <div className="skill-grid grid gap-4 [perspective:1200px] md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, index) => (
          <article className="skill-card glass p-7" data-spot key={group.title}>
            <div className="mb-6 flex items-baseline justify-between">
              <span className="mono text-violet">{String(index + 1).padStart(2, '0')}</span>
              <span className="mono text-mute">{group.items.length} items</span>
            </div>
            <h3 className="mb-5 font-display text-2xl font-semibold tracking-[-0.03em]">{group.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li className="chip" key={item}>
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
