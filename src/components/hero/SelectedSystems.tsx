import { Link } from 'react-router'
import { routes } from '../../app/meta'
import { projects } from '../../data/portfolioData'

const rowClass = 'group grid min-h-[60px] grid-cols-[34px_1fr_24px] items-center py-3'

function Row({ index, title, descriptor }: { index: string; title: string; descriptor: string }) {
  return (
    <>
      <span className="mono-label text-fg-muted">{index}</span>
      <span>
        <span className="block font-serif text-[22px] leading-[1.2] tracking-[-0.01em] group-hover:underline">{title}</span>
        <span className="block text-[14px] text-fg-muted">{descriptor}</span>
      </span>
    </>
  )
}

// The project index in the hero: two rows, each a link. Findly opens its case study;
// Shawarma Story opens the live website.
export function SelectedSystems() {
  const findly = projects.find((project) => project.id === '01')
  const shawarma = projects.find((project) => project.id === '02')

  return (
    <section aria-labelledby="selected-systems">
      <h2 className="mono-label text-fg-muted" id="selected-systems">
        Selected systems
      </h2>
      <ul className="mt-3">
        <li className="border-t border-rule">
          <Link className={rowClass} to={routes.findly.path}>
            <Row descriptor="Lost-and-found platform" index="01" title={findly?.title ?? 'Findly'} />
            <span aria-hidden="true" className="text-right text-[20px] font-medium">
              →
            </span>
          </Link>
        </li>
        <li className="border-y border-rule">
          <a className={rowClass} href={shawarma?.liveUrl} rel="noopener noreferrer" target="_blank">
            <Row descriptor="Live client website" index="02" title={shawarma?.title ?? 'Shawarma Story QR Menu'} />
            <svg aria-hidden="true" className="ml-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 16 16">
              <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
            </svg>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </section>
  )
}
