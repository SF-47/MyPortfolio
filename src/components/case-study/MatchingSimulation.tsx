import { useId, useState } from 'react'
import { ChipButton } from '../ui/ChipButton'
import { matchingStages } from '../../data/findly/matching'
import { candidateLimit, remainingCounts, sampleQuery, sampleSize, stageCount } from '../../data/findly/matchingSimulation'
import { MatchingField } from './MatchingField'

// Interactive walk through the backend candidate filter, using invented sample reports. It
// shows the seven criteria of GET /n8n/matching/candidates in the order they appear in the
// query. It does not run the real query and says nothing about the AI step that follows.
export function MatchingSimulation() {
  const [stage, setStage] = useState(0)
  const [tableOpen, setTableOpen] = useState(false)
  const tableId = useId()
  const current = stage === 0 ? null : matchingStages[stage - 1]
  const before = remainingCounts[Math.max(stage - 1, 0)]
  const after = remainingCounts[stage]
  const atStart = stage === 0
  const atEnd = stage === stageCount

  const summary = current
    ? `Stage ${stage} of ${stageCount}: ${current.label}. ${before - after} of ${before} sample reports removed, ${after} remain.`
    : `Start: ${sampleSize} sample reports, none filtered yet.`

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <ChipButton aria-disabled={atStart} onClick={() => (atStart ? undefined : setStage(stage - 1))}>
          ← Prev
        </ChipButton>
        <ChipButton active={!atEnd} aria-disabled={atEnd} onClick={() => (atEnd ? undefined : setStage(stage + 1))}>
          Next →
        </ChipButton>
        <ChipButton aria-disabled={atStart} onClick={() => setStage(0)}>
          Restart
        </ChipButton>
        <span className="mono-label ml-1 text-fg-muted">{atStart ? `Start · ${stageCount} stages` : `Stage ${stage} of ${stageCount}`}</span>
        <ChipButton aria-controls={tableId} aria-expanded={tableOpen} className="md:ml-auto" onClick={() => setTableOpen((open) => !open)}>
          {tableOpen ? 'Hide table' : 'View as table'}
        </ChipButton>
      </div>
      <p className="sr-only" role="status">
        {summary}
      </p>

      <div className="mt-8 grid items-start gap-10 xl:grid-cols-[720px_minmax(0,1fr)] xl:gap-20">
        <div>
          <div className="mono-label flex justify-between text-fg-muted">
            <span>Newest report →</span>
            <span>← oldest</span>
          </div>
          <div className="mt-2 border border-rule p-3 md:p-4">
            <MatchingField label={summary} stage={stage} />
          </div>
          <dl className="mono-label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-fg-muted">
            <div className="flex items-center gap-2">
              <svg aria-hidden="true" height="10" width="10">
                <rect className="fill-canvas-ink" height="10" width="10" />
              </svg>
              <dt className="sr-only">Mark</dt>
              <dd>Still standing</dd>
            </div>
            <div className="flex items-center gap-2">
              <svg aria-hidden="true" height="10" width="10">
                <path className="stroke-canvas-ink" d="M1 1L9 9M9 1L1 9" fill="none" strokeWidth="1.8" />
              </svg>
              <dd>Removed at this stage</dd>
            </div>
            <div className="flex items-center gap-2">
              <svg aria-hidden="true" height="10" width="10">
                <circle className="fill-canvas-stroke" cx="5" cy="5" r="2" />
              </svg>
              <dd>Removed earlier</dd>
            </div>
            <div className="flex items-center gap-2">
              <svg aria-hidden="true" height="10" width="10">
                <rect className="fill-signal" height="10" width="10" />
              </svg>
              <dd>Returned (last stage)</dd>
            </div>
          </dl>
          <p className="mono-label mt-5 max-w-[560px] text-fg-muted">
            Illustrative: {sampleSize} invented reports, not real students or the real query. Counts are chosen for teaching, not measured.
          </p>
        </div>

        <div>
          <section aria-label="Current stage" className="border-t-[3px] border-signal pt-5">
            <p className="mono-label text-signal">{current ? `Stage ${stage} of ${stageCount}` : 'Start'}</p>
            <h3 className="text-h3 mt-2">{current ? current.label : `${sampleSize} sample reports`}</h3>
            <p className="mt-3 text-fg-muted">
              {current
                ? current.detail
                : `A student has just reported a lost ${sampleQuery.item} (${sampleQuery.category}, ${sampleQuery.university}). The sample holds lost and found reports from several universities; the backend has to decide which are worth comparing.`}
            </p>
            {current ? (
              <p className="mono-label mt-4 break-words text-fg normal-case tracking-normal">
                <span className="text-fg-muted">in the query: </span>
                {current.condition}
              </p>
            ) : null}
            <p className="mt-5 flex items-baseline gap-3">
              <span className="font-mono text-[40px] font-medium leading-none tabular-nums">{after}</span>
              <span className="mono-label text-fg-muted">{atStart ? 'reports in the sample' : `remain · ${before - after} removed here`}</span>
            </p>
            {atEnd ? (
              <p className="mt-4 text-[15px] text-fg-muted">
                At most {candidateLimit} reports leave the backend, newest first. In this sample {remainingCounts[stageCount - 1]} passed every criterion, so the {remainingCounts[stageCount - 1] - candidateLimit} oldest are dropped by
                the limit.
              </p>
            ) : null}
          </section>

          <ol className="mt-8">
            {matchingStages.map((item, index) => {
              const number = index + 1
              const active = stage === number
              return (
                <li className="border-t border-rule last:border-b" key={item.id}>
                  <button
                    aria-current={active ? 'step' : undefined}
                    className={`grid min-h-11 w-full grid-cols-[36px_1fr_auto] items-baseline gap-x-2 py-2.5 pl-3 pr-3 text-left ${
                      active ? 'bg-signal/10 shadow-[inset_3px_0_0_var(--color-signal)]' : 'hover:bg-signal/5'
                    }`}
                    onClick={() => setStage(number)}
                    type="button"
                  >
                    <span className={`mono-label ${active ? 'text-signal' : 'text-fg-muted'}`}>{String(number).padStart(2, '0')}</span>
                    <span className={active ? 'font-medium' : stage >= number ? '' : 'text-fg-muted'}>{item.label}</span>
                    <span className="mono-label tabular-nums text-fg-muted">{stage >= number ? remainingCounts[number] : '—'}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="mt-10 grid border border-rule text-center md:grid-cols-[7fr_3fr]" role="group" aria-label="Where the simulation stops">
        <p className="mono-label p-3 text-fg">Backend candidate query · stages 1–7 · simulated</p>
        <p className="mono-label border-t border-dashed border-rule p-3 text-fg-muted md:border-l md:border-t-0">Then AI comparison · not simulated</p>
      </div>
      <p className="mt-3 max-w-[640px] text-[15px] text-fg-muted">
        The backend finishes filtering and applies the limit before any AI comparison. What happens after that, in the n8n workflow, is described only in the project README and is not shown here.
      </p>

      <div className="mt-8 border border-rule p-5" hidden={!tableOpen} id={tableId}>
        <h3 className="mono-label text-fg-muted">The seven stages as a table</h3>
        <table className="mt-4 w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Sample reports remaining after each backend filter stage. Illustrative data.</caption>
          <thead>
            <tr className="mono-label text-fg-muted">
              <th className="py-2 pr-3 font-normal" scope="col">
                Stage
              </th>
              <th className="py-2 pr-3 font-normal" scope="col">
                Rule
              </th>
              <th className="py-2 pr-3 text-right font-normal" scope="col">
                Removed
              </th>
              <th className="py-2 text-right font-normal" scope="col">
                Remain
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-rule">
              <td className="py-2 pr-3 tabular-nums">Start</td>
              <td className="py-2 pr-3">All sample reports</td>
              <td className="py-2 pr-3 text-right">—</td>
              <td className="py-2 text-right tabular-nums">{remainingCounts[0]}</td>
            </tr>
            {matchingStages.map((item, index) => (
              <tr className="border-t border-rule" key={item.id}>
                <td className="py-2 pr-3 tabular-nums">{index + 1}</td>
                <td className="py-2 pr-3">{item.label}</td>
                <td className="py-2 pr-3 text-right tabular-nums">{remainingCounts[index] - remainingCounts[index + 1]}</td>
                <td className="py-2 text-right tabular-nums">{remainingCounts[index + 1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-[15px] text-fg-muted">
          The backend returns at most {candidateLimit} reports, ordered by creation time with the newest first, and does this before the AI comparison. These counts belong to the invented sample only.
        </p>
      </div>
    </div>
  )
}
