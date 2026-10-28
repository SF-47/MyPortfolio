// Column template shared by the hero and, on the home page, the header that overlays it,
// so the wordmark sits over the paper column and the navigation over the canvas column.
export const heroColumns = 'xl:grid-cols-[minmax(480px,5fr)_minmax(0,7fr)]'

// Horizontal padding of the canvas column, and the matching offsets for the header
// navigation and the match-field band. Tighter between xl and 1360px so the diagram keeps
// its text at about 12px or larger.
export const heroCanvasPadding = {
  column: 'xl:px-6 min-[1360px]:px-10',
  navStart: 'xl:pl-6 min-[1360px]:pl-10',
  cvEnd: 'xl:mr-6 min-[1360px]:mr-10',
  bandInset: 'xl:inset-x-6 min-[1360px]:inset-x-10',
}
