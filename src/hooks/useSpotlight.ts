import { useEffect } from 'react'

// Writes cursor position into --mx/--my on the nearest [data-spot] element so CSS can paint a glow.
export function useSpotlight() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-spot]')
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      target.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}
