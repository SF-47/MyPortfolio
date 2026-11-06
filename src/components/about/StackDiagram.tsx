import type { CSSProperties } from "react";
import { TechIcons } from "../ui/TechIcons";

const layers = [
  {
    name: "Interface",
    note: "Web dashboards & mobile apps",
    stack: ["React", "Next.js", "React Native", "Expo", "Tailwind CSS"],
    extra: [],
  },
  {
    name: "API & logic",
    note: "REST, auth, workflows",
    stack: ["ASP.NET Core", "n8n", "Gemini"],
    extra: ["JWT", "Roles", "EF Core"],
  },
  {
    name: "Data",
    note: "Relational + realtime",
    stack: ["PostgreSQL", "Supabase", "Firebase", "MySQL"],
    extra: [],
  },
];

/** Two lanes between layers: requests travel down, responses come back up. */
function Connector({ delay }: { delay: number }) {
  return (
    <div aria-hidden="true" className="relative mx-auto flex h-14 w-24 justify-between">
      {[0, 1].map((lane) => (
        <div key={lane} className="relative h-full w-px bg-gradient-to-b from-line-strong via-accent/40 to-line-strong">
          {[0, 1].map((k) => (
            <span
              key={k}
              className="absolute -left-[3px] size-[7px] rounded-full bg-accent shadow-[0_0_10px_2px_rgb(59_130_246/0.6)]"
              style={
                {
                  "--travel": "56px",
                  top: 0,
                  // lane 0 carries requests down, lane 1 carries responses back up
                  animation: `packet 2.4s ${delay + k * 1.2 + lane * 0.6}s cubic-bezier(0.45,0,0.55,1) infinite ${lane === 1 ? "reverse" : "normal"}`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function StackDiagram() {
  return (
    <figure data-reveal="scale" className="shell [--r:2rem]">
      <div className="core p-5 sm:p-7" data-spotlight>
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-accent/15 blur-3xl" />
      <figcaption className="relative z-[2] mb-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">How I build</span>
        <span className="text-xs text-fg-3">one feature, every layer</span>
      </figcaption>

      {layers.map((layer, i) => (
        <div key={layer.name} className="relative z-[2]">
          <div className="group/layer relative rounded-2xl border border-line bg-tint p-4 transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow sm:p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-md bg-accent/15 font-mono text-[11px] text-accent">{i + 1}</span>
                <span className="font-semibold text-fg">{layer.name}</span>
              </p>
              <span className="text-xs text-muted">{layer.note}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TechIcons names={layer.stack} />
              {layer.extra.map((x) => (
                <span key={x} className="rounded-lg border border-line px-2 py-1 font-mono text-[11px] text-fg-3">
                  {x}
                </span>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && <Connector delay={i * 0.3} />}
        </div>
      ))}
      </div>
    </figure>
  );
}
