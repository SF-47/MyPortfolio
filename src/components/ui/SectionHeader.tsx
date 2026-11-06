import type { ReactNode } from "react";

type Props = {
  id: string;
  index: string;
  label: string;
  title: string;
  /** second, quieter half of the heading */
  muted?: string;
  aside?: ReactNode;
};

/** "02 —— SELECTED WORK" label over a two-tone heading, with optional text on the right. */
export function SectionHeader({ id, index, label, title, muted, aside }: Props) {
  return (
    <div data-reveal className="mb-12 flex flex-col gap-4 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-fg-3 uppercase">
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="rule-grow h-px w-8 bg-accent/60" />
          {label}
        </p>
        <h2 id={id} className="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          {title}
          {muted && <span className="font-normal text-fg-3"> {muted}</span>}
        </h2>
      </div>
      {aside && <div className="max-w-sm text-sm leading-relaxed text-fg-3">{aside}</div>}
    </div>
  );
}
