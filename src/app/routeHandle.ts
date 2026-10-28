// Per-route flags read by RootLayout through useMatches().
export type RouteHandle = {
  // The page's last section is dark canvas, so the footer draws the seam ruler above itself.
  footerSeam?: boolean
  // The header overlays the top of the page's hero (home page, from xl up).
  integratedHeader?: boolean
}
