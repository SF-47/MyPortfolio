import { profile } from '../../data/portfolioData'
import { Surface } from '../layout/Surface'

// "Profile": the biography, in the owner's own words from the profile data, laid out
// asymmetrically: a narrow headline column and a wide reading column.
export function AboutSection() {
  const details = [
    { label: 'Background', text: profile.educationSummary },
    { label: 'Development focus', text: profile.growth },
    { label: 'Availability', text: profile.availability, wide: true },
  ]

  return (
    <Surface aria-labelledby="profile-heading" as="section" className="section-y" id="profile" tone="tint">
      <div className="wrap grid gap-8 xl:grid-cols-[4fr_8fr] xl:gap-[72px]">
        <div>
          <p className="mono-label eyebrow text-fg-muted">02 — Profile</p>
          <h2 className="mt-7 font-serif text-[40px] font-light leading-[1.05] tracking-[-0.025em] md:text-[56px]" id="profile-heading">
            Systematic thinking, <em>practical</em> execution.
          </h2>
        </div>
        <div>
          <p className="font-serif text-[24px] leading-[1.4] tracking-[-0.01em] md:text-[30px]">{profile.summary}</p>
          <dl className="mt-12 grid gap-x-14 gap-y-9 border-t border-rule pt-8 md:grid-cols-2">
            {details.map((detail) => (
              <div className={detail.wide ? 'md:col-span-2' : ''} key={detail.label}>
                <dt className="mono-label">{detail.label}</dt>
                <dd className="mt-2.5 text-fg-muted">{detail.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Surface>
  )
}
