import { createContext, useContext } from 'react'

type ActiveSection = { active: string | null; setActive: (id: string | null) => void }

// The home-page section currently in view (an element id), set by useScrollSpy and read by
// the header and the mobile menu. null means no section: the hero, or another page.
export const ActiveSectionContext = createContext<ActiveSection>({ active: null, setActive: () => {} })

export const useActiveSection = () => useContext(ActiveSectionContext)
