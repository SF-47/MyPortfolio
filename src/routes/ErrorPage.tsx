import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { routes } from '../app/meta'

// Shown when a route throws, for example when a lazily loaded page chunk fails to download.
export function ErrorPage() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : null

  return (
    <main className="mx-auto max-w-container px-6 py-16" id="main">
      <p className="meta-num mb-4 text-primary">{status ?? 'Error'}</p>
      <h1 className="font-display text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-xl text-on-surface-variant">This page could not be loaded. Try again, or return to the home page.</p>
      <p className="mt-8 flex gap-6">
        <button className="underline underline-offset-4" onClick={() => window.location.reload()} type="button">
          Reload
        </button>
        <Link className="underline underline-offset-4" to={routes.home.path}>
          Go to the home page
        </Link>
      </p>
    </main>
  )
}
