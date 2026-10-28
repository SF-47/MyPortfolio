import { Link } from 'react-router'
import { routes, usePageMeta } from '../app/meta'

export function NotFound() {
  usePageMeta('notFound')

  return (
    <div className="wrap section-y">
      <p className="mono-label text-fg-muted">404</p>
      <h1 className="mt-6 text-display">Page not found</h1>
      <p className="mt-6 max-w-xl font-serif text-[length:var(--text-lede)] text-fg-muted">The page you asked for does not exist or has moved.</p>
      <p className="mt-10">
        <Link className="inline-flex min-h-11 items-center underline underline-offset-4" to={routes.home.path}>
          Go to the home page
        </Link>
      </p>
    </div>
  )
}
