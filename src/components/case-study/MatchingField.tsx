import { isRetained, sampleRecords, sampleSize, stageCount } from '../../data/findly/matchingSimulation'

const COLUMNS = 16
const CELL = 40
const ROWS = Math.ceil(sampleSize / COLUMNS)

type Props = { stage: number; label: string }

// The sample reports as a grid, newest first (left to right, top to bottom). A report's mark
// says what happened to it, so nothing depends on colour alone:
//   filled square  still standing      cross  removed at this stage      dot  removed earlier
// On the last stage the 20 reports the backend returns are drawn in the signal colour.
export function MatchingField({ stage, label }: Props) {
  const final = stage === stageCount
  return (
    <svg aria-label={label} className="block h-auto w-full" role="img" viewBox={`0 0 ${COLUMNS * CELL} ${ROWS * CELL}`}>
      {sampleRecords.map((record) => {
        const cx = (record.index % COLUMNS) * CELL + CELL / 2
        const cy = Math.floor(record.index / COLUMNS) * CELL + CELL / 2
        if (isRetained(record, stage)) {
          const kept = final
          const size = kept ? 20 : 16
          return <rect className={kept ? 'fill-signal' : 'fill-canvas-ink'} height={size} key={record.index} width={size} x={cx - size / 2} y={cy - size / 2} />
        }
        if (record.removedAt === stage) {
          const d = 8
          return (
            <path className="stroke-canvas-ink" d={`M${cx - d} ${cy - d}L${cx + d} ${cy + d}M${cx + d} ${cy - d}L${cx - d} ${cy + d}`} fill="none" key={record.index} strokeWidth={3} />
          )
        }
        return <circle className="fill-canvas-stroke" cx={cx} cy={cy} key={record.index} r={3} />
      })}
    </svg>
  )
}
