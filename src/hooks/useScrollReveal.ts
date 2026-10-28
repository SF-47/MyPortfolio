import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

// Fades and lifts every [data-reveal] inside the scope as it enters the viewport.
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 56,
          autoAlpha: 0,
          duration: 1.1,
          delay: Number(element.dataset.delay ?? 0),
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 90%', once: true },
        })
      })
    }, scope)

    return () => ctx.revert()
  }, [scope])
}
