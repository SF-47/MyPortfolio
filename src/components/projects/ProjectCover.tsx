import type { Project } from "../../data/projects";
import { BrowserFrame, PhoneFrame } from "../ui/Frames";

/** Each project gets a composition built from its real screenshots. */
const STAGE_TINT: Record<string, string> = {
  findly: "radial-gradient(120% 90% at 20% 0%, rgb(59 130 246 / 0.32), transparent 60%), radial-gradient(80% 80% at 100% 100%, rgb(139 92 246 / 0.28), transparent 60%)",
  "flexible-portfolio": "radial-gradient(110% 90% at 0% 0%, rgb(251 191 36 / 0.22), transparent 55%), radial-gradient(90% 80% at 100% 100%, rgb(59 130 246 / 0.18), transparent 60%)",
  "shawarma-story": "radial-gradient(110% 90% at 50% 0%, rgb(16 185 129 / 0.25), transparent 60%), radial-gradient(70% 70% at 100% 100%, rgb(249 115 22 / 0.2), transparent 60%)",
};

const motion = "transition-transform duration-700 ease-[var(--ease-out-expo)]";

export function ProjectCover({ project, wide }: { project: Project; wide?: boolean }) {
  const [d0, d1] = project.desktop;
  const [p0, p1, p2] = project.phone;

  return (
    <div
      className={`relative isolate overflow-hidden bg-[#0b0d12] ${wide ? "aspect-[16/10] sm:aspect-[21/9]" : "aspect-[4/3]"}`}
      style={{ backgroundImage: STAGE_TINT[project.slug] }}
    >
      {/* fine grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {project.slug === "findly" && d0 && p0 && (
        <>
          <div className={`absolute top-[12%] left-[6%] w-[68%] ${motion} group-hover:-translate-y-1.5`}>
            <BrowserFrame shot={d0} url="admin.findly · matches" sizes="(min-width: 1024px) 760px, 70vw" />
          </div>
          <div className={`absolute top-[16%] right-[7%] w-[19%] rotate-[4deg] ${motion} group-hover:-translate-y-3 group-hover:rotate-[2deg]`}>
            <PhoneFrame shot={p0} />
          </div>
        </>
      )}

      {project.slug === "flexible-portfolio" && d0 && d1 && (
        <>
          <div className={`absolute top-[7%] right-[4%] w-[64%] rotate-[2deg] ${motion} group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:rotate-[3deg]`}>
            <BrowserFrame shot={d1} url="localhost:3000 · public site" sizes="(min-width: 1024px) 420px, 64vw" />
          </div>
          <div className={`absolute bottom-[7%] left-[4%] w-[70%] -rotate-[1.5deg] ${motion} group-hover:-translate-y-2 group-hover:-rotate-[2.5deg]`}>
            <BrowserFrame shot={d0} url="localhost/admin/sections" sizes="(min-width: 1024px) 460px, 72vw" />
          </div>
        </>
      )}

      {project.slug === "shawarma-story" && p0 && p1 && p2 && (
        <div className="absolute inset-x-0 top-[9%] flex justify-center">
          <div className={`relative z-0 mt-[6%] -mr-[4%] w-[27%] -rotate-[7deg] ${motion} group-hover:-translate-x-2 group-hover:-rotate-[9deg]`}>
            <PhoneFrame shot={p2} />
          </div>
          <div className={`relative z-10 w-[29%] ${motion} group-hover:-translate-y-2`}>
            <PhoneFrame shot={p0} />
          </div>
          <div className={`relative z-0 mt-[6%] -ml-[4%] w-[27%] rotate-[7deg] ${motion} group-hover:translate-x-2 group-hover:rotate-[9deg]`}>
            <PhoneFrame shot={p1} />
          </div>
        </div>
      )}

      {/* bottom fade into the card body */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b0d12]/80 to-transparent" />
    </div>
  );
}
