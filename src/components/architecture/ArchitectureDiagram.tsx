import { useEffect, useRef } from 'react'
import {
  edges,
  layers,
  layouts,
  mergedAutomationNode,
  nodes,
  type DiagramLayout,
  type EdgeId,
  type LayerId,
  type NodeId,
} from '../../data/findly/architecture'
import type { TraceStage } from '../../data/findly/trace'

type Point = [number, number]

type ArchitectureDiagramProps = {
  layout: DiagramLayout
  // Interactive (default): components are buttons and layers / traces can highlight them.
  // Non-interactive: a quiet picture for the hero.
  interactive?: boolean
  // Draw n8n and Gemini AI as one node (the hero diagram).
  merged?: boolean
  layer?: LayerId
  selectedNode?: NodeId | null
  // The current trace stage, or null when no trace is active.
  stage?: TraceStage | null
  // Changes whenever a stage is entered, so the dot restarts.
  traceRun?: number
  animate?: boolean
  onSelectNode?: (id: NodeId) => void
  className?: string
}

const PACKET_MS = 1200
const HERO_DESCRIPTION =
  'Simplified Findly architecture. An Expo React Native app and a React admin dashboard call an ASP.NET Core API. The API uses PostgreSQL and triggers an n8n workflow that uses Gemini AI.'

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

export function ArchitectureDiagram({
  layout,
  interactive = true,
  merged = false,
  layer = 'all',
  selectedNode = null,
  stage = null,
  traceRun = 0,
  animate = false,
  onSelectNode,
  className = '',
}: ArchitectureDiagramProps) {
  const spec = layouts[layout]
  const tall = layout === 'tall'
  const height = merged ? spec.heightMerged : spec.height
  const layerHot = layers.find((item) => item.id === layer)?.hot ?? { nodes: [], edges: [] }
  const hotNodes: NodeId[] = stage ? stage.nodes : [...layerHot.nodes, ...(selectedNode ? [selectedNode] : [])]
  const hotEdges: EdgeId[] = stage ? (stage.edge ? [stage.edge] : []) : layerHot.edges
  // The quiet hero picture dims nothing.
  const nodeDimmed = (id: NodeId) => interactive && (stage ? !stage.nodes.includes(id) : id !== selectedNode && !nodes[id].layers.includes(layer))
  const edgeDimmed = (id: EdgeId) => interactive && (stage ? stage.edge !== id : !edges[id].layers.includes(layer))

  const packetPoints = (() => {
    if (!stage?.edge) return null
    const points = spec.edges[stage.edge].points
    return stage.direction === 'reverse' ? [...points].reverse() : points
  })()

  const nodeIds = (Object.keys(nodes) as NodeId[]).filter((id) => !(merged && id === 'gemini'))
  const edgeIds = (Object.keys(edges) as EdgeId[]).filter((id) => !(merged && id === 'n8nGemini'))

  return (
    <svg
      aria-label={interactive ? 'Findly architecture diagram. Select a component to see its details.' : HERO_DESCRIPTION}
      className={`block h-auto w-full overflow-visible ${tall ? 'max-w-[480px]' : 'max-w-[720px] md:max-w-[840px] xl:max-w-[720px]'} ${className}`}
      height={height}
      role={interactive ? 'group' : 'img'}
      viewBox={`0 0 ${spec.width} ${height}`}
      width={spec.width}
    >
      {edgeIds.map((id) => {
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
              <text className={`font-mono text-[12.5px] tracking-[0.04em] ${hot ? 'fill-signal' : 'fill-canvas-muted'}`} x={label[0]} y={label[1]}>
                {tall ? (edge.shortLabel ?? edge.label) : edge.label}
              </text>
            ) : null}
          </g>
        )
      })}
      {nodeIds.map((id) => {
        const node = nodes[id]
        const { x, y, w, h } = spec.nodes[id]
        const hot = hotNodes.includes(id)
        const dimmed = nodeDimmed(id)
        const selected = interactive && id === selectedNode
        const mergedNode = merged && id === 'n8n'
        const title = mergedNode ? mergedAutomationNode.title : node.title
        const lines = mergedNode
          ? tall
            ? mergedAutomationNode.metaTall
            : [mergedAutomationNode.meta]
          : ((tall ? node.metaTall : undefined) ?? node.metaLines ?? [node.meta])
        const metaY = lines.length > 1 ? 74 : tall ? (node.sub ? h - 40 : 76) : h - (node.sub ? 40 : 22)
        const content = (
          <>
            <rect
              className={`fill-canvas-raised ${hot ? 'stroke-signal' : dimmed ? 'stroke-canvas-stroke/50' : 'stroke-canvas-stroke'} ${interactive && !hot ? 'group-hover:stroke-canvas-line' : ''}`}
              height={h}
              strokeWidth={hot ? 2.5 : 1}
              width={w}
            />
            {interactive ? <rect className="fill-none stroke-signal opacity-0 group-focus-visible:opacity-100" height={h + 12} strokeWidth={2} width={w + 12} x={-6} y={-6} /> : null}
            <text className={`font-mono text-[12.5px] uppercase tracking-[0.05em] ${hot ? 'fill-signal' : 'fill-canvas-muted'}`} x={14} y={26}>
              {mergedNode ? 'Automation' : node.kind}
            </text>
            <text className={`fill-canvas-ink font-sans font-medium tracking-[-0.01em] ${id === 'api' ? (tall ? 'text-[21px]' : 'text-[24px]') : tall ? 'text-[16px]' : 'text-[20px]'}`} x={14} y={tall && id === 'api' ? 50 : 54}>
              {title}
            </text>
            {lines.map((line, index) => (
              <text className="fill-canvas-muted font-mono text-[12.5px]" key={line} x={14} y={metaY + index * 16}>
                {line}
              </text>
            ))}
            {node.sub ? (
              <text className="fill-canvas-ink font-mono text-[12.5px]" x={14} y={h - 20}>
                {node.sub}
              </text>
            ) : null}
          </>
        )
        if (!interactive) {
          return (
            <g key={id} transform={`translate(${x} ${y})`}>
              {content}
            </g>
          )
        }
        return (
          <g
            aria-label={`${title}, ${node.meta}`}
            aria-pressed={selected}
            className="group cursor-pointer outline-none"
            key={id}
            onClick={() => onSelectNode?.(id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelectNode?.(id)
              }
            }}
            role="button"
            tabIndex={0}
            transform={`translate(${x} ${y})`}
          >
            {content}
          </g>
        )
      })}
      {stage && packetPoints ? <Packet animate={animate} key={`${stage.id}-${traceRun}`} points={packetPoints} /> : null}
    </svg>
  )
}
