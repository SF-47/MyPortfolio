import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { AdminWindow, Phone, Tag } from "./devices";
import { candidates, foundPool, formatDate, lostItem, removedBy, rules, scores, THRESHOLD, type Item } from "./data";
import { BellIcon, CheckIcon, SendIcon, SparkIcon, XIcon } from "./icons";

export type Decision = "Confirmed" | "Rejected" | null;
export type Msg = { from: "karim" | "lea" | "system"; text: string };

const appBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-[transform,background-color,opacity] duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd] disabled:cursor-not-allowed disabled:opacity-50";

/* ---------- Report ---------- */

function Field({ label, value, tall }: { label: string; value: string; tall?: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-white/70">{label}</p>
      <p className={`rounded-xl bg-white/[0.05] px-3 py-2 text-white/90 ${tall ? "leading-snug" : "truncate"}`}>{value}</p>
    </div>
  );
}

export function ReportScreen({ submitted, onSubmit }: { submitted: boolean; onSubmit: () => void }) {
  return (
    <Phone label="Findly mobile app, Karim's phone">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 [scrollbar-width:none]">
        <h3 className="text-lg font-semibold text-white">Report item</h3>
        {!submitted ? (
          <>
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1 text-center text-[12px] font-medium" aria-hidden="true">
              <span className="rounded-lg bg-rose-500/20 py-1.5 text-rose-200">Lost</span>
              <span className="py-1.5 text-white/50">Found</span>
            </div>
            <div className="mt-3 space-y-2.5 rounded-2xl border border-white/[0.06] bg-[#17181c] p-3">
              <Field label="Item name" value={lostItem.name} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Category" value={lostItem.category} />
                <Field label="Color" value={lostItem.color} />
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Field label="Location" value={lostItem.location} />
                <Field label="Lost date" value={formatDate(lostItem.date)} />
              </div>
              <Field label="Description" value={lostItem.description} tall />
            </div>
            <button type="button" onClick={onSubmit} className={`${appBtn} mt-3 w-full bg-[#3b82f6] text-white hover:bg-[#2f74e6]`}>
              <SendIcon />
              Submit report
            </button>
          </>
        ) : (
          <div className="rise-in mt-4 space-y-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                <CheckIcon size={18} />
              </span>
              <p className="mt-3 font-semibold text-white">Report submitted</p>
              <p className="mt-1 text-white/70">We'll notify you if an admin confirms a match.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#17181c] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium text-white">{lostItem.name}</p>
                <Tag tone="blue">Open</Tag>
              </div>
              <p className="mt-1 text-white/60">
                {lostItem.location}, {formatDate(lostItem.date)}
              </p>
            </div>
          </div>
        )}
      </div>
    </Phone>
  );
}

/* ---------- Filter ---------- */

