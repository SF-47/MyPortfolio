import { skillGroups } from "../../data/skills";
import { SectionHeader } from "../ui/SectionHeader";
import { ArchitectureMap } from "./ArchitectureMap";

/** CV skills that aren't already on the map, as a quiet text list. */
const byTitle = (t: string) => skillGroups.find((g) => g.title === t);
const rows = [
  { label: "Languages", items: byTitle("Languages")?.skills ?? [] },
  { label: "Also used", items: ["Tailwind CSS", "NativeWind", "HTML5", "CSS3", "SQL Server", "REST APIs"] },
  { label: "Tools", items: byTitle("Tools")?.skills ?? [] },
];

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="veil relative isolate mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader
        id="skills-title"
        index="03"
        label="Architecture"
        title="How the pieces"
        muted="connect."
        aside="The stack behind the projects above, drawn as it's actually wired. Pick a project to trace its path."
      />

      <ArchitectureMap />

      <dl className="mt-16 grid gap-x-10 gap-y-3 sm:mt-20">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6">
            <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase sm:pt-[3px]">{r.label}</dt>
            <dd className="text-sm leading-relaxed text-fg-2">{r.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
