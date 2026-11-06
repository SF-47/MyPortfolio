import { useCallback, useState, type CSSProperties } from "react";
import { trackEvent } from "../../lib/analytics";
import { caseStudies } from "../../data/caseStudies";
import { projects, type Project } from "../../data/projects";
import { SectionHeader } from "../ui/SectionHeader";
import { TechIcons } from "../ui/TechIcons";
import { GitHubActivity } from "./GitHubActivity";
import { ProjectCover } from "./ProjectCover";
import { ProjectDialog } from "./ProjectDialog";
import { ProjectLinks } from "./ProjectLinks";

function ProjectCard({ project, index, wide, onOpen }: { project: Project; index: number; wide?: boolean; onOpen: (p: Project) => void }) {
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 110}ms` } as CSSProperties}
      aria-labelledby={`${project.slug}-title`}
      className={`group shell shell-hover [--r:2rem] ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="core flex flex-col" data-spotlight>
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open the ${project.title} case study`}
        className="block w-full cursor-zoom-in text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        <span className="cover-tilt block">
          <ProjectCover project={project} wide={wide} />
        </span>
      </button>

      <div className={`flex flex-1 flex-col gap-5 p-6 sm:p-7 ${wide ? "lg:flex-row lg:items-end lg:justify-between lg:gap-10" : ""}`}>
        <div className={wide ? "lg:max-w-xl" : ""}>
          <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
            <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> · {project.label}
          </p>
          <h3 id={`${project.slug}-title`} className="mt-2.5 text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">
            {project.title}
          </h3>
          <p className="mt-2 leading-relaxed text-fg-2">{caseStudies[project.slug].problem}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-3">{project.kicker}</p>
        </div>

        <div className={`relative z-[2] flex flex-col gap-5 ${wide ? "lg:items-end" : "mt-auto"}`}>
          <TechIcons names={project.stack} />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="group/btn inline-flex items-center gap-2.5 rounded-full bg-btn py-1.5 pr-1.5 pl-4 text-[13px] font-medium text-btn-fg shadow-raised transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:shadow-float active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Case study
              <span className="grid size-7 place-items-center rounded-full bg-btn-fg/10 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/btn:translate-x-0.5 group-hover/btn:scale-105">
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6h7M6.5 3l3 3-3 3" />
                </svg>
              </span>
            </button>
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const onOpen = useCallback((p: Project) => {
    setSelected(p);
    setOpen(true);
    trackEvent("Project details", { project: p.slug });
  }, []);
  const onClose = useCallback(() => setOpen(false), []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-36">
      <SectionHeader
        id="projects-title"
        index="02"
        label="Selected work"
        title="Projects"
        muted="I've built."
        aside="Real screens from each project. Open one for the full story."
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} wide={index === 0} onOpen={onOpen} />
        ))}
      </div>

      <GitHubActivity />

      <ProjectDialog key={selected?.slug ?? "none"} project={selected} open={open} onClose={onClose} />
    </section>
  );
}
