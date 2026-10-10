export function SectionHead({ num, title, aside }: { num: string; title: string; aside?: string }) {
  return (
    <div className="mb-12 grid items-end gap-4 border-t border-ink pt-5 md:mb-20 md:grid-cols-12">
      <span className="mono text-accent md:col-span-2">({num})</span>
      <h2 className="display text-[44px] md:col-span-7 md:text-[72px]">{title}</h2>
      {aside ? <span className="mono text-ink-soft md:col-span-3 md:text-right">{aside}</span> : null}
    </div>
  )
}
