import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router'

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  // Internal route (router Link) or external / file URL (plain anchor).
  to?: string
  href?: string
  variant?: 'solid' | 'outline'
}

// A link that looks like a button: filled ink-on-paper, or outlined. Colours follow the
// surface it sits on.
export function ButtonLink({ to, href, variant = 'solid', className = '', ...props }: ButtonLinkProps) {
  const classes = `inline-flex h-[54px] items-center justify-between gap-3 px-6 font-medium text-[16px] ${
    variant === 'solid' ? 'bg-fg text-surface' : 'border-[1.5px] border-fg'
  } ${className}`
  return to ? <Link className={classes} to={to} {...props} /> : <a className={classes} href={href} {...props} />
}
