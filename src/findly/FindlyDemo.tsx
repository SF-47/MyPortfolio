import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { trackEvent } from "../lib/analytics";
import { useTheme } from "../theme/context";
import { GitHubIcon } from "../components/ui/icons";
import { candidates, lostItem, rules } from "./data";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, RestartIcon } from "./icons";
import { ChatScreen, FilterView, ReportScreen, ReviewView, ScoreView, type Decision, type Msg } from "./screens";

const REPO = "https://github.com/SF-47/findly";

type Note = { text: ReactNode; code?: string };
type Step = { key: string; tab: string; hint: string; title: string; body: string; notes: Note[] };

const steps: Step[] = [
  {
    key: "report",
    tab: "Report",
    hint: "Student",
    title: "A student reports a lost item",
    body: "Karim left his earbuds in the library. He reports them from the mobile app with the details another student would recognize.",
    notes: [
      { text: "Saved as a lost item with status Open, in PostgreSQL through EF Core.", code: "POST /lost-items" },
      { text: "Photos go to Supabase Storage. The database keeps only the URL." },
      { text: "Right after saving, the API starts an n8n workflow with the new item's id." },
    ],
  },
  {
    key: "filter",
    tab: "Filter",
    hint: "Backend",
    title: "The backend narrows the candidates",
    body: "Sending every found report to an AI model would be slow and costly. A database query removes the obvious mismatches first.",
    notes: [
      { text: "n8n asks the API for candidates, using a shared secret header.", code: "GET /n8n/matching/candidates" },
      { text: "Same campus, still open, same category, another student, found within 7 days of the loss." },
      { text: "At most the 20 newest candidates are returned." },
    ],
  },
  {
    key: "score",
    tab: "Score",
    hint: "Gemini",
    title: "Gemini scores what is left",
    body: "n8n sends each pair to Gemini, which returns a percentage, a confidence level and a short reason. Only scores of 70% or more become a match.",
    notes: [
      { text: "Matches are saved as Pending. Nobody is notified yet." },
      { text: "The reasoning is stored with the match, so the admin sees why it was suggested." },
      { text: "Scores and reasoning on this page are sample output written for the demo." },
    ],
  },
  {
    key: "review",
    tab: "Review",
    hint: "Admin",
    title: "An admin makes the final call",
    body: "The AI suggests and a person decides. A university admin compares both reports before any student is contacted.",
    notes: [
      { text: "Admins only see reports from their own university branch." },
      { text: "Confirming sets both reports to Confirmed and sends an Expo push notification to both students.", code: "PATCH /matches/{id}/status" },
      { text: "Rejecting reopens both reports for future matches." },
    ],
  },
  {
    key: "chat",
    tab: "Chat",
    hint: "Students",
    title: "The students arrange the handover",
    body: "Only the two students of a confirmed match can read or send its messages, so nobody has to share a phone number. Either student closes the case once the item is back.",
    notes: [
      { text: "The API checks both students belong to the match. The receiver comes from the match, never from the app.", code: "POST /matches/{id}/messages" },
      { text: "Each message triggers a push notification, and an open chat checks for new messages every few seconds." },
      { text: "Marking it recovered sets the match and both reports to Resolved.", code: "POST /matches/{id}/resolve" },
    ],
  },
];

