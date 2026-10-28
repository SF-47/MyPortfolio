import type { ComponentPropsWithoutRef } from 'react'

export type SurfaceTone = 'paper' | 'tint' | 'canvas'

type SurfaceProps = ComponentPropsWithoutRef<'div'> & {
  tone?: SurfaceTone
  as?: 'div' | 'section' | 'header' | 'footer' | 'article' | 'aside'
}

// A full-bleed band of paper, tinted paper or dark canvas. It sets the surface tokens
// (see styles/tokens.css), so descendants use bg-surface, text-fg, border-rule and so on
// and are correct on either tone.
export function Surface({ tone = 'paper', as: Tag = 'div', className = '', ...props }: SurfaceProps) {
  return <Tag className={`bg-surface text-fg ${className}`} data-surface={tone} {...props} />
}
