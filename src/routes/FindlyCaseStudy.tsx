import { FindlyHeader } from '../components/case-study/FindlyHeader'
import { FindlyMatching } from '../components/case-study/FindlyMatching'
import { FindlyOverview } from '../components/case-study/FindlyOverview'
import { FindlyStack } from '../components/case-study/FindlyStack'
import { ArchitectureSection } from '../components/architecture/ArchitectureSection'
import { SeamRuler } from '../components/layout/SeamRuler'
import { Surface } from '../components/layout/Surface'
import { ZoomableImage } from '../components/ui/ZoomableImage'
import { usePageMeta } from '../app/meta'
import { featuredProjects } from '../data/featured'
import { projects } from '../data/portfolioData'

const findly = projects.find((project) => project.id === '01')
const featured = featuredProjects.find((project) => project.id === '01')

// The Findly case study: header on paper, the screenshots on canvas, the engineering
// overview on paper, the architecture and matching sections on canvas, and the stack and
// links on paper.
export function FindlyCaseStudy() {
  usePageMeta('findly')

  return (
    <>
      <FindlyHeader />
      <SeamRuler edge="bottom" />
      <Surface aria-label="Project screenshots" as="section" className="pb-12 pt-12 md:pb-14 md:pt-16" tone="canvas">
        <div className="wrap">
          {findly && featured ? (
            <figure className="mx-auto max-w-[1200px]">
              <ZoomableImage alt={findly.imageAlt} blend crop={featured.crop} fullWidth={featured.imageWidth} label={findly.imageAlt} src={findly.image} />
              <figcaption className="mono-label mt-4 text-fg-muted">Fig. 1 — Findly admin dashboard, match comparison report and Expo mobile app</figcaption>
            </figure>
          ) : null}
        </div>
      </Surface>
      <SeamRuler edge="top" />
      <FindlyOverview />
      <SeamRuler edge="bottom" />
      <Surface aria-labelledby="architecture-heading" as="section" className="section-y pb-0" id="architecture" tone="canvas">
        <div className="wrap">
          <ArchitectureSection />
        </div>
      </Surface>
      <FindlyMatching />
      <SeamRuler edge="top" />
      <FindlyStack />
    </>
  )
}