const startMessages: Msg[] = [
  { from: "system", text: "An admin confirmed this match. You can chat now." },
  { from: "lea", text: "Hi Karim, I think I found your case in study room B." },
  { from: "karim", text: "That sounds like mine! Is there a scratch near the hinge?" },
  { from: "lea", text: "Yes, right by the hinge. I can leave it at the library desk." },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function FindlyDemo() {
  const reduced = useReducedMotion();
  const { theme, toggle } = useTheme();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [applied, setApplied] = useState(0);
  const [scored, setScored] = useState(0);
  const [running, setRunning] = useState(false);
  const [decision, setDecision] = useState<Decision>(null);
  const [messages, setMessages] = useState<Msg[]>(startMessages);
  const [resolved, setResolved] = useState(false);
  const [status, setStatus] = useState("");

  const timers = useRef<number[]>([]);
  const replied = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  /** Counts `set` up to `to`, one tick every `ms` (instantly with reduced motion). */
  const playTo = (set: (n: number) => void, to: number, ms: number, done: string) => {
    clearTimers();
    if (reduced) {
      set(to);
      setStatus(done);
      return;
    }
    setRunning(true);
    for (let i = 1; i <= to; i++) {
      timers.current.push(
        window.setTimeout(() => {
          set(i);
          if (i === to) {
            setRunning(false);
            setStatus(done);
          }
        }, i * ms),
      );
    }
  };

  const goTo = (n: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, n));
    clearTimers();
    // Jumping ahead finishes the steps that come before, so every screen has its inputs.
    if (next >= 1) setSubmitted(true);
    if (next >= 2) setApplied(rules.length);
    if (next >= 3) setScored(candidates.length);
    setStep(next);
    setStatus(`${steps[next].tab}: ${steps[next].title}`);
    trackEvent("Findly demo", { step: steps[next].key });
  };

  const restart = () => {
    clearTimers();
    setSubmitted(false);
    setApplied(0);
    setScored(0);
    setDecision(null);
    setMessages(startMessages);
    setResolved(false);
    replied.current = false;
    setStep(0);
    setStatus("Walkthrough restarted.");
    tabRefs.current[0]?.focus();
  };

  const onTabKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowRight: step + 1, ArrowLeft: step - 1, Home: 0, End: steps.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const n = (map[e.key] + steps.length) % steps.length;
    goTo(n);
    tabRefs.current[n]?.focus();
  };

  const send = (text: string) => {
    setMessages((m) => [...m, { from: "karim", text }]);
    if (replied.current) return;
    replied.current = true;
    timers.current.push(
      window.setTimeout(() => setMessages((m) => [...m, { from: "lea", text: "Great, it's at the desk now. Ask for the lost and found shelf." }]), reduced ? 0 : 1200),
    );
  };

  const resolve = () => {
    setResolved(true);
    setMessages((m) => [...m, { from: "system", text: "Karim marked the item as recovered. Both reports are resolved." }]);
    setStatus("Match resolved.");
  };

  const decide = (d: Decision) => {
    setDecision(d);
    setStatus(d ? `Match ${d.toLowerCase()}.` : "Decision undone. The match is pending again.");
  };

  const s = steps[step];
  const done = [submitted, applied >= rules.length, scored >= candidates.length, decision !== null, resolved];
  const last = step === steps.length - 1;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-3 py-5">
        <a
          href="/#projects"
          className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-2 text-sm text-fg-3 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowLeftIcon className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to portfolio
        </a>
        <div className="flex items-center gap-2">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            aria-label="Findly source on GitHub (opens in a new tab)"
            className="grid size-9 place-items-center rounded-full border border-line-strong text-fg-2 transition-colors hover:bg-tint hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <GitHubIcon size={16} />
          </a>
          <button
            type="button"
            onClick={toggle}
            className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:bg-tint hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </header>

      <section className="rise-in pt-6 pb-8 sm:pt-10">
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Findly walkthrough</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl">Follow one lost item back to its owner</h1>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed text-fg-3">
          Five steps through Findly's matching flow, from a student's report to a private chat. Everything runs in your browser on sample data.
        </p>
      </section>

      <div
        role="tablist"
        aria-label="Walkthrough steps"
        onKeyDown={onTabKey}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0"
      >
        {steps.map((t, i) => {
          const current = i === step;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${t.key}`}
              type="button"
              role="tab"
              aria-selected={current}
              aria-controls="step-panel"
              tabIndex={current ? 0 : -1}
              onClick={() => goTo(i)}
              className={`flex min-w-[132px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-[background-color,border-color,transform] duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:min-w-0 ${
                current ? "border-accent/60 bg-accent/10" : "border-line bg-tint hover:border-line-strong"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors duration-300 ${
                  done[i] ? "bg-accent text-white" : current ? "border border-accent text-accent" : "border border-line-strong text-muted"
                }`}
              >
                {done[i] ? <CheckIcon size={13} /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-semibold ${current ? "text-fg" : "text-fg-2"}`}>{t.tab}</span>
                <span className="block truncate text-xs text-muted">{t.hint}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="step-panel"
        role="tabpanel"
        aria-labelledby={`tab-${s.key}`}
        className="mt-4 grid gap-6 rounded-3xl border border-line bg-surface p-4 shadow-raised sm:p-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10 lg:p-8"
      >
        <div key={s.key} className="rise-in grid min-h-[420px] place-items-center rounded-2xl bg-media/60 p-3 sm:p-6">
          <div className="w-full">
            {s.key === "report" && (
              <ReportScreen
                submitted={submitted}
                onSubmit={() => {
                  setSubmitted(true);
                  setStatus(`Report submitted. ${lostItem.name} is open.`);
                }}
              />
            )}
            {s.key === "filter" && (
              <FilterView
                applied={applied}
                running={running}
                onRun={() => playTo(setApplied, rules.length, 650, `${candidates.length} candidates left after the filters.`)}
                onReset={() => {
                  clearTimers();
                  setApplied(0);
                }}
              />
            )}
            {s.key === "score" && (
              <ScoreView scored={scored} running={running} onRun={() => playTo(setScored, candidates.length, 1100, "Scoring done. One match saved as pending.")} />
            )}
            {s.key === "review" && <ReviewView decision={decision} onDecide={decide} />}
            {s.key === "chat" && (
              <ChatScreen decision={decision} messages={messages} resolved={resolved} onSend={send} onResolve={resolve} onBackToReview={() => goTo(3)} />
            )}
          </div>
        </div>

        <div key={`${s.key}-text`} className="rise-in flex flex-col" style={{ ["--d" as string]: "80ms" }}>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">{s.title}</h2>
          <p className="mt-3 leading-relaxed text-fg-3">{s.body}</p>

          <h3 className="mt-7 text-sm font-semibold text-fg">Under the hood</h3>
          <ul className="mt-3 space-y-3">
            {s.notes.map((n, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-fg-3">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  {n.text}
                  {n.code && <code className="mt-1.5 block w-fit rounded-md border border-line bg-tint px-2 py-0.5 font-mono text-[11px] break-all text-fg-2">{n.code}</code>}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center justify-between gap-3 pt-8">
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-medium text-fg transition-[transform,background-color,opacity] duration-300 hover:bg-tint active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ArrowLeftIcon />
              Back
            </button>
            <button
              type="button"
              onClick={() => (last ? restart() : goTo(step + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-btn px-5 py-2.5 text-sm font-medium text-btn-fg shadow-raised transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-float active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {last ? (
                <>
                  <RestartIcon />
                  Start over
                </>
              ) : (
                <>
                  Next: {steps[step + 1].tab}
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        People, items, scores and messages on this page are sample data. The filter rules and endpoints match the real{" "}
        <a href={REPO} target="_blank" rel="noreferrer" className="text-fg-2 underline underline-offset-4 hover:text-fg">
          Findly source
        </a>
        .
      </p>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
