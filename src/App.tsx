import { useCallback, useState } from 'react'
import { About } from './components/About'
import { Aurora } from './components/Aurora'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { Projects } from './components/Projects'
import { ScrollProgress } from './components/ScrollProgress'
import { Skills } from './components/Skills'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useSpotlight } from './hooks/useSpotlight'
import { prefersReducedMotion } from './lib/motion'

function App() {
  const [ready, setReady] = useState(prefersReducedMotion)
  const reveal = useCallback(() => setReady(true), [])

  useSmoothScroll(ready)
  useSpotlight()

  return (
    <>
      <a
        className="sr-only z-[10003] rounded-full bg-white px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        href="#main"
      >
        Skip to content
      </a>
      {ready && prefersReducedMotion() ? null : <Preloader onReveal={reveal} />}
      <Aurora />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
