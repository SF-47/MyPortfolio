import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router'
import { textLinkClass } from './textLinkClass'

type TextLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  to?: string
  href?: string
  // Opens in a new tab: adds rel, target and a screen-reader note.
  external?: boolean
}

export function TextLink({ to, href, external = false, className = '', children, ...props }: TextLinkProps) {
  const classes = `${textLinkClass} ${className}`
  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <a className={classes} href={href} {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})} {...props}>
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  )
}
