import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { useActiveSection } from '../app/activeSection'

// How long a navigation may keep the highlight pinned if no scroll-end event arrives.
const LOCK_FALLBACK_MS = 1600

// Marks which section is in view, using one IntersectionObserver (no scroll listeners, no
// library). A thin band 35% down the viewport decides: the first listed section crossing it
// is current, so the highlight changes only when a section really reaches that line.
//
// Every navigation pins the highlight until the page stops scrolling, the fallback timer runs
// out, or the visitor scrolls by hand; without that, a smooth scroll to a distant section
// would flash through every section in between. A link, a hash URL or the first load sets the
// target section (or none) straight away. Back and Forward keep what was showing and then
// follow wherever the browser restored the page to.
export function useScrollSpy(ids: readonly string[]) {
  const { setActive } = useActiveSection()
  const { key, hash } = useLocation()
  const navigationType = useNavigationType()
  const firstRun = useRef(true)
  const evaluate = useRef<() => void>(() => {})
  const lockCleanup = useRef<(() => void) | null>(null)
  const locked = useRef(false)

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null)
    const visible = new Set<string>()

    evaluate.current = () => {
      if (locked.current) return
      const current = elements.find((element) => visible.has(element.id))
      if (current) setActive(current.id)
      // Above the first section (the hero): nothing is current. Between sections: keep the last.
      else if (elements[0] && elements[0].getBoundingClientRect().top > window.innerHeight * 0.4) setActive(null)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        evaluate.current()
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      setActive(null)
    }
  }, [ids, setActive])

  // On every navigation: set the highlight (unless it is Back / Forward) and pin it while scrolling.
  useEffect(() => {
    lockCleanup.current?.()
    const initial = firstRun.current
    firstRun.current = false
    if (initial || navigationType !== 'POP') {
      const id = hash.slice(1)
      setActive(ids.includes(id) ? id : null)
    }
    locked.current = true
    let timer = 0
    const release = () => {
      window.clearTimeout(timer)
      window.removeEventListener('scrollend', release)
      for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.removeEventListener(type, release)
      lockCleanup.current = null
      locked.current = false
      evaluate.current()
    }
    timer = window.setTimeout(release, LOCK_FALLBACK_MS)
    window.addEventListener('scrollend', release, { once: true })
    for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) window.addEventListener(type, release, { once: true, passive: true })
    lockCleanup.current = release
    return () => {
      lockCleanup.current?.()
    }
  }, [key, hash, ids, navigationType, setActive])
}
