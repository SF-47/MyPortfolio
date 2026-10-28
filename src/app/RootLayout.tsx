import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { routes } from './meta'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `label-caps underline-offset-8 hover:underline ${isActive ? 'underline text-on-surface' : 'text-on-surface-variant'}`

export function RootLayout() {
  const { pathname, hash } = useLocation()
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
    <>
      <a
        className="sr-only z-[10001] bg-primary px-4 py-3 text-[#121416] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main"
      >
        Skip to content
      </a>
      <header className="border-b border-outline-variant">
        <div className="mx-auto flex max-w-container items-center justify-between gap-6 px-6 py-4">
          <Link className="font-display text-xl" to={routes.home.path}>
            Sami Farhat
          </Link>
          <nav aria-label="Primary">
            <ul className="flex gap-6">
              <li>
                <NavLink className={navLinkClass} end to={routes.home.path}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className={navLinkClass} to={routes.findly.path}>
                  Findly
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-container px-6 py-16 outline-none" id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="border-t border-outline-variant">
        <p className="label-caps mx-auto max-w-container px-6 py-8 text-on-surface-variant">© 2026 Sami Farhat · Built in Beirut</p>
      </footer>
      <p aria-live="polite" className="sr-only" ref={announceRef} role="status" />
      <ScrollRestoration />
    </>
  )
}
