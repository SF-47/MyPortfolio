import type { ComponentPropsWithoutRef } from 'react'

type ChipButtonProps = ComponentPropsWithoutRef<'button'> & {
  // Filled with the signal colour: the selected tab or the primary action.
  active?: boolean
}

// Small mono-label control used for the architecture layer tabs and the trace controls.
// Meant for the dark canvas.
export function ChipButton({ active = false, className = '', type = 'button', ...props }: ChipButtonProps) {
  const tone = active ? 'border-signal bg-signal font-medium text-canvas' : 'border-canvas-line text-canvas-ink hover:border-canvas-ink'
  return (
    <button
      className={`mono-label inline-flex h-11 items-center border px-3.5 aria-disabled:cursor-default aria-disabled:opacity-45 md:h-[34px] ${tone} ${className}`}
      type={type}
      {...props}
    />
  )
}
