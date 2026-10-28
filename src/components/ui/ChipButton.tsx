import type { ComponentPropsWithoutRef } from 'react'
import { chipClass } from './chipStyles'

type ChipButtonProps = ComponentPropsWithoutRef<'button'> & {
  // Filled with the signal colour: the selected tab or the primary action.
  active?: boolean
}

// Small mono-label control used for the architecture layer tabs and the trace controls.
export function ChipButton({ active = false, className = '', type = 'button', ...props }: ChipButtonProps) {
  return <button className={`${chipClass(active)} ${className}`} type={type} {...props} />
}
