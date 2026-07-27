import { profile } from '../data/portfolioData'

export function About() {
  return (
    <section className="border-y border-outline-variant bg-surface-container-low py-24 md:py-40" id="profile">
      <div className="section-shell grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <p className="meta-num mb-4 text-primary">[02] PROFILE</p>
          <h2 className="section-title leading-tight">Systematic Thinking. Practical Execution.</h2>
        </div>
        <div className="space-y-10 md:col-span-8">
          <p className="font-display text-[28px] font-normal leading-relaxed text-on-surface md:text-[32px]">
            {profile.summary}
          </p>
          <div className="h-px w-full bg-outline-variant" />
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="label-caps mb-4 text-primary">Background</h3>
              <p className="text-body text-on-surface-variant">{profile.educationSummary}</p>
            </div>
            <div>
              <h3 className="label-caps mb-4 text-primary">Development Focus</h3>
              <p className="text-body text-on-surface-variant">{profile.growth}</p>
            </div>
            <div>
              <h3 className="label-caps mb-4 text-primary">Availability</h3>
              <p className="text-body text-on-surface-variant">{profile.availability}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
