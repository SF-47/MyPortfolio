import { Link } from 'react-router'
import { routes, usePageMeta } from '../app/meta'

export function NotFound() {
  usePageMeta('notFound')

  return (
    <>
      <p className="meta-num mb-4 text-primary">404</p>
      <h1 className="font-display text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-on-surface-variant">The page you asked for does not exist or has moved.</p>
      <p className="mt-8">
        <Link className="underline underline-offset-4" to={routes.home.path}>
          Go to the home page
        </Link>
      </p>
    </>
  )
}
