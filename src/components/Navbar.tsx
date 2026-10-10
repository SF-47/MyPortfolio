import { useEffect, useState } from 'react'
import { navItems, profile } from '../data/portfolioData'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#home')

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))
    const handleScroll = () => {
      const current = sectionIds.findLast((id) => {
        const section = document.getElementById(id)
        return section ? section.getBoundingClientRect().top <= 140 : false
      })

      if (current) {
        setActiveHref(`#${current}`)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-rule bg-paper/85 backdrop-blur-md">
        <div className="page flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <a className="whitespace-nowrap font-display text-[26px] leading-none tracking-tight" href="#home" onClick={closeMenu}>
            {profile.name}
            <span className="text-accent">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a
                className={`mono border-b pb-0.5 transition-colors hover:text-accent ${
                  activeHref === item.href ? 'border-accent text-accent' : 'border-transparent text-ink-soft'
                }`}
                href={item.href}
                key={item.href}
                aria-current={activeHref === item.href ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="btn !min-h-10 !w-auto !px-4 md:hidden"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      <div className={`fixed inset-0 z-30 bg-paper md:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <nav className="flex min-h-dvh flex-col justify-center gap-1 px-5 pb-8 pt-24" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a
              className={`display flex items-baseline gap-4 border-b border-rule py-3 text-[44px] ${
                activeHref === item.href ? 'text-accent' : ''
              }`}
              href={item.href}
              key={item.href}
              aria-current={activeHref === item.href ? 'page' : undefined}
              onClick={closeMenu}
            >
              <span className="mono text-ink-soft">0{index}</span>
              {item.label}
            </a>
          ))}
          <p className="mt-8 max-w-sm text-ink-soft">{profile.availability}</p>
        </nav>
      </div>
    </>
  )
}
