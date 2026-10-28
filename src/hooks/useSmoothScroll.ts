import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'
import { getLenis, setLenis } from '../lib/scroll'

export function useSmoothScroll(ready: boolean) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    if (ready) lenis.start()
    else lenis.stop()
  }, [ready])
}
