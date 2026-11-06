import { useEffect, useRef } from "react";
import github from "../../data/github.json";
import { profile } from "../../data/profile";
import { ArrowUpRight, GitHubIcon } from "../ui/icons";

type Day = [date: string, count: number, level: number];

const LEVEL_CLASS = [
  "bg-fg/[0.06]",
  "bg-accent/30",
  "bg-accent/55",
  "bg-accent/80",
  "bg-accent",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Columns of 7 days (Sun..Sat), like GitHub's calendar. */
function toWeeks(days: Day[]) {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = [];
  const firstDow = new Date(days[0][0] + "T00:00:00Z").getUTCDay();
  for (let i = 0; i < firstDow; i++) week.push(null);
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function formatDay(date: string) {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function GitHubActivity() {
  const days = github.days as Day[];
  const weeks = toWeeks(days);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetched = new Date(github.fetchedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // On narrow screens the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  // Month labels: put the month name over the first week that starts in it.
  const monthLabels = weeks.map((w, i) => {
    const first = w.find(Boolean);
    if (!first) return "";
    const m = new Date(first[0] + "T00:00:00Z").getUTCMonth();
    const prev = weeks[i - 1]?.find(Boolean);
    const prevM = prev ? new Date(prev[0] + "T00:00:00Z").getUTCMonth() : -1;
    return m !== prevM && i < weeks.length - 1 ? MONTHS[m] : "";
  });

  return (
    <div data-reveal className="shell mt-8 [--r:2rem] lg:mt-10">
    <div className="core p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-fg">
            <GitHubIcon size={18} /> GitHub activity
          </h3>
          <p className="mt-1 text-sm text-fg-3">Public contributions over the last 12 months.</p>
        </div>
        <dl className="flex gap-6 sm:gap-8">
          {[
            ["Contributions", github.total],
            ["Active days", github.activeDays],
            ["Public repos", github.publicRepos],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[10px] tracking-wider text-muted uppercase">{label}</dt>
              <dd className="mt-0.5 text-2xl font-semibold tabular-nums text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div ref={scrollRef} className="mt-6 overflow-x-auto pb-2">
        <div
          role="img"
          aria-label={`GitHub contribution calendar: ${github.total} contributions on ${github.activeDays} days in the last year.`}
          className="grid w-full min-w-[620px] gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
        >
          {monthLabels.map((m, i) => (
            <span key={`m${i}`} aria-hidden="true" className="h-4 overflow-visible font-mono text-[10px] whitespace-nowrap text-muted" style={{ gridRow: 1, gridColumn: i + 1 }}>
              {m}
            </span>
          ))}
          {weeks.map((w, wi) =>
            w.map((d, di) =>
              d ? (
                <span
                  key={d[0]}
                  title={`${d[1] || "No"} contribution${d[1] === 1 ? "" : "s"} on ${formatDay(d[0])}`}
                  className={`aspect-square w-full rounded-[3px] ${LEVEL_CLASS[d[2]] ?? LEVEL_CLASS[0]}`}
                  style={{ gridRow: di + 2, gridColumn: wi + 1 }}
                />
              ) : null,
            ),
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <a href={profile.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 text-fg-2 transition-colors hover:text-fg">
          github.com/{profile.githubHandle} <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span>Less</span>
          {LEVEL_CLASS.map((c) => (
            <span key={c} className={`size-[11px] rounded-[3px] ${c}`} />
          ))}
          <span>More</span>
        </div>
        <span className="font-mono text-[10px]">Snapshot · {fetched}</span>
      </div>
    </div>
    </div>
  );
}
