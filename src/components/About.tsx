import { profile } from '../data/portfolioData'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function About() {
  const details = [
    { title: 'Background', text: profile.educationSummary },
    { title: 'Development focus', text: profile.growth },
    { title: 'Availability', text: profile.availability },
  ]

  return (
    <section className="bg-paper-deep py-20 md:py-32" id="profile">
      <div className="page">
        <SectionHead num="02" title="Profile" aside="Thinking · Execution" />
        <Reveal>
          <p className="display max-w-[22ch] text-[40px] leading-[1.02] md:text-[76px]">
            Systematic thinking, <em className="text-accent">practical</em> execution.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-10 border-t border-ink pt-8 md:mt-24 md:grid-cols-3 md:gap-12">
          {details.map((item, index) => (
            <Reveal delay={index * 100} key={item.title}>
              <h3 className="mono mb-4 text-accent">{item.title}</h3>
              <p className="text-[17px] leading-7 text-ink-soft">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
