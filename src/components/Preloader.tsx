import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'

export function Preloader({ onReveal }: { onReveal: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const progress = { value: 0 }
      const tl = gsap.timeline()
      tl.to(progress, {
        value: 100,
        duration: 1.7,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.round(progress.value)),
      })
        .from('.pre-mark', { yPercent: 120, duration: 0.9, ease: 'power4.out' }, 0)
        .to('.pre-bar', { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0)
        .to('.pre-content', { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' })
        .add(onReveal, '+=0.05')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<')
        .add(() => setGone(true))
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null

  return (
    <div
      className="fixed inset-0 z-[10002] grid place-items-center bg-ink"
      ref={root}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="pre-content w-[min(80vw,420px)]">
        <div className="mb-8 overflow-hidden">
          <p className="pre-mark font-display text-[clamp(3rem,10vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
            Sami <span className="serif text-grad">Farhat</span>
          </p>
        </div>
        <div className="h-px w-full overflow-hidden bg-white/10">
          <div className="pre-bar h-full origin-left scale-x-0 bg-gradient-to-r from-violet via-cyan to-mint" />
        </div>
        <div className="mono mt-4 flex justify-between text-mute">
          <span>Portfolio {new Date().getFullYear()}</span>
          <span>{String(count).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  )
}
