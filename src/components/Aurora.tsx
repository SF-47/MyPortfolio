import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

export function Aurora() {
  const glow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = glow.current
    if (!element || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    const xTo = gsap.quickTo(element, 'x', { duration: 1.2, ease: 'power3' })
    const yTo = gsap.quickTo(element, 'y', { duration: 1.2, ease: 'power3' })
    gsap.to(element, { opacity: 1, duration: 1.5 })

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX)
      yTo(event.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <>
      <div className="aurora" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
        <div className="aurora-grid" />
      </div>
      <div className="pointer-glow" ref={glow} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
