import { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { profile, socialLinks } from '../data/portfolioData'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic } from './ui/Magnetic'
import { SplitText } from './ui/SplitText'

const rings = [
  { radius: 0.2, duration: '34s', reverse: false, chips: ['React', 'TypeScript'] },
  { radius: 0.34, duration: '48s', reverse: true, chips: ['ASP.NET Core', 'React Native', 'PostgreSQL'] },
  { radius: 0.46, duration: '64s', reverse: false, chips: ['Firebase', 'Supabase', 'n8n', 'Expo'] },
]

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const orbit = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set('.h-char', { yPercent: 115, rotate: 7 })
      gsap.set('.h-fade', { autoAlpha: 0, y: 28 })
      gsap.set('.h-orbit', { autoAlpha: 0, scale: 0.7, rotate: -20 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.h-char', { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.04 })
        .to('.h-fade', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, '-=0.9')
        .to('.h-orbit', { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.8, ease: 'expo.out' }, '-=1.4')

      gsap.to('.h-title', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  useEffect(() => {
    const element = orbit.current
    if (!element || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const rx = gsap.quickTo(element, 'rotationX', { duration: 0.9, ease: 'power3' })
    const ry = gsap.quickTo(element, 'rotationY', { duration: 0.9, ease: 'power3' })
    const onMove = (event: PointerEvent) => {
      ry((event.clientX / window.innerWidth - 0.5) * 22)
      rx(-(event.clientY / window.innerHeight - 0.5) * 22)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] items-center pb-16 pt-32 md:pt-28" id="home" ref={root}>
      <div className="shell grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="eyebrow h-fade mb-8">
            <span className="eyebrow-dot" />
            Open to work · {profile.location}
          </p>

          <h1 className="h-title font-display text-[clamp(4.6rem,10.5vw,8.6rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
            <SplitText charClass="h-char" text="Sami" />
            <br />
            <SplitText charClass="h-char serif text-grad" text="Farhat." />
          </h1>

          <p className="h-fade mt-8 font-display text-[clamp(1.3rem,2.6vw,2rem)] font-medium tracking-[-0.02em]">
            {profile.title} <span className="serif text-mute">— {profile.specialization}</span>
          </p>

          <p className="h-fade mt-5 max-w-[56ch] text-[17px] leading-8 text-mute">{profile.growth}</p>

          <div className="h-fade mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                className="btn btn-primary"
                href="#work"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToTarget('#work')
                }}
              >
                View projects
                <span aria-hidden="true">↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn" href="/cv.pdf" download>
                Download CV
              </a>
            </Magnetic>
            {socialLinks.map((link) =>
              link.href ? (
                <Magnetic key={link.label}>
                  <a
                    className="btn"
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={`Open Sami Farhat's ${link.label} profile`}
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                  </a>
                </Magnetic>
              ) : null,
            )}
          </div>
        </div>

        <div className="h-orbit flex justify-center [perspective:1200px]" aria-hidden="true">
          <div className="orbit" ref={orbit}>
            <div className="orbit-core">SF</div>
            {rings.map((ring) => (
              <Fragment key={ring.radius}>
                <div
                  className="orbit-track"
                  style={{ '--r': `calc(var(--u) * ${ring.radius})` } as CSSProperties}
                />
                <div
                  className={`orbit-ring ${ring.reverse ? 'reverse' : ''}`}
                  style={{ '--d': ring.duration, '--r': `calc(var(--u) * ${ring.radius})` } as CSSProperties}
                >
                  {ring.chips.map((chip, index) => (
                    <div
                      className="orbit-slot"
                      key={chip}
                      style={{ '--a': `${(360 / ring.chips.length) * index + ring.radius * 90}deg` } as CSSProperties}
                    >
                      <span className="orbit-chip">{chip}</span>
                    </div>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="h-fade mono absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-mute md:flex">
        <span className="relative block h-9 w-5 rounded-full border border-white/20">
          <span className="absolute left-1/2 top-2 h-1.5 w-0.5 -translate-x-1/2 animate-bounce rounded bg-white" />
        </span>
        Scroll
      </div>
    </section>
  )
}
