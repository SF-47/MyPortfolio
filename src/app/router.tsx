import { createBrowserRouter } from 'react-router'
import { ErrorPage } from '../routes/ErrorPage'
import { HomePage } from '../routes/HomePage'
import { NotFound } from '../routes/NotFound'
import { PageLoading } from '../routes/PageLoading'
import { RootLayout } from './RootLayout'
import { routes } from './meta'
import type { RouteHandle } from './routeHandle'

// Route paths come from pageMeta.json, the same file scripts/prerender-routes.mjs
// reads, so the router and the generated per-route HTML files cannot drift apart.
const childPath = (path: string) => path.replace(/^\//, '')

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <PageLoading />,
    children: [
      { index: true, element: <HomePage />, handle: { footerSeam: true, integratedHeader: true } satisfies RouteHandle },
      {
        path: childPath(routes.findly.path),
        lazy: async () => ({
          Component: (await import('../routes/FindlyCaseStudy')).FindlyCaseStudy,
        }),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
