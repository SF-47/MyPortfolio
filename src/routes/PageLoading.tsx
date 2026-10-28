// Shown by the router while the first page of a visit (a lazily loaded route) is downloading.
export function PageLoading() {
  return (
    <p className="mono-label wrap section-y text-fg-muted" role="status">
      Loading…
    </p>
  )
}
