// Primary navigation. The section links point at anchors on the home page; Findly's case
// study belongs to "Work". `to` is a router path with an optional hash.
export type NavKey = 'work' | 'about' | 'skills' | 'experience' | 'contact'

export const primaryNav: ReadonlyArray<{ key: NavKey; label: string; to: string }> = [
  { key: 'work', label: 'Work', to: '/#work' },
  { key: 'about', label: 'About', to: '/#profile' },
  { key: 'skills', label: 'Skills', to: '/#capabilities' },
  { key: 'experience', label: 'Experience', to: '/#experience' },
  { key: 'contact', label: 'Contact', to: '/#contact' },
]

const keyForHash = (hash: string) => primaryNav.find((item) => item.to.endsWith(hash))?.key

// Which item is current. Anything under /work is "Work". On the home page it is the section
// in view (from the scroll-spy, as an element id), or none while the hero is showing.
export function currentNavKey(pathname: string, activeSection: string | null): NavKey | undefined {
  if (pathname.startsWith('/work')) return 'work'
  if (pathname === '/' && activeSection) return keyForHash(`#${activeSection}`)
  return undefined
}
