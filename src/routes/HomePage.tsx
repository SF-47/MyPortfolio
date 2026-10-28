import { AboutSection } from '../components/home/AboutSection'
import { ContactSection } from '../components/home/ContactSection'
import { ExperienceSection } from '../components/home/ExperienceSection'
import { FeaturedProjects } from '../components/home/FeaturedProjects'
import { SkillsSection } from '../components/home/SkillsSection'
import { Hero } from '../components/hero/Hero'
import { SeamRuler } from '../components/layout/SeamRuler'
import { usePageMeta } from '../app/meta'
import { useScrollSpy } from '../hooks/useScrollSpy'

// Element ids of the sections the navigation points at, in page order.
const sectionIds = ['work', 'profile', 'capabilities', 'experience', 'contact'] as const

export function HomePage() {
  usePageMeta('home')
  useScrollSpy(sectionIds)

  return (
    <>
      <Hero />
      <FeaturedProjects />
      <AboutSection />
      <SeamRuler edge="bottom" tone="tint" />
      <SkillsSection />
      <SeamRuler edge="top" />
      <ExperienceSection />
      <SeamRuler edge="bottom" />
      <ContactSection />
    </>
  )
}
