import { useLayoutEffect, useRef } from 'react'
import { profile, stats } from '../data/portfolioData'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { SectionHead } from './ui/SectionHead'

const infoCards = [
  { title: 'Background', body: profile.educationSummary },
  { title: 'Development focus', body: profile.growth },
  { title: 'Availability', body: profile.availability },
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 55%', scrub: true },
        },
      )

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((element) => {
        const target = Number(element.dataset.count)
        const counter = { value: 0 }
        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            element.textContent = String(Math.round(counter.value))
          },
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })

      gsap.from('.stat-card, .info-card', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.stat-grid', start: 'top 85%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="shell py-28 md:py-40" id="profile" ref={root}>
      <SectionHead
        index="02"
        label="Profile"
        title={
          <>
            Systematic thinking, <span className="serif text-grad">practical</span> execution.
          </>
        }
      />

      <p className="about-text max-w-[26ch] font-display text-[clamp(1.7rem,3.6vw,3.1rem)] font-medium leading-[1.18] tracking-[-0.03em] sm:max-w-[34ch] lg:max-w-[40ch]">
        {profile.summary.split(' ').map((word, index) => (
          <span className="about-word inline-block" key={`${word}-${index}`}>
            {word}&nbsp;
          </span>
        ))}
      </p>

      <div className="stat-grid mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div className="stat-card glass p-6 md:p-8" data-spot key={stat.label}>
            <p className="font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-grad">
              <span data-count={stat.value}>{stat.value}</span>
            </p>
            <p className="mt-4 text-[15px] font-medium">{stat.label}</p>
            <p className="mono mt-1 text-mute">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {infoCards.map((card) => (
          <div className="info-card glass p-7" data-spot key={card.title}>
            <h3 className="mono mb-4 text-cyan">{card.title}</h3>
            <p className="leading-7 text-mute">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
