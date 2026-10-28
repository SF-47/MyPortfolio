import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navItems } from '../data/portfolioData'
import { scrollToTarget } from '../lib/scroll'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const [compact, setCompact] = useState(false)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navItems.forEach((item) => {
      const section = document.querySelector(item.href)
      if (section) observer.observe(section)
    })

    const onScroll = () => setCompact(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useLayoutEffect(() => {
    const measure = () => {
      const link = linkRefs.current[activeHref]
      if (link) setPill({ left: link.offsetLeft, width: link.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeHref])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const go = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[10000] flex justify-center px-4 pt-4 md:pt-5">
        <div
          className={`glass !bg-[rgb(10_11_20/0.72)] flex items-center gap-2 !rounded-full py-2 pl-3 pr-2 transition-all duration-500 md:gap-4 ${
            compact ? 'w-auto' : 'w-full max-w-[1000px]'
          } ${compact ? 'max-md:w-full' : ''} justify-between`}
        >
          <a
            className="flex items-center gap-2.5 pr-2 font-display text-[17px] font-semibold tracking-tight"
            href="#home"
            onClick={go('#home')}
            aria-label="Sami Farhat — back to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-[13px] font-bold text-ink">
              SF
            </span>
            <span className={compact ? 'hidden' : 'hidden sm:inline'}>Sami Farhat</span>
          </a>

          <nav className="relative hidden md:block" aria-label="Primary navigation">
            <span
              className="absolute inset-y-0 rounded-full bg-white/10 transition-all duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
              style={{ left: pill.left, width: pill.width }}
              aria-hidden="true"
            />
            <ul className="relative flex">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    ref={(node) => {
                      linkRefs.current[item.href] = node
                    }}
                    className={`block rounded-full px-4 py-2 text-sm transition-colors ${
                      activeHref === item.href ? 'text-white' : 'text-mute hover:text-white'
                    }`}
                    href={item.href}
                    aria-current={activeHref === item.href ? 'page' : undefined}
                    onClick={go(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a className="btn btn-primary !min-h-10 !px-5 text-sm" href="/cv.pdf" download>
              CV
            </a>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 md:hidden"
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((value) => !value)}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${
                    isOpen ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${
                    isOpen ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[9999] flex flex-col justify-center bg-ink/90 px-8 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="grid gap-2">
          {navItems.map((item, index) => (
            <li
              key={item.href}
              className={`transition-all duration-700 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: isOpen ? `${120 + index * 60}ms` : '0ms' }}
            >
              <a
                className="block font-display text-5xl font-semibold tracking-[-0.03em]"
                href={item.href}
                onClick={go(item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
