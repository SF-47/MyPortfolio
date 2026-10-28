// Shown by the router while the first page of a visit (a lazily loaded route) is downloading.
export function PageLoading() {
  return (
    <p className="label-caps px-6 py-16 text-on-surface-variant" role="status">
      Loading…
    </p>
  )
}
