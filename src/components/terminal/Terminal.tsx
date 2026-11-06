import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile } from "../../data/profile";
import { trackEvent } from "../../lib/analytics";
import { useTheme } from "../../theme/context";
import { commandNames, findCommand, type Ctx } from "./commands";
import { Run } from "./Run";

type Entry = { id: number; input?: string; output: ReactNode };

const PROMPT_USER = "visitor";
const PROMPT_HOST = "sami";
const HISTORY_KEY = "sf-term-history";
const CHIPS = ["help", "about", "projects", "skills", "github", "contact", "cv", "exit"];

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-[#86efac]">{PROMPT_USER}</span>
      <span className="text-white/40">@</span>
      <span className="text-[#60a5fa]">{PROMPT_HOST}</span>
      <span className="text-white/40">:</span>
      <span className="text-[#c4b5fd]">~</span>
      <span className="text-white/40">$&nbsp;</span>
    </span>
  );
}

function Welcome() {
  return (
    <div className="space-y-2">
      <pre aria-hidden="true" className="text-[10px] leading-[1.15] text-[#2ad1d6] sm:text-xs">{String.raw`  ___ ___
 / __| __|   sami-os v1.0
 \__ \ _|    ${profile.role}
 |___/_|     ${profile.location}`}</pre>
      <p>
        Welcome. Type <Run cmd="help" /> to see commands, or try <Run cmd="projects" />, <Run cmd="about" />, <Run cmd="contact" />.
      </p>
    </div>
  );
}

function loadHistory(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function Terminal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, toggle } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, output: <Welcome /> }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [cursor, setCursor] = useState<number | null>(null); // index into history while browsing
  const [hint, setHint] = useState<string[]>([]);

  // open / close the native dialog
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      window.setTimeout(() => inputRef.current?.focus(), 60);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onDialogClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    d.addEventListener("close", onDialogClose);
    return () => d.removeEventListener("close", onDialogClose);
  }, [onClose]);

  // keep the newest output in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, hint]);

  const close = useCallback(() => dialogRef.current?.close(), []);

  const execute = useCallback(
    (raw: string) => {
      const line = raw.trim();
      setHint([]);
      setCursor(null);
      setValue("");
      if (!line) {
        setEntries((e) => [...e, { id: nextId.current++, input: "", output: null }]);
        return;
      }
      const nextHistory = [...history.filter((h) => h !== line), line].slice(-50);
      setHistory(nextHistory);
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      } catch {
        /* history is a nicety */
      }

      const [name, ...args] = line.split(/\s+/);
      const cmd = findCommand(name.toLowerCase());
      trackEvent("Terminal command", { command: cmd ? cmd.name : "unknown" });

      let cleared = false;
      const ctx: Ctx = {
        theme,
        setTheme: (t) => {
          if (t !== theme) toggle();
        },
        close,
        clear: () => {
          cleared = true;
        },
        history: nextHistory,
      };

      const output = cmd ? (
        cmd.run(args, ctx)
      ) : (
        <span className="text-[#fca5a5]">
          command not found: {name} · type <Run cmd="help" />
        </span>
      );
      if (cleared) setEntries([]);
      else setEntries((e) => [...e, { id: nextId.current++, input: line, output }]);
    },
    [close, history, theme, toggle],
  );

  function complete() {
    const parts = value.split(/\s+/);
    if (parts.length <= 1) {
      const matches = commandNames.filter((n) => n.startsWith(parts[0].toLowerCase()) && !findCommand(n)?.hidden);
      if (matches.length === 1) setValue(matches[0] + " ");
      else setHint(matches);
      return;
    }
    const cmd = findCommand(parts[0].toLowerCase());
    const last = parts[parts.length - 1].toLowerCase();
    const matches = (cmd?.args ?? []).filter((a) => a.startsWith(last));
    if (matches.length === 1) setValue([...parts.slice(0, -1), matches[0]].join(" ") + " ");
    else setHint(matches);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === null) return;
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key.toLowerCase() === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      setEntries((x) => [...x, { id: nextId.current++, input: value + "^C", output: null }]);
      setValue("");
    } else if (hint.length) {
      setHint([]);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Terminal"
      className="project-dialog m-auto h-[min(680px,calc(100dvh-1.5rem))] w-[min(920px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-transparent p-0 text-white shadow-float backdrop:bg-transparent"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex h-full flex-col bg-[#07090d] font-mono text-[13px] leading-relaxed text-white/85 sm:text-sm">
        {/* title bar */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
          <div className="flex gap-1.5">
            <button type="button" aria-label="Close terminal" onClick={close} className="group/dot grid size-3 place-items-center rounded-full bg-[#ff5f57]">
              <svg aria-hidden="true" width="6" height="6" viewBox="0 0 6 6" className="opacity-0 group-hover/dot:opacity-100" stroke="#5a0000" strokeWidth="1.2">
                <path d="M1 1l4 4M5 1 1 5" />
              </svg>
            </button>
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <p className="flex-1 truncate text-center text-xs text-white/45">
            {PROMPT_USER}@{PROMPT_HOST}: ~ — sami-os
          </p>
          <span className="hidden text-[11px] text-white/30 sm:inline">esc to close</span>
        </div>

        {/* output */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin] sm:px-6"
          onClick={(e) => {
            const run = (e.target as HTMLElement).closest<HTMLElement>("[data-run]")?.dataset.run;
            if (run) execute(run);
            else if (!window.getSelection()?.toString()) inputRef.current?.focus();
          }}
          aria-live="polite"
        >
          {entries.map((en) => (
            <div key={en.id} className="term-line mb-2.5">
              {en.input !== undefined && (
                <div className="flex flex-wrap">
                  <Prompt />
                  <span className="break-all text-white">{en.input}</span>
                </div>
              )}
              {en.output && <div className="mt-0.5 break-words">{en.output}</div>}
            </div>
          ))}

          {/* input line */}
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              execute(value);
            }}
          >
            <label htmlFor="term-input" className="contents">
              <Prompt />
              <span className="sr-only">Command</span>
            </label>
            <input
              id="term-input"
              ref={inputRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setCursor(null);
              }}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              className="min-w-0 flex-1 bg-transparent text-white caret-[#86efac] outline-none"
            />
          </form>
          {hint.length > 0 && <div className="mt-1 text-white/50">{hint.join("   ")}</div>}
        </div>

        {/* quick commands: essential on touch screens, handy everywhere */}
        <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-white/[0.07] px-3 py-2.5 [scrollbar-width:none]">
          {CHIPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                execute(c);
                inputRef.current?.focus({ preventScroll: true });
              }}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 transition-[background-color,color,transform] duration-200 hover:bg-white/10 hover:text-white active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}

