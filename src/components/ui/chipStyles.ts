// Class names for the small mono-label control, shared by ChipButton and chip-styled links.
// Meant for the dark canvas.
export const chipClass = (active: boolean) =>
  `mono-label inline-flex h-11 items-center border px-3.5 aria-disabled:cursor-default aria-disabled:opacity-45 md:h-[34px] ${
    active ? 'border-signal bg-signal font-medium text-canvas' : 'border-canvas-line text-canvas-ink hover:border-canvas-ink'
  }`
