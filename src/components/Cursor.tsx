import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ringEl = ring.current
    const dotEl = dot.current
    if (!ringEl || !dotEl || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    gsap.set([ringEl, dotEl], { xPercent: -50, yPercent: -50 })
    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power3' })
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power3' })
    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'none' })
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'none' })

    let visible = false
    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([ringEl, dotEl], { opacity: 1, duration: 0.3 })
      }
      ringX(event.clientX)
      ringY(event.clientY)
      dotX(event.clientX)
      dotY(event.clientY)
    }
    const onOver = (event: PointerEvent) => {
      const interactive = (event.target as HTMLElement | null)?.closest('a, button, input, textarea, [data-cursor]')
      gsap.to(ringEl, { scale: interactive ? 1.9 : 1, duration: 0.35, ease: 'power3.out' })
      gsap.to(dotEl, { scale: interactive ? 0 : 1, duration: 0.25 })
    }
    const onLeave = () => {
      visible = false
      gsap.to([ringEl, dotEl], { opacity: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
