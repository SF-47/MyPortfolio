import type { ReactNode } from 'react'

export function SectionHead({ index, label, title }: { index: string; label: string; title: ReactNode }) {
  return (
    <div className="mb-14 md:mb-20" data-reveal>
      <p className="eyebrow mb-6">
        <span className="eyebrow-dot" />
        {index} — {label}
      </p>
      <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
        {title}
      </h2>
    </div>
  )
}
