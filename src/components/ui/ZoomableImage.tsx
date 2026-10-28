import { useRef } from 'react'

type ZoomableImageProps = {
  src: string
  alt: string
  // Natural width of the image, used when it is shown expanded.
  fullWidth: number
  // Crop shown inline: removes the screenshot's empty margins.
  crop: { aspect: string; width: number; left: number; top: number }
  label: string
}

// A screenshot shown cropped, which opens full size in a modal dialog on click, tap or
// Enter. The dialog scrolls and can be pinch-zoomed, closes on Escape or its button, and
// returns focus to the image. The image is lazy loaded and has its dimensions reserved, so
// it does not shift the layout.
export function ZoomableImage({ src, alt, fullWidth, crop, label }: ZoomableImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        aria-label={`Expand image: ${label}`}
        className="relative block w-full cursor-zoom-in text-left"
        onClick={() => {
          dialogRef.current?.showModal()
          closeRef.current?.focus()
        }}
        type="button"
      >
        <span className="relative block overflow-hidden" style={{ aspectRatio: crop.aspect }}>
          <img
            alt={alt}
            className="absolute block h-auto max-w-none"
            decoding="async"
            loading="lazy"
            src={src}
            style={{ width: `${crop.width}%`, left: `${crop.left}%`, top: `${crop.top}%` }}
            width={fullWidth}
          />
        </span>
        <span aria-hidden="true" className="mono-label absolute bottom-2.5 right-2.5 inline-flex min-h-[34px] items-center gap-2 bg-signal px-3 py-2 font-medium text-canvas">
          Expand
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 16 16">
            <path d="M9.5 2.5h4v4M13.5 2.5l-4.5 4.5M6.5 13.5h-4v-4M2.5 13.5L7 9" />
          </svg>
        </span>
      </button>
      <dialog
        aria-label={label}
        className="m-0 h-dvh max-h-none w-dvw max-w-none bg-surface p-0 text-fg backdrop:bg-black/80"
        data-surface="canvas"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close()
        }}
        ref={dialogRef}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rule bg-surface px-5 py-2.5">
          <p className="mono-label text-fg-muted">Scroll or drag to pan · pinch to zoom · Esc to close</p>
          <button className="mono-label inline-flex h-11 items-center bg-signal px-4 font-medium text-canvas" onClick={() => dialogRef.current?.close()} ref={closeRef} type="button">
            Close ×
          </button>
        </div>
        <div className="h-[calc(100dvh-60px)] overflow-auto" tabIndex={0}>
          <img alt={alt} className="block h-auto max-w-none" src={src} style={{ width: fullWidth }} />
        </div>
      </dialog>
    </>
  )
}
