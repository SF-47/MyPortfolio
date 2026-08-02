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
      <header className="fixed top-0 z-[70] w-full border-b border-outline-variant bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-5 md:h-20 md:px-8">
          <a className="font-display text-xl font-semibold uppercase tracking-tight text-on-surface transition hover:text-primary md:text-3xl" href="#home" onClick={closeMenu}>
            {profile.name}
          </a>
          <nav className="hidden gap-9 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                href={item.href}
                isActive={activeHref === item.href}
                key={item.href}
                label={item.label}
              />
            ))}
          </nav>
          <div className="hidden max-w-[260px] text-right label-caps text-primary lg:block">
            {profile.availability}
          </div>
          <button
            className="editorial-menu-button md:hidden"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-[60] bg-[#0c0e10] shadow-2xl transition md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        id="mobile-menu"
      >
        <nav className="flex h-full flex-col border-t border-outline-variant bg-[#0c0e10] px-5 py-8" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              className={`nav-link border-b border-outline-variant px-4 py-5 transition-colors ${
                activeHref === item.href
                  ? 'bg-surface-container text-primary'
                  : 'bg-[#151719] text-on-surface hover:bg-surface-container'
              }`}
              href={item.href}
              key={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <p className="mt-8 max-w-sm text-body text-on-surface-variant">{profile.availability}</p>
        </nav>
      </div>
    </>
  )
}

function NavLink({ href, isActive, label }: { href: string; isActive: boolean; label: string }) {
  return (
    <a
      className={`nav-link pb-1 transition-colors hover:text-on-surface ${
        isActive ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'
      }`}
      href={href}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </a>
  )
}
