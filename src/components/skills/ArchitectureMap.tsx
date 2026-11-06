import { useCallback, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { archProjects, edges, layers, nodes, type ArchNode, type ProjectKey } from "../../data/architecture";
import { tech } from "../../data/tech";
import { useDrawProgress } from "../../hooks/useDrawProgress";
import { TechLogo } from "../ui/TechLogo";

type Selected = ProjectKey | "all";
type Path = { d: string; from: string; to: string; order: number; projects: ProjectKey[]; label: string };

const LAYER_INDEX = Object.fromEntries(layers.map((l, i) => [l.id, i]));

function NodeIcon({ node }: { node: ArchNode }) {
  const t = node.logo ? tech(node.logo) : undefined;
  if (t) return <TechLogo t={t} size={18} />;
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent">
      {node.icon === "key" ? (
        <>
          <circle cx="8" cy="15" r="4" />
          <path d="m10.8 12.2 8.7-8.7M17 6l2.5 2.5M14.5 8.5 16.5 10.5" />
        </>
      ) : (
        <path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H8.5z" />
      )}
    </svg>
  );
}

/** Measures node positions and returns SVG paths between them (desktop only). */
function usePaths(stageRef: RefObject<HTMLDivElement | null>) {
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia("(min-width: 1024px)").matches) {
      setPaths([]);
      return;
    }
    const box = stage.getBoundingClientRect();
    const rect = (id: string) => {
      const el = stage.querySelector<HTMLElement>(`[data-node="${id}"]`);
      const r = el!.getBoundingClientRect();
      return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 };
    };
    const next: Path[] = edges.map((e) => {
      const a = rect(e.from);
      const b = rect(e.to);
      const la = LAYER_INDEX[nodes.find((n) => n.id === e.from)!.layer];
      const lb = LAYER_INDEX[nodes.find((n) => n.id === e.to)!.layer];
      let d: string;
      if (la === lb) {
        // same column: a short straight link between the two stacked nodes
        const x = a.l + 21;
        d = `M ${x} ${a.b} L ${x} ${b.t}`;
      } else {
        const x1 = a.r;
        const x2 = b.l;
        const k = Math.max(40, (x2 - x1) * 0.45);
        d = `M ${x1} ${a.cy} C ${x1 + k} ${a.cy}, ${x2 - k} ${b.cy}, ${x2} ${b.cy}`;
      }
      return { d, from: e.from, to: e.to, order: Math.min(la, lb) + (la === lb ? 0.5 : 0), projects: e.projects, label: e.label };
    });
    setSize({ w: box.width, h: box.height });
    setPaths(next);
  }, [stageRef]);

  useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure, stageRef]);

  return { paths, size };
}

export function ArchitectureMap() {
  const [selected, setSelected] = useState<Selected>("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { paths, size } = usePaths(stageRef);
  // the signal path is keyed by the selection, so it replays each time a project is picked
  useDrawProgress(rootRef);

  const activeNodes = useMemo(() => {
    if (selected === "all") return null;
    const s = new Set<string>();
    edges.filter((e) => e.projects.includes(selected)).forEach((e) => (s.add(e.from), s.add(e.to)));
    return s;
  }, [selected]);

  const isActiveEdge = (p: { projects: ProjectKey[] }) => selected === "all" || p.projects.includes(selected);
  const current = archProjects.find((p) => p.key === selected)!;

  return (
    <div ref={rootRef} className="arch" style={{ "--draw": 1 } as CSSProperties}>
      {/* project selector */}
      <div role="group" aria-label="Show the architecture of" className="flex flex-wrap gap-2">
        {archProjects.map((p) => {
          const on = p.key === selected;
          return (
            <button
              key={p.key}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(p.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                on ? "border-accent/60 bg-accent/12 text-fg shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_14%,transparent)]" : "border-line-strong text-fg-3 hover:border-fg-3 hover:text-fg"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* the map */}
      <div ref={stageRef} className="arch-stage relative mt-10">
        {size.w > 0 && (
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-visible lg:block" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            {paths.map((p) => {
              const on = isActiveEdge(p);
              return (
                <g key={`${p.from}-${p.to}`} className={`arch-edge ${on ? "is-on" : "is-off"}`} style={{ "--s": (p.order / 3).toFixed(3) } as CSSProperties}>
                  <path d={p.d} pathLength={1} className="arch-line" />
                  {on && selected !== "all" && <path key={selected} d={p.d} pathLength={1} className="arch-signal" />}
                </g>
              );
            })}
          </svg>
        )}

        <ol className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-x-16 xl:gap-x-24">
          {layers.map((layer, li) => (
            <li key={layer.id} className="relative">
              {/* phones: a short connector between stacked layers */}
              {li > 0 && <span aria-hidden="true" className="absolute -top-8 left-5 h-8 w-px bg-gradient-to-b from-transparent to-accent/50 lg:hidden" />}
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase">
                <span className="text-accent">{String(li + 1).padStart(2, "0")}</span> <span className="text-fg">{layer.label}</span>
                <span className="mt-1 block tracking-normal text-muted normal-case">{layer.hint}</span>
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                {nodes
                  .filter((n) => n.layer === layer.id)
                  .map((n) => {
                    const dim = activeNodes && !activeNodes.has(n.id);
                    return (
                      <li
                        key={n.id}
                        data-node={n.id}
                        className={`arch-node relative flex items-center gap-2.5 rounded-xl border bg-bg px-3 py-2.5 shadow-soft transition-[opacity,border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] ${
                          dim ? "border-line opacity-35" : activeNodes ? "border-accent/55 shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)]" : "border-line"
                        }`}
                      >
                        <NodeIcon node={n} />
                        <span className="min-w-0">
                          <span className="block text-sm leading-tight font-medium text-fg">{n.name}</span>
                          <span className="block font-mono text-[10.5px] leading-tight text-muted">{n.note}</span>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {/* what the highlighted path means */}
      <div className="mt-10 grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">{selected === "all" ? "Overview" : current.label}</p>
        <div aria-live="polite">
          <p key={selected} className="arch-summary max-w-[62ch] leading-relaxed text-fg-2">
            {current.summary}
          </p>
          {selected !== "all" && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11.5px] text-fg-3">
              {edges
                .filter((e) => e.projects.includes(selected))
                .map((e) => (
                  <li key={`${e.from}-${e.to}`} className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
                    {e.label}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
