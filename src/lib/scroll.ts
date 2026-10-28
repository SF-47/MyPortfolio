import type Lenis from 'lenis'

let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

export const getLenis = () => instance

export function scrollToTarget(target: string) {
  if (instance) {
    instance.scrollTo(target, { offset: 0, duration: 1.4 })
    return
  }
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}
