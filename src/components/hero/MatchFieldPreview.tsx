const WIDTH = 460
const HEIGHT = 150
const QUERY: [number, number] = [340, 76]
const RING_RADIUS = 46

// A small, fixed scatter of points with one query ring and its nearest neighbours. It is a
// still picture of the idea behind candidate matching, generated once from a fixed seed so
// it is identical on every load. It is a simulation, not data, and the hero says so.
function buildField() {
  let seed = 11
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const points: Array<[number, number]> = []
  const count = Math.round((WIDTH * HEIGHT) / 9500)
  for (let i = 0; i < count; i++) points.push([random() * WIDTH, random() * HEIGHT])
  for (let i = 0; i < 18; i++) {
    const angle = random() * Math.PI * 2
    const distance = 26 + random() * 90
    points.push([QUERY[0] + Math.cos(angle) * distance, QUERY[1] + Math.sin(angle) * distance])
  }
  const distanceToQuery = (p: [number, number]) => Math.hypot(p[0] - QUERY[0], p[1] - QUERY[1])
  const nearest = [...points].sort((a, b) => distanceToQuery(a) - distanceToQuery(b)).slice(0, 7)
  return { points, nearest }
}

const field = buildField()

export function MatchFieldPreview({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={`block h-auto ${className}`} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      {field.points.map(([x, y], index) => (
        <circle className="fill-canvas-muted/30" cx={x} cy={y} key={index} r={1.6} />
      ))}
      {field.nearest.map(([x, y], index) => (
        <g key={index}>
          <line className="stroke-signal/70" x1={QUERY[0]} x2={x} y1={QUERY[1]} y2={y} />
          <circle className="fill-signal" cx={x} cy={y} r={3} />
        </g>
      ))}
      <circle className="fill-none stroke-signal/85" cx={QUERY[0]} cy={QUERY[1]} r={RING_RADIUS} />
      <circle className="fill-signal" cx={QUERY[0]} cy={QUERY[1]} r={4} />
    </svg>
  )
}
