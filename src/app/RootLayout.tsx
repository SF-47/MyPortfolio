import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import type { RouteHandle } from './routeHandle'

export function RootLayout() {
  const { pathname, hash } = useLocation()
  const matches = useMatches()
  const footerSeam = matches.some((match) => (match.handle as RouteHandle | undefined)?.footerSeam)
  const integratedHeader = matches.some((match) => (match.handle as RouteHandle | undefined)?.integratedHeader)
  const mainRef = useRef<HTMLElement>(null)
  const announceRef = useRef<HTMLParagraphElement>(null)
  const previousPathname = useRef(pathname)

  // After a client-side route change, move focus to <main> and announce the new
  // page title so keyboard and screen-reader users know the page changed.
  // Child effects (usePageMeta) run first, so document.title is already updated.
  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname
    if (hash) return
    mainRef.current?.focus({ preventScroll: true })
    if (announceRef.current) announceRef.current.textContent = document.title
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col bg-surface text-fg" data-surface="paper" id="top">
      <a
        className="mono-label absolute left-[-9999px] top-2 z-50 bg-signal px-4 py-3 font-medium text-canvas focus:left-3 focus:outline-canvas"
        href="#main"
      >
        Skip to content
      </a>
      <SiteHeader integrated={integratedHeader} />
      <main className="flex-1 outline-none" id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter seam={footerSeam} />
      <p aria-live="polite" className="sr-only" ref={announceRef} role="status" />
      <ScrollRestoration />
    </div>
  )
}
