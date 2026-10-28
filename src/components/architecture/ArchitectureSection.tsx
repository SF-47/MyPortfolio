import { useId, useState } from 'react'
import { ChipButton } from '../ui/ChipButton'
import { edges, layers, nodes, type LayerId, type NodeId } from '../../data/findly/architecture'
import { traceSourceLabel, traceStages } from '../../data/findly/trace'
import { usePrefersReducedMotion, useMediaQuery } from '../../hooks/useMediaQuery'
import { useRequestTrace } from '../../hooks/useRequestTrace'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { DetailPanel } from './DetailPanel'

// "How a request moves": the Findly architecture diagram with selectable layers, a detail
// panel, a text alternative and a request trace. Rendered on the dark canvas.
export function ArchitectureSection() {
  const [layer, setLayer] = useState<LayerId>('all')
  const [selectedNode, setSelectedNode] = useState<NodeId | null>(null)
  const [listOpen, setListOpen] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const wide = useMediaQuery('(min-width: 760px)')
  const trace = useRequestTrace(traceStages.length, !reducedMotion)
  const listId = useId()
  const stage = trace.step === null ? null : traceStages[trace.step]

  // Choosing a layer or a component ends any running trace.
  const selectLayer = (id: LayerId) => {
    trace.reset()
    setSelectedNode(null)
    setLayer(id)
  }
  const selectNode = (id: NodeId) => {
    trace.reset()
    setSelectedNode((current) => (current === id ? null : id))
  }

  const primary =
    trace.step === null
      ? { label: reducedMotion ? 'Start trace' : 'Play trace', run: trace.start }
      : trace.playing
        ? { label: 'Pause', run: trace.pause }
        : trace.atEnd
          ? { label: 'Replay', run: trace.start }
          : reducedMotion
            ? null
            : { label: 'Resume', run: trace.resume }

  return (
    <div>
      <p className="mono-label eyebrow text-signal">03 — Architecture</p>
      <h2 className="text-h2 mt-5">How a request moves.</h2>

      <div className="mt-8 flex flex-wrap items-center gap-2 md:mt-10">
        <div aria-label="Architecture layer" className="flex flex-wrap gap-2" role="group">
          {layers.map((item) => (
            <ChipButton active={layer === item.id} aria-pressed={layer === item.id} key={item.id} onClick={() => selectLayer(item.id)}>
              {item.label}
            </ChipButton>
          ))}
        </div>
        <ChipButton aria-controls={listId} aria-expanded={listOpen} className="md:ml-auto" onClick={() => setListOpen((open) => !open)}>
          {listOpen ? 'Hide list' : 'View as list'}
        </ChipButton>
      </div>

      <div className="mt-10 grid items-start gap-12 xl:grid-cols-[720px_minmax(0,1fr)] xl:gap-20">
        <div>
          <ArchitectureDiagram
            animate={!reducedMotion}
            layer={layer}
            layout={wide ? 'wide' : 'tall'}
            onSelectNode={selectNode}
            selectedNode={selectedNode}
            stage={stage}
            traceRun={trace.run}
          />
          <div className="mt-6 border border-rule p-5" hidden={!listOpen} id={listId}>
            <h3 className="mono-label text-fg-muted">Architecture as a list</h3>
            <ul className="mt-3 space-y-1">
              {Object.values(nodes).map((node) => (
                <li key={node.id}>
                  <strong className="font-medium">{node.title}</strong> — {node.meta}
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-1 border-t border-rule pt-4">
              {Object.values(edges).map((edge) => (
                <li key={edge.id}>{edge.description}</li>
              ))}
            </ul>
          </div>
          <p className="mono-label mt-6 max-w-[560px] text-fg-muted">Simplified drawing of the system, not generated from code. The moving dot is illustrative.</p>
        </div>
        <DetailPanel
          announce={!trace.playing}
          layer={layer}
          selectedNode={selectedNode}
          stage={stage}
          stageCount={traceStages.length}
          stageNumber={(trace.step ?? 0) + 1}
        />
      </div>

      <div className="mt-20 border-t border-rule pt-10">
        <h3 className="text-h3">Trace a new report</h3>
        <p className="mt-3 max-w-[640px] text-fg-muted">
          What happens, in order, when a student reports a lost or found item. Each step names where it is established: the Findly backend code, or only the project README (the n8n workflow
          that holds the Gemini step is not in the repository). The dot animation is illustrative.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {primary ? (
            <ChipButton active onClick={primary.run}>
              {primary.label}
            </ChipButton>
          ) : null}
          <ChipButton aria-disabled={trace.step === null || trace.step === 0} onClick={() => (trace.step === null || trace.step === 0 ? undefined : trace.previous())}>
            ← Prev
          </ChipButton>
          <ChipButton aria-disabled={trace.atEnd} onClick={() => (trace.atEnd ? undefined : trace.next())}>
            Next →
          </ChipButton>
          {trace.step !== null ? <ChipButton onClick={trace.reset}>Reset</ChipButton> : null}
          <span className="mono-label ml-1 text-fg-muted">{trace.step === null ? `${traceStages.length} steps` : `Step ${trace.step + 1} of ${traceStages.length}`}</span>
        </div>
        <p className="sr-only" role="status">
          {stage && !trace.playing ? `Step ${trace.step! + 1} of ${traceStages.length}: ${stage.title}` : ''}
        </p>
        <ol className="mt-8 grid gap-x-16 md:grid-cols-2">
          {traceStages.map((item, index) => {
            const current = trace.step === index
            return (
              <li
                aria-current={current ? 'step' : undefined}
                className={`grid grid-cols-[40px_1fr] gap-x-2 border-t border-rule py-5 ${current ? 'bg-signal/10 shadow-[inset_3px_0_0_var(--color-signal)]' : ''}`}
                key={item.id}
              >
                <span className={`mono-label pl-3 pt-1 ${current ? 'text-signal' : 'text-fg-muted'}`}>{String(index + 1).padStart(2, '0')}</span>
                <div className="pr-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-[15px] text-fg-muted">{item.text}</p>
                  <p className="mono-label mt-2 text-fg-muted">{traceSourceLabel[item.source]}</p>
                  {item.note ? <p className="mt-1 text-[14px] text-fg-muted">{item.note}</p> : null}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
