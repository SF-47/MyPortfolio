import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(bar.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[10001] h-[3px]" aria-hidden="true">
      <div
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-violet via-cyan to-mint"
        ref={bar}
      />
    </div>
  )
}
