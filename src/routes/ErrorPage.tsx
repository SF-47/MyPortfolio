import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { routes } from '../app/meta'

// Shown when a route throws, for example when a lazily loaded page chunk fails to download.
export function ErrorPage() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : null

  return (
    <main className="min-h-dvh bg-surface text-fg" data-surface="paper" id="main">
      <div className="wrap section-y">
        <p className="mono-label text-fg-muted">{status ?? 'Error'}</p>
        <h1 className="mt-6 text-display">Something went wrong</h1>
        <p className="mt-6 max-w-xl font-serif text-[length:var(--text-lede)] text-fg-muted">This page could not be loaded. Try again, or return to the home page.</p>
        <p className="mt-10 flex gap-8">
          <button className="inline-flex min-h-11 items-center underline underline-offset-4" onClick={() => window.location.reload()} type="button">
            Reload
          </button>
          <Link className="inline-flex min-h-11 items-center underline underline-offset-4" to={routes.home.path}>
            Go to the home page
          </Link>
        </p>
      </div>
    </main>
  )
}
