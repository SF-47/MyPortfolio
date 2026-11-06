import type { ReactNode } from "react";

/** Run a command typed into the input (used by clickable command links in the output). */
export function Run({ cmd, children }: { cmd: string; children?: ReactNode }) {
  return (
    <button
      type="button"
      data-run={cmd}
      className="rounded px-1 text-[#7dd3fc] ring-1 ring-[#7dd3fc]/25 transition-colors hover:bg-[#7dd3fc]/10"
    >
      {children ?? cmd}
    </button>
  );
}
