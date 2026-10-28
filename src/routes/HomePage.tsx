import { Link } from 'react-router'
import { SeamRuler } from '../components/layout/SeamRuler'
import { Surface, type SurfaceTone } from '../components/layout/Surface'
import { routes, usePageMeta } from '../app/meta'
import { profile, projects } from '../data/portfolioData'

// Temporary Milestone 2 page. It exists to exercise the surfaces, seam rulers and anchor
// navigation; the final hero and sections replace it in later milestones.
const sections: ReadonlyArray<{ id: string; tone: SurfaceTone; label: string; title: string }> = [
  { id: 'work', tone: 'paper', label: '01 — Selected work', title: 'Selected work.' },
  { id: 'profile', tone: 'tint', label: '02 — Profile', title: 'Systematic thinking, practical execution.' },
  { id: 'capabilities', tone: 'canvas', label: '03 — Skills', title: 'The toolbox.' },
  { id: 'experience', tone: 'paper', label: '04 — Experience', title: 'Experience & education.' },
  { id: 'contact', tone: 'canvas', label: '05 — Connect', title: 'Start a conversation.' },
]

export function HomePage() {
  usePageMeta('home')

  return (
    <>
      <Surface as="section" className="section-y">
        <div className="wrap">
          <p className="mono-label text-fg-muted">Milestone 2 · temporary content</p>
          <h1 className="mt-6 text-display">{profile.name}</h1>
          <p className="mt-6 max-w-xl font-serif text-[length:var(--text-lede)] text-fg-muted">
            {profile.title} — {profile.specialization}
          </p>
        </div>
      </Surface>
      {sections.map((section, index) => {
        const previous = sections[index - 1]
        const enteringCanvas = section.tone === 'canvas' && previous && previous.tone !== 'canvas'
        const leavingCanvas = section.tone !== 'canvas' && previous?.tone === 'canvas'
        return (
          <div className="contents" key={section.id}>
            {enteringCanvas ? <SeamRuler edge="bottom" tone={previous.tone === 'tint' ? 'tint' : 'paper'} /> : null}
            {leavingCanvas ? <SeamRuler edge="top" /> : null}
            <Surface as="section" className="section-y" id={section.id} tone={section.tone}>
              <div className="wrap">
                <p className="mono-label text-fg-muted">{section.label}</p>
                <h2 className="mt-4 text-h2">{section.title}</h2>
                {section.id === 'work' ? (
                  <ul className="mt-10 space-y-3">
                    {projects.map((project) => (
                      <li key={project.id}>
                        {project.id === '01' ? (
                          <Link className="underline underline-offset-4" to={routes.findly.path}>
                            {project.title}
                          </Link>
                        ) : (
                          <a className="underline underline-offset-4" href={project.liveUrl ?? project.repository} rel="noopener noreferrer" target="_blank">
                            {project.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )}
                        <span className="text-fg-muted"> — {project.kicker}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-10 text-fg-muted">Placeholder. Built in a later milestone.</p>
                )}
              </div>
            </Surface>
          </div>
        )
      })}
    </>
  )
}
