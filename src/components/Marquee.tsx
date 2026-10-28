import { marqueeItems } from '../data/portfolioData'

export function Marquee() {
  const track = (hidden: boolean) => (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {marqueeItems.map((item) => (
        <li className="flex items-center" key={item}>
          <span className="px-8 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] text-white/90">
            {item}
          </span>
          <span className="serif text-3xl text-violet" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="relative -rotate-1 border-y border-white/10 bg-white/[0.03] py-6 backdrop-blur-md" aria-label="Technologies I work with">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee">
          {track(false)}
          {track(true)}
        </div>
      </div>
    </div>
  )
}
