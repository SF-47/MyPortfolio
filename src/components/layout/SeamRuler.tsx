import type { SurfaceTone } from './Surface'

type SeamRulerProps = {
  // The side of the ruler that touches the dark canvas; ticks grow inward from it.
  edge: 'top' | 'bottom' | 'left' | 'right'
  // Surface the ruler sits on (sets its background and tick colour).
  tone?: SurfaceTone
  className?: string
}

// Tick marks along the paper/canvas seam: horizontal for edge top/bottom, vertical for left/right.
export function SeamRuler({ edge, tone = 'paper', className = '' }: SeamRulerProps) {
  return <div aria-hidden="true" className={`seam seam-${edge} ${className}`} data-surface={tone} />
}
