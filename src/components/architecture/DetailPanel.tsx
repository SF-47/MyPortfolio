import type { ReactNode } from 'react'
import { layers, nodes, repositoryUrl, type LayerId, type NodeId } from '../../data/findly/architecture'
import { traceSourceLabel, type TraceStage } from '../../data/findly/trace'

type DetailPanelProps = {
  layer: LayerId
  selectedNode: NodeId | null
  stage: TraceStage | null
  stageNumber: number
  stageCount: number
  // False while the trace autoplays, so screen readers are not interrupted every step.
  announce: boolean
}

// The panel beside the diagram: the current trace step, else the selected component,
// else the selected layer.
export function DetailPanel({ layer, selectedNode, stage, stageNumber, stageCount, announce }: DetailPanelProps) {
  let eyebrow: string
  let heading: string
  let body: ReactNode

  if (stage) {
    eyebrow = `Trace · step ${stageNumber} of ${stageCount}`
    heading = stage.title
    body = (
      <>
        <p className="mt-2 text-fg-muted">{stage.text}</p>
        <p className="mono-label mt-6 border-t border-rule pt-4">
          <span className="text-fg-muted">Source </span>
          {traceSourceLabel[stage.source]}
        </p>
        {stage.note ? <p className="mt-2 text-[15px] text-fg-muted">{stage.note}</p> : null}
      </>
    )
  } else {
    const rows = selectedNode ? nodes[selectedNode].detail.rows : (layers.find((item) => item.id === layer)?.rows ?? [])
    eyebrow = selectedNode ? 'Selected component' : `Selected layer · ${layers.find((item) => item.id === layer)?.label}`
    heading = selectedNode ? nodes[selectedNode].title : (layers.find((item) => item.id === layer)?.heading ?? '')
    const note = selectedNode ? nodes[selectedNode].detail.note : undefined
    body = (
      <>
        <dl className="mt-6">
          {rows.map((row) => (
            <div className="grid grid-cols-[104px_1fr] gap-x-4 border-t border-rule py-3.5 last:border-b md:grid-cols-[130px_1fr]" key={row.label}>
              <dt className="mono-label text-fg-muted">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
        {note ? <p className="mt-4 text-[15px] text-fg-muted">{note}</p> : null}
      </>
    )
  }

  return (
    <section aria-label="Architecture details" aria-live={announce ? 'polite' : 'off'} className="border-t-[3px] border-signal pt-5">
      <p className="mono-label text-signal">{eyebrow}</p>
      <h3 className="text-h3 mt-3">{heading}</h3>
      {body}
      <a
        className="mono-label mt-6 inline-flex min-h-11 items-center text-signal underline underline-offset-[5px]"
        href={repositoryUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open repository →<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  )
}
