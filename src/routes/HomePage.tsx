import { Link } from 'react-router'
import { routes, usePageMeta } from '../app/meta'
import { profile, projects } from '../data/portfolioData'

// Temporary Milestone 1 page. The final hero and sections replace this in later milestones.
export function HomePage() {
  usePageMeta('home')

  return (
    <>
      <p className="meta-num mb-4 text-primary">Milestone 1 scaffold</p>
      <h1 className="font-display text-5xl">{profile.name}</h1>
      <p className="mt-4 max-w-xl text-on-surface-variant">
        {profile.title} — {profile.specialization}
      </p>
      <h2 className="label-caps mt-12 mb-4">Selected work</h2>
      <ul className="space-y-3">
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
            <span className="text-on-surface-variant"> — {project.kicker}</span>
          </li>
        ))}
      </ul>
      <p className="mt-12">
        <a className="underline underline-offset-4" download href="/cv.pdf">
          Download CV
        </a>
      </p>
    </>
  )
}