export function FilterView({ applied, running, onRun, onReset }: { applied: number; running: boolean; onRun: () => void; onReset: () => void }) {
  const remaining = foundPool.filter((f) => removedBy(f, applied) === -1).length;
  const done = applied >= rules.length;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111317] p-4 text-[13px] text-[#e5e7eb] shadow-float sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-white">Open found reports</p>
        <p className="font-mono text-[12px] text-white/60" aria-hidden="true">
          {foundPool.length} reports, <span className="text-white">{remaining} left</span>
        </p>
      </div>

      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Filters">
        {rules.map((r, i) => {
          const on = i < applied;
          const cut = foundPool.filter((f) => removedBy(f, applied) === i).length;
          return (
            <li
              key={r.label}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition-colors duration-300 ${
                on ? "border-[#3b82f6]/50 bg-[#3b82f6]/15 text-[#bfdbfe]" : "border-white/10 text-white/50"
              }`}
            >
              {on && <CheckIcon size={12} />}
              {r.label}
              {on && cut > 0 && <span className="font-mono text-[11px] text-white/60">-{cut}</span>}
              <span className="sr-only">{on ? `, applied, removed ${cut}` : ", not applied yet"}</span>
            </li>
          );
        })}
      </ol>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {foundPool.map((f) => {
          const by = removedBy(f, applied);
          const out = by !== -1;
          const kept = done && !out;
          return (
            <li
              key={f.id}
              className={`rounded-xl border px-3 py-2.5 transition-[opacity,border-color,background-color] duration-500 ${
                out ? "border-white/[0.04] opacity-40" : kept ? "border-[#3b82f6]/50 bg-[#3b82f6]/[0.08]" : "border-white/[0.07] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={`font-medium text-white ${out ? "line-through decoration-white/40" : ""}`}>{f.name}</p>
                <span className="shrink-0 font-mono text-[11px] text-white/55">{formatDate(f.date)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="truncate text-[12px] text-white/55">
                  {f.category}, {f.location}
                </p>
                {out && <Tag tone="muted">{rules[by].reason}</Tag>}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!done ? (
          <button type="button" onClick={onRun} disabled={running} className={`${appBtn} bg-[#3b82f6] text-white hover:bg-[#2f74e6]`}>
            {running ? "Filtering…" : "Run filters"}
          </button>
        ) : (
          <>
            <p className="text-white/80">
              <span className="font-semibold text-white">{candidates.length} candidates</span> go to the AI step.
            </p>
            <button type="button" onClick={onReset} className="text-[12px] text-white/60 underline-offset-4 hover:text-white hover:underline">
              Replay
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Score ---------- */

export function ScoreView({ scored, running, onRun }: { scored: number; running: boolean; onRun: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111317] p-4 text-[13px] text-[#e5e7eb] shadow-float sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-white">Comparing with {lostItem.name}</p>
        <p className="font-mono text-[12px] text-white/60">threshold {THRESHOLD}%</p>
      </div>

      <ul className="mt-4 space-y-2.5">
        {candidates.map((c, i) => {
          const s = scores[c.id];
          const shown = i < scored;
          const pass = s.percent >= THRESHOLD;
          return (
            <li key={c.id} className={`rounded-xl border p-3 transition-colors duration-500 ${shown && pass ? "border-emerald-400/30 bg-emerald-500/[0.06]" : "border-white/[0.07] bg-white/[0.02]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="truncate text-[12px] text-white/55">
                    {c.location}, {formatDate(c.date)}
                  </p>
                </div>
                {shown ? (
                  <div className="rise-in shrink-0 text-right">
                    <p className={`font-mono text-2xl leading-none ${pass ? "text-emerald-300" : "text-white/80"}`}>{s.percent}%</p>
                    <p className="mt-1 text-[11px] text-white/55">{s.confidence} confidence</p>
                  </div>
                ) : (
                  <div aria-hidden="true" className="h-9 w-14 shrink-0 rounded-lg bg-white/[0.06] motion-safe:animate-pulse" />
                )}
              </div>
              {shown ? (
                <div className="rise-in">
                  <p className="mt-2 leading-relaxed text-white/75">{s.reasoning}</p>
                  <p className={`mt-2 flex items-center gap-1.5 text-[12px] font-medium ${pass ? "text-emerald-300" : "text-white/50"}`}>
                    {pass ? <CheckIcon size={13} /> : <XIcon size={13} />}
                    {pass ? "Saved as a pending match" : `Below ${THRESHOLD}%, not saved`}
                  </p>
                </div>
              ) : (
                running &&
                i === scored && (
                  <div aria-hidden="true" className="mt-3 space-y-1.5">
                    <div className="h-2.5 w-11/12 rounded bg-white/[0.06] motion-safe:animate-pulse" />
                    <div className="h-2.5 w-2/3 rounded bg-white/[0.06] motion-safe:animate-pulse" />
                  </div>
                )
              )}
            </li>
          );
        })}
      </ul>

      {scored === 0 && (
        <button type="button" onClick={onRun} disabled={running} className={`${appBtn} mt-4 bg-[#3b82f6] text-white hover:bg-[#2f74e6]`}>
          <SparkIcon />
          {running ? "Asking Gemini…" : "Ask Gemini"}
        </button>
      )}
    </div>
  );
}

/* ---------- Review ---------- */

function ReportCard({ kind, item }: { kind: "Lost" | "Found"; item: Item }) {
  const rows: [string, string][] = [
    ["Reporter", item.reporter],
    ["Category", item.category],
    ["Color", item.color],
    ["Location", item.location],
    [kind === "Lost" ? "Lost date" : "Found date", formatDate(item.date)],
  ];
  return (
    <div className={`rounded-xl border p-3 ${kind === "Lost" ? "border-rose-400/15 bg-rose-500/[0.05]" : "border-emerald-400/15 bg-emerald-500/[0.05]"}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate font-semibold text-white">{item.name}</p>
        <Tag tone={kind === "Lost" ? "red" : "green"}>{kind}</Tag>
      </div>
      <dl className="mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-white/50">{k}</dt>
            <dd className="truncate text-white/85">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2.5 text-[12px] leading-relaxed text-white/70">{item.description}</p>
    </div>
  );
}

export function ReviewView({ decision, onDecide }: { decision: Decision; onDecide: (d: Decision) => void }) {
  const found = candidates[0];
  const s = scores[found.id];
  return (
    <AdminWindow url="findly admin / matches / pending">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[15px] font-semibold text-white">Match comparison</p>
          <Tag tone={decision === "Confirmed" ? "green" : decision === "Rejected" ? "red" : "amber"}>{decision ?? "Pending"}</Tag>
        </div>

        <div className="mt-3 grid gap-2.5 sm:grid-cols-[auto_1fr]">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <p className="text-[11px] text-white/50">Match accuracy</p>
            <p className="mt-1 font-mono text-3xl leading-none text-[#93c5fd]">{s.percent}%</p>
            <p className="mt-1.5 text-[11px] text-white/55">{s.confidence} confidence</p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] text-[#93c5fd]">
              <SparkIcon size={12} />
              AI reasoning
            </p>
            <p className="mt-1.5 leading-relaxed text-white/80">{s.reasoning}</p>
          </div>
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          <ReportCard kind="Lost" item={lostItem} />
          <ReportCard kind="Found" item={found} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-white/[0.06] pt-4">
          {decision ? (
            <>
              <p className="mr-auto text-[12px] text-white/70">
                {decision === "Confirmed" ? "Both reports set to Confirmed. Karim and Lea were notified." : "Both reports are open again for future matches."}
              </p>
              <button type="button" onClick={() => onDecide(null)} className={`${appBtn} border border-white/15 text-white/80 hover:bg-white/[0.06]`}>
                Undo
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => onDecide("Rejected")} className={`${appBtn} border border-rose-400/30 text-rose-200 hover:bg-rose-500/10`}>
                <XIcon />
                Reject
              </button>
              <button type="button" onClick={() => onDecide("Confirmed")} className={`${appBtn} bg-emerald-600 text-white hover:bg-emerald-500`}>
                <CheckIcon />
                Confirm match
              </button>
            </>
          )}
        </div>
      </div>
    </AdminWindow>
  );
}

/* ---------- Chat ---------- */

export function ChatScreen({
  decision,
  messages,
  resolved,
  onSend,
  onResolve,
  onBackToReview,
}: {
  decision: Decision;
  messages: Msg[];
  resolved: boolean;
  onSend: (text: string) => void;
  onResolve: () => void;
  onBackToReview: () => void;
}) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const l = listRef.current;
    if (l) l.scrollTop = l.scrollHeight;
  }, [messages.length]);

  if (decision !== "Confirmed") {
    return (
      <Phone label="Findly mobile app, Karim's phone">
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-white/[0.06] text-white/60">
            <BellIcon size={20} />
          </span>
          <p className="mt-3 font-semibold text-white">No chat yet</p>
          <p className="mt-1 leading-relaxed text-white/65">
            {decision === "Rejected" ? "The admin rejected this match, so Karim and Lea were never connected." : "Chats open after an admin confirms the match."}
          </p>
          <button type="button" onClick={onBackToReview} className={`${appBtn} mt-4 bg-[#3b82f6] text-white hover:bg-[#2f74e6]`}>
            Go to review
          </button>
        </div>
      </Phone>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  return (
    <Phone label="Findly mobile app, Karim's chat with Lea">
      <div className="rise-in mx-2 mb-1 flex items-start gap-2 rounded-2xl border border-white/10 bg-[#1f2126]/95 p-2.5" role="note">
        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#3b82f6] text-white">
          <BellIcon size={14} />
        </span>
        <div className="min-w-0 text-[12px]">
          <p className="font-semibold text-white">Match confirmed</p>
          <p className="truncate text-white/65">Someone may have found your {lostItem.name}.</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">{candidates[0].reporter}</p>
          <p className="truncate text-[11px] text-white/55">{lostItem.name}</p>
        </div>
        {resolved ? <Tag tone="green">Resolved</Tag> : <Tag tone="blue">Confirmed</Tag>}
      </div>

      <ol ref={listRef} aria-label="Messages" aria-live="polite" className="flex-1 space-y-2 overflow-y-auto px-3 py-3 [scrollbar-width:none]">
        {messages.map((m, i) =>
          m.from === "system" ? (
            <li key={i} className="rise-in px-2 text-center text-[11px] text-white/50">
              {m.text}
            </li>
          ) : (
            <li
              key={i}
              className={`rise-in max-w-[82%] rounded-2xl px-3 py-2 leading-snug ${
                m.from === "karim" ? "ml-auto rounded-br-md bg-[#3b82f6] text-white" : "rounded-bl-md bg-white/[0.07] text-white/90"
              }`}
              style={{ "--d": `${Math.min(i, 4) * 120}ms` } as CSSProperties}
            >
              <span className="sr-only">{m.from === "karim" ? "Karim: " : "Lea: "}</span>
              {m.text}
            </li>
          ),
        )}
      </ol>

      {resolved ? (
        <p className="border-t border-white/[0.06] px-4 py-3 text-center text-[12px] text-white/60">This report is closed.</p>
      ) : (
        <div className="space-y-2 border-t border-white/[0.06] p-2.5">
          <button type="button" onClick={onResolve} className={`${appBtn} w-full border border-emerald-400/30 py-2 text-emerald-200 hover:bg-emerald-500/10`}>
            <CheckIcon />
            Mark as recovered
          </button>
          <form onSubmit={submit} className="flex items-center gap-2">
            <label htmlFor="chat-draft" className="sr-only">
              Message Lea
            </label>
            <input
              id="chat-draft"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={200}
              autoComplete="off"
              placeholder="Message"
              className="min-w-0 flex-1 rounded-xl bg-white/[0.07] px-3 py-2 text-[13px] text-white placeholder:text-white/50 focus-visible:outline-2 focus-visible:outline-[#93c5fd]"
            />
            <button type="submit" aria-label="Send" disabled={!draft.trim()} className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#3b82f6] text-white transition-[transform,background-color,opacity] duration-200 hover:bg-[#2f74e6] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd] disabled:cursor-not-allowed disabled:opacity-50">
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </Phone>
  );
}
