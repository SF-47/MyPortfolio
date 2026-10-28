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

// Which item is current: anything under /work is "Work"; on the home page, the item whose
// section the URL hash points at; otherwise none.
export function currentNavKey(pathname: string, hash: string): NavKey | undefined {
  if (pathname.startsWith('/work')) return 'work'
  if (pathname === '/' && hash) return keyForHash(hash)
  return undefined
}
