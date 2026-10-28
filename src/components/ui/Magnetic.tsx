import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

// Pulls its child toward the pointer while hovered, then springs back.
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const xTo = gsap.quickTo(element, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    const yTo = gsap.quickTo(element, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <span className="inline-block" ref={ref}>
      {children}
    </span>
  )
}
