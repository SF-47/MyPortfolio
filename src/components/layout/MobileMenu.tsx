import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { profile, socialLinks } from '../../data/portfolioData'
import { currentNavKey, primaryNav } from '../../app/navigation'

type MobileMenuProps = { pathname: string; hash: string }

// Full-screen menu for widths below the lg breakpoint, built on a modal <dialog>: the
// browser traps focus, makes the page behind inert, closes on Escape and returns focus to
// the button that opened it.
export function MobileMenu({ pathname, hash }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const current = currentNavKey(pathname, hash)

  // If the viewport grows past the menu breakpoint while the menu is open, close it so the
  // inline navigation takes over and the page is not left inert behind a hidden dialog.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const onChange = () => {
      if (query.matches) dialogRef.current?.close()
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const openMenu = () => {
    dialogRef.current?.showModal()
    setOpen(true)
    closeRef.current?.focus()
  }
  const closeMenu = () => dialogRef.current?.close()

  return (
    <>
      <button
        aria-controls="site-menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="mono-label inline-flex h-11 items-center border border-current px-4 lg:hidden"
        onClick={openMenu}
        type="button"
      >
        Menu +
      </button>
      <dialog
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-dvw max-w-none bg-surface p-0 text-fg open:flex open:flex-col"
        data-surface="canvas"
        id="site-menu"
        onClose={() => setOpen(false)}
        ref={dialogRef}
      >
        <div className="flex h-[72px] w-full flex-none items-center border-b border-rule"><div className="wrap flex w-full items-center justify-between">
          <Link className="inline-flex min-h-11 items-center text-[19px] font-semibold tracking-[-0.02em]" onClick={closeMenu} to="/">
            {profile.name}
          </Link>
          <button className="mono-label inline-flex h-11 items-center border border-current px-4" onClick={closeMenu} ref={closeRef} type="button">
            Close ×
          </button>
        </div></div>
        <nav aria-label="Primary" className="wrap w-full flex-1 overflow-y-auto pb-10 pt-6">
          <ul>
            {primaryNav.map((item, index) => (
              <li className="border-t border-rule last:border-b" key={item.key}>
                <Link
                  aria-current={current === item.key ? (pathname === '/' ? 'location' : 'page') : undefined}
                  className="flex min-h-[64px] items-baseline gap-4 py-3 font-serif text-[40px] font-light leading-none tracking-[-0.02em] aria-[current]:text-signal"
                  onClick={closeMenu}
                  to={item.to}
                >
                  <span className="mono-label w-6 text-fg-muted">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            className="mono-label mt-8 inline-flex h-12 items-center bg-canvas-ink px-6 font-medium text-canvas"
            download
            href="/cv.pdf"
            onClick={closeMenu}
          >
            Download CV ↓
          </a>
          <ul className="mt-8 flex gap-7">
            {socialLinks.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <a
                    className="mono-label inline-flex min-h-11 items-center underline underline-offset-[5px]"
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>
      </dialog>
    </>
  )
}
