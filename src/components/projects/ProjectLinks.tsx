import type { Project } from "../../data/projects";
import { trackEvent } from "../../lib/analytics";
import { ArrowUpRight, GitHubIcon } from "../ui/icons";

function LinkIcon({ kind }: { kind: "repo" | "live" | "demo" }) {
  if (kind === "repo") return <GitHubIcon size={15} />;
  if (kind === "demo")
    return (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.6-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
      </svg>
    );
  return <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129/0.25)] motion-safe:animate-pulse" />;
}

export function ProjectLinks({ project, compact }: { project: Project; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.links.map((l, i) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            trackEvent("Project link", { project: project.slug, kind: l.kind });
          }}
          className={`group/link inline-flex items-center gap-2 rounded-full font-medium transition-[transform,background-color,border-color,box-shadow] duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            compact ? "px-3 py-2 text-[13px]" : "px-4 py-2.5 text-sm"
          } ${
            i === 0 && !compact
              ? "bg-btn text-btn-fg shadow-raised hover:-translate-y-0.5 hover:shadow-float"
              : "border border-line-strong text-fg hover:-translate-y-0.5 hover:bg-tint hover:shadow-raised"
          }`}
        >
          <LinkIcon kind={l.kind} />
          {l.label}
          <ArrowUpRight className="opacity-60 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:opacity-100" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
