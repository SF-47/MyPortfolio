import type { ReactNode } from "react";
import github from "../../data/github.json";
import { profile, sections } from "../../data/profile";
import { projects } from "../../data/projects";
import { skillGroups } from "../../data/skills";
import { A, G, K, M, Table, Y } from "./out";
import { Run } from "./Run";

/** Everything a command can do besides printing. */
export type Ctx = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  close: () => void;
  clear: () => void;
  history: string[];
};

export type Command = {
  name: string;
  summary: string;
  usage?: string;
  /** values offered for Tab completion after the command name */
  args?: string[];
  hidden?: boolean;
  run: (args: string[], ctx: Ctx) => ReactNode;
};

const err = (msg: ReactNode) => <span className="text-[#fca5a5]">{msg}</span>;

/* ---------- commands ---------- */

const slugs = projects.map((p) => p.slug);
const groupFlags = skillGroups.map((g) => "--" + g.title.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"));

export const commands: Command[] = [
  {
    name: "help",
    summary: "list commands",
    run: () => (
      <div>
        <Table
          rows={commands
            .filter((c) => !c.hidden)
            .map((c) => [<K>{c.usage ?? c.name}</K>, <M>{c.summary}</M>])}
        />
        <p className="mt-2">
          <M>Tab completes · ↑ ↓ history · Ctrl+L clears · Esc closes</M>
        </p>
      </div>
    ),
  },
  {
    name: "whoami",
    summary: "one-line intro",
    run: () => (
      <span>
        {profile.name} <M>·</M> {profile.role} <M>·</M> {profile.location} <M>·</M> <G>● {profile.status.toLowerCase()}</G>
      </span>
    ),
  },
  {
    name: "about",
    summary: "a bit more about me",
    run: () => (
      <div className="space-y-2">
        <p>{profile.intro}</p>
        <Table
          rows={[
            [<M>education</M>, "B.Sc. Computer Science · Islamic University of Lebanon · 2026"],
            [<M>freelance</M>, <>Shawarma Story · Jan – Jul 2026 · <A href="https://shawarmastory.com">live</A></>],
            [<M>internship</M>, "TechTalks Community · Nov – Dec 2025"],
            [<M>languages</M>, profile.languages],
            [<M>status</M>, <G>{profile.statusDetail}</G>],
          ]}
        />
      </div>
    ),
  },
  {
    name: "projects",
    summary: "list projects",
    run: () => (
      <div className="space-y-1.5">
        {projects.map((p, i) => (
          <div key={p.slug}>
            <M>{String(i + 1).padStart(2, "0")}</M> <span className="font-semibold text-white">{p.title}</span> <M>— {p.label}</M>
            <div className="pl-7 text-white/70">{p.kicker}</div>
            <div className="pl-7">
              <Run cmd={`open ${p.slug}`} />
              {p.links.map((l) => (
                <span key={l.href}>
                  {"  "}
                  <A href={l.href}>{l.label.toLowerCase()}</A>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "open",
    summary: "open a project's details",
    usage: "open <project>",
    args: slugs,
    run: (args, ctx) => {
      const q = (args[0] ?? "").toLowerCase();
      const p = projects.find((x) => x.slug === q || x.slug.startsWith(q) || x.title.toLowerCase().startsWith(q));
      if (!q) return err(<>usage: open &lt;project&gt; · one of: {slugs.join(", ")}</>);
      if (!p) return err(<>no project “{q}” · try: {slugs.join(", ")}</>);
      // close the terminal first, so the dialog isn't behind it
      ctx.close();
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("open-project", { detail: p.slug })), 250);
      return <G>opening {p.title}…</G>;
    },
  },
  {
    name: "skills",
    summary: "tools I use · add a group flag to filter",
    usage: "skills [--group]",
    args: groupFlags,
    run: (args) => {
      const flag = args[0]?.toLowerCase();
      const groups = flag ? skillGroups.filter((_, i) => groupFlags[i].startsWith(flag)) : skillGroups;
      if (!groups.length) return err(<>unknown group · try: {groupFlags.join(" ")}</>);
      return (
        <Table
          rows={groups.map((g) => [
            <Y>{g.title}</Y>,
            <span>
              {g.skills.join(", ")}
              {g.also && <M> · {g.also.join(", ")}</M>}
            </span>,
          ])}
        />
      );
    },
  },
  {
    name: "github",
    summary: "GitHub activity",
    run: () => {
      const days = github.days as [string, number, number][];
      const last = days.slice(-7 * 26); // ~6 months
      const weeks: number[] = [];
      for (let i = 0; i < last.length; i += 7) weeks.push(last.slice(i, i + 7).reduce((s, d) => s + d[1], 0));
      const max = Math.max(1, ...weeks);
      const bars = "▁▂▃▄▅▆▇█";
      return (
        <div className="space-y-1">
          <div>
            <G>{github.total}</G> contributions · <G>{github.activeDays}</G> active days · <G>{github.publicRepos}</G> public repos <M>(last 12 months)</M>
          </div>
          <div className="tracking-[0.1em] text-[#60a5fa]" aria-label="Weekly contributions, last 6 months">
            {weeks.map((w, i) => (
              <span key={i} className={w ? "" : "text-white/15"}>
                {bars[w ? Math.max(1, Math.round((w / max) * 7)) : 0]}
              </span>
            ))}
          </div>
          <div>
            <M>last 6 months, one bar per week ·</M> <A href={profile.github}>github.com/{profile.githubHandle}</A>
          </div>
        </div>
      );
    },
  },
  {
    name: "contact",
    summary: "ways to reach me",
    run: (_, ctx) => (
      <div className="space-y-2">
        <Table
          rows={[
            [<M>email</M>, <A href={`mailto:${profile.email}`}>{profile.email}</A>],
            [<M>linkedin</M>, <A href={profile.linkedin}>{profile.linkedinHandle}</A>],
            [<M>github</M>, <A href={profile.github}>{profile.githubHandle}</A>],
          ]}
        />
        <div>
          <M>or use the form:</M>{" "}
          <button
            type="button"
            className="text-[#7dd3fc] underline underline-offset-2"
            onClick={() => {
              ctx.close();
              window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 250);
            }}
          >
            go to contact form
          </button>
        </div>
      </div>
    ),
  },
  {
    name: "email",
    summary: "open your mail app",
    run: () => {
      window.location.href = `mailto:${profile.email}`;
      return <G>opening mail to {profile.email}…</G>;
    },
  },
  {
    name: "cv",
    summary: "open my CV (PDF)",
    run: () => {
      window.open(profile.cv, "_blank", "noopener");
      return (
        <span>
          <G>opened</G> <A href={profile.cv}>cv.pdf</A> <M>in a new tab</M>
        </span>
      );
    },
  },
  {
    name: "theme",
    summary: "switch theme",
    usage: "theme [light|dark]",
    args: ["light", "dark"],
    run: (args, ctx) => {
      const want = args[0];
      if (want && want !== "light" && want !== "dark") return err("usage: theme [light|dark]");
      const next = (want as "light" | "dark") ?? (ctx.theme === "dark" ? "light" : "dark");
      ctx.setTheme(next);
      return <span>theme → <Y>{next}</Y> <M>(same as pulling the lamp)</M></span>;
    },
  },
  {
    name: "goto",
    summary: "scroll the page to a section",
    usage: "goto <section>",
    args: sections.map((s) => s.id),
    run: (args, ctx) => {
      const s = sections.find((x) => x.id.startsWith((args[0] ?? "").toLowerCase()));
      if (!args[0] || !s) return err(<>usage: goto &lt;section&gt; · {sections.map((x) => x.id).join(", ")}</>);
      ctx.close();
      window.setTimeout(() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }), 250);
      return <G>→ {s.label}</G>;
    },
  },
  {
    name: "history",
    summary: "commands you ran",
    run: (_, ctx) => (ctx.history.length ? <Table rows={ctx.history.map((h, i) => [<M>{i + 1}</M>, h])} /> : <M>no history yet</M>),
  },
  { name: "clear", summary: "clear the screen", run: (_, ctx) => (ctx.clear(), null) },
  { name: "exit", summary: "back to the normal site", run: (_, ctx) => (ctx.close(), null) },

  /* hidden extras */
  {
    name: "sudo",
    summary: "",
    hidden: true,
    run: (args) =>
      args.join(" ") === "hire sami" ? (
        <span>
          <G>[sudo] access granted.</G> Next step: <A href={`mailto:${profile.email}?subject=Let's%20talk`}>email {profile.email}</A> 🎉
        </span>
      ) : (
        err("sami is not in the sudoers file. This incident will be reported. (try: sudo hire sami)")
      ),
  },
  { name: "ls", summary: "", hidden: true, run: () => <span>{sections.map((s) => s.id + "/").join("  ")}  <G>cv.pdf</G></span> },
  { name: "pwd", summary: "", hidden: true, run: () => "/home/sami/portfolio" },
  { name: "date", summary: "", hidden: true, run: () => new Date().toLocaleString("en-GB", { timeZone: profile.timeZone }) + " (Beirut)" },
  { name: "echo", summary: "", hidden: true, run: (args) => args.join(" ") },
  { name: "rm", summary: "", hidden: true, run: () => err("nice try 🙂") },
];

export const commandNames = commands.map((c) => c.name);

export function findCommand(name: string) {
  return commands.find((c) => c.name === name);
}
