import { matchingFlow } from '../../data/findly/caseStudy'
import { traceSourceLabel } from '../../data/findly/trace'
import { Surface } from '../layout/Surface'
import { MatchingSimulation } from './MatchingSimulation'

// "Narrowing the candidates": an interactive walk through the backend candidate filter on
// invented sample data, then the flow around it with each step marked as confirmed in the
// backend code or described only in the project README.
export function FindlyMatching() {
  return (
    <Surface aria-labelledby="matching-heading" as="section" className="section-y pt-0" id="matching" tone="canvas">
      <div className="wrap border-t border-rule pt-14 md:pt-[72px]">
        <p className="mono-label eyebrow text-signal">04 — Matching</p>
        <h2 className="text-h2 mt-5" id="matching-heading">
          Narrowing the candidates.
        </h2>
        <p className="mt-6 max-w-[640px] text-fg-muted">
          When a student reports an item, the backend decides which existing reports are worth comparing, and it does that before any AI is involved.
        </p>

        <p className="mono-label mt-8 inline-block border border-rule px-3 py-2 text-fg-muted">Simulation · illustrative data · backend filter only</p>
        <div className="mt-8">
          <MatchingSimulation />
        </div>

        <div className="mt-20 border-t border-rule pt-10">
          <div className="max-w-[760px]">
            <h3 className="mono-label text-fg-muted">The flow around it</h3>
            <p className="mono-label mt-1 text-fg-muted">Where each step is established</p>
            <ol className="mt-5">
              {matchingFlow.map((step, index) => (
                <li className="grid grid-cols-[48px_1fr] gap-x-2 border-t border-rule py-4 last:border-b" key={step.id}>
                  <span className="mono-label pt-1 text-fg-muted">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-[18px] font-medium">{step.title}</p>
                    <p className="mt-0.5 text-[15px] text-fg-muted">{step.text}</p>
                    <p className={`mono-label mt-2 ${step.source === 'code' ? 'text-signal' : 'text-fg-muted'}`}>{traceSourceLabel[step.source]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-[520px] text-[15px] text-fg-muted">
              The n8n workflow itself is not in the repository, so the comparison and review steps rest on the project README. The backend side of saving and reviewing a match is covered in
              the request trace above.
            </p>
          </div>
        </div>
      </div>
    </Surface>
  )
}
