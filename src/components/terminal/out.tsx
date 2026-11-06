import type { ReactNode } from "react";

/* ---------- small output helpers ---------- */

export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-[#7dd3fc] underline decoration-[#7dd3fc]/40 underline-offset-2 hover:decoration-[#7dd3fc]">
    {children}
  </a>
);
export const K = ({ children }: { children: ReactNode }) => <span className="text-[#c4b5fd]">{children}</span>; // keyword
export const M = ({ children }: { children: ReactNode }) => <span className="text-white/45">{children}</span>; // muted
export const G = ({ children }: { children: ReactNode }) => <span className="text-[#86efac]">{children}</span>; // green
export const Y = ({ children }: { children: ReactNode }) => <span className="text-[#fcd34d]">{children}</span>; // yellow

export function Table({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-0.5">
      {rows.map(([a, b], i) => (
        <div key={i} className="contents">
          <div>{a}</div>
          <div>{b}</div>
        </div>
      ))}
    </div>
  );
}
