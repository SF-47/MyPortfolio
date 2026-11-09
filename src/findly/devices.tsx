import type { ReactNode } from "react";

/**
 * Device chrome for the walkthrough. The screens inside are live React components on sample
 * data, styled after Findly's own dark UI, so they stay dark in both portfolio themes
 * (like the screenshot gallery in the project dialog).
 */

export function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="mx-auto w-full max-w-[300px] rounded-[2rem] border border-white/15 bg-[#0c0d10] p-[6px] shadow-float">
      <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[1.6rem] bg-[#0f1013] text-[13px] text-[#e5e7eb]">
        <div aria-hidden="true" className="flex h-7 shrink-0 items-center justify-between px-5 font-mono text-[10px] text-white/55">
          <span>9:41</span>
          <span className="h-[14px] w-16 rounded-full bg-black" />
          <span>5G</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminWindow({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div role="group" aria-label="Findly admin dashboard" className="overflow-hidden rounded-xl border border-white/10 bg-[#111317] text-[13px] text-[#e5e7eb] shadow-float">
      <div aria-hidden="true" className="flex h-8 items-center gap-1.5 border-b border-white/[0.06] bg-[#16181d] px-3">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/45">{url}</span>
      </div>
      {children}
    </div>
  );
}

/** Small pill used on the device screens. */
export function Tag({ tone, children }: { tone: "blue" | "green" | "red" | "amber" | "muted"; children: ReactNode }) {
  const tones = {
    blue: "bg-[#3b82f6]/15 text-[#93c5fd]",
    green: "bg-emerald-500/15 text-emerald-300",
    red: "bg-rose-500/15 text-rose-300",
    amber: "bg-amber-500/15 text-amber-200",
    muted: "bg-white/[0.06] text-white/60",
  } as const;
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}
