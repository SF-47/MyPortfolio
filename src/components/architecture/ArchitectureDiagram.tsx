import { useEffect, useRef } from 'react'
import { edges, layers, layouts, nodes, type DiagramLayout, type EdgeId, type LayerId, type NodeId } from '../../data/findly/architecture'
import type { TraceStage } from '../../data/findly/trace'

type Point = [number, number]

type ArchitectureDiagramProps = {
  layout: DiagramLayout
  layer: LayerId
  selectedNode: NodeId | null
  // The current trace stage, or null when no trace is active.
  stage: TraceStage | null
  // Changes whenever a stage is entered, so the dot restarts.
  traceRun: number
  animate: boolean
  onSelectNode: (id: NodeId) => void
}

const PACKET_MS = 1200

// Position along an orthogonal route, t from 0 to 1 by distance.
function pointAt(points: Point[], t: number): Point {
  const lengths = points.slice(1).map((p, i) => Math.abs(p[0] - points[i][0]) + Math.abs(p[1] - points[i][1]))
  let remaining = t * lengths.reduce((sum, length) => sum + length, 0)
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] || i === lengths.length - 1) {
      const ratio = lengths[i] === 0 ? 0 : Math.min(remaining / lengths[i], 1)
      return [points[i][0] + (points[i + 1][0] - points[i][0]) * ratio, points[i][1] + (points[i + 1][1] - points[i][1]) * ratio]
    }
    remaining -= lengths[i]
  }
  return points[0]
}

// One dot that travels along the active edge once per stage. The animation is driven by
// requestAnimationFrame writing straight to the element, so React does not re-render per
// frame. With animation off (reduced motion) the dot simply sits at the end of the edge.
function Packet({ points, animate }: { points: Point[]; animate: boolean }) {
  const ref = useRef<SVGGElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const place = (t: number) => {
      const [x, y] = pointAt(points, t)
      element.setAttribute('transform', `translate(${x} ${y})`)
    }
    if (!animate) {
      place(1)
      return
    }
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / PACKET_MS, 1)
      place(t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    place(0)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [points, animate])

  return (
    <g ref={ref} transform={`translate(${points[0][0]} ${points[0][1]})`}>
      <circle className="fill-none stroke-signal/50" r={14} strokeWidth={1.5} />
      <circle className="fill-signal" r={6.5} />
    </g>
  )
}

export function ArchitectureDiagram({ layout, layer, selectedNode, stage, traceRun, animate, onSelectNode }: ArchitectureDiagramProps) {
  const spec = layouts[layout]
  const tall = layout === 'tall'
  const layerHot = layers.find((item) => item.id === layer)?.hot ?? { nodes: [], edges: [] }
  const hotNodes: NodeId[] = stage ? stage.nodes : [...layerHot.nodes, ...(selectedNode ? [selectedNode] : [])]
  const hotEdges: EdgeId[] = stage ? (stage.edge ? [stage.edge] : []) : layerHot.edges
  const nodeDimmed = (id: NodeId) => (stage ? !stage.nodes.includes(id) : id !== selectedNode && !nodes[id].layers.includes(layer))
  const edgeDimmed = (id: EdgeId) => (stage ? stage.edge !== id : !edges[id].layers.includes(layer))

  const packetPoints = (() => {
    if (!stage?.edge) return null
    const points = spec.edges[stage.edge].points
    return stage.direction === 'reverse' ? [...points].reverse() : points
  })()

  return (
    <svg
      aria-label="Findly architecture diagram. Select a component to see its details."
      className="block h-auto w-full max-w-[720px] overflow-visible"
      height={spec.height}
      role="group"
      viewBox={`0 0 ${spec.width} ${spec.height}`}
      width={spec.width}
    >
      {(Object.keys(edges) as EdgeId[]).map((id) => {
        const { points, label } = spec.edges[id]
        const hot = hotEdges.includes(id)
        const dimmed = edgeDimmed(id)
        const line = hot ? 'stroke-signal' : dimmed ? 'stroke-canvas-line/45' : 'stroke-canvas-line'
        const edge = edges[id]
        return (
          <g key={id}>
            <path className={`fill-none ${line}`} d={`M${points.map((p) => p.join(',')).join(' L')}`} strokeLinejoin="round" strokeWidth={hot ? 3 : 1.5} />
            {[points[0], points[points.length - 1]].map((p, index) => (
              <circle className={`fill-canvas ${hot ? 'stroke-signal' : dimmed ? 'stroke-canvas-ink/60' : 'stroke-canvas-ink'}`} cx={p[0]} cy={p[1]} key={index} r={4.5} strokeWidth={1.5} />
            ))}
            {label && edge.label ? (
              <text className={`font-mono text-[11.5px] tracking-[0.04em] ${hot ? 'fill-signal' : 'fill-canvas-muted'}`} x={label[0]} y={label[1]}>
                {tall ? (edge.shortLabel ?? edge.label) : edge.label}
              </text>
            ) : null}
          </g>
        )
      })}
      {(Object.keys(nodes) as NodeId[]).map((id) => {
        const node = nodes[id]
        const { x, y, w, h } = spec.nodes[id]
        const hot = hotNodes.includes(id)
        const dimmed = nodeDimmed(id)
        const selected = id === selectedNode
        const metaLines = tall && node.metaTall ? node.metaTall : [node.meta]
        const metaY = tall ? (node.metaTall || !node.sub ? 74 : h - 40) : h - (node.sub ? 40 : 22)
        return (
          <g
            aria-label={`${node.title}, ${node.meta}`}
            aria-pressed={selected}
            className="group cursor-pointer outline-none"
            key={id}
            onClick={() => onSelectNode(id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectNode(id)
              }
            }}
            role="button"
            tabIndex={0}
            transform={`translate(${x} ${y})`}
          >
            <rect
              className={`fill-canvas-raised ${hot ? 'stroke-signal' : dimmed ? 'stroke-canvas-stroke/50 group-hover:stroke-canvas-line' : 'stroke-canvas-stroke group-hover:stroke-canvas-line'}`}
              height={h}
              strokeWidth={hot ? 2.5 : 1}
              width={w}
            />
            <rect className="fill-none stroke-signal opacity-0 group-focus-visible:opacity-100" height={h + 12} strokeWidth={2} width={w + 12} x={-6} y={-6} />
            <text className={`font-mono text-[11.5px] uppercase tracking-[0.05em] ${hot ? 'fill-signal' : 'fill-canvas-muted'}`} x={14} y={26}>
              {node.kind}
            </text>
            <text className={`font-sans font-medium tracking-[-0.01em] fill-canvas-ink ${id === 'api' ? (tall ? 'text-[21px]' : 'text-[23px]') : tall ? 'text-[16px]' : 'text-[19px]'}`} x={14} y={tall && id === 'api' ? 50 : 54}>
              {node.title}
            </text>
            {metaLines.map((line, index) => (
              <text className="fill-canvas-muted font-mono text-[11px]" key={line} x={14} y={metaY + index * 15}>
                {line}
              </text>
            ))}
            {node.sub ? (
              <text className="fill-canvas-ink font-mono text-[11px]" x={14} y={h - 20}>
                {node.sub}
              </text>
            ) : null}
          </g>
        )
      })}
      {stage && packetPoints ? <Packet animate={animate} key={`${stage.id}-${traceRun}`} points={packetPoints} /> : null}
    </svg>
  )
}
