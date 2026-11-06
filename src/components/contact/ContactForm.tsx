import { useId, useState, type FormEvent } from "react";
import { profile } from "../../data/profile";
import { trackEvent } from "../../lib/analytics";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY?.trim();

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const field =
  "peer w-full rounded-2xl border border-line bg-tint px-4 pt-6 pb-2.5 text-[15px] text-fg outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent hover:border-line-strong focus:border-accent/60 focus:bg-surface focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_15%,transparent)]";
const floatLabel =
  "pointer-events-none absolute top-4 left-4 origin-left text-[15px] text-muted transition-all duration-300 ease-[var(--ease-out-expo)] peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // honeypot filled: silently ignore
    if (!ACCESS_KEY) {
      setStatus({ kind: "error", message: "The form isn't connected yet." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio: ${String(data.get("subject") || "New message")}`,
          from_name: "sami-farhat portfolio",
          name: data.get("name"),
          email: data.get("email"),
          replyto: data.get("email"),
          message: data.get("message"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
      form.reset();
      setStatus({ kind: "sent" });
      trackEvent("Contact sent");
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rise-in flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30">
          <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" className="[stroke-dasharray:24] [stroke-dashoffset:24] motion-safe:animate-[draw_0.6s_0.2s_var(--ease-out-expo)_forwards] motion-reduce:[stroke-dashoffset:0]" />
          </svg>
        </span>
        <p className="text-xl font-semibold text-fg">Message sent</p>
        <p className="max-w-xs text-sm text-fg-3">Thanks for reaching out. I&apos;ll reply to the email you gave as soon as I can.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-2 text-sm text-accent hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={onSubmit} noValidate={false} className="grid gap-3 p-5 sm:p-7" aria-describedby={`${id}-note`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <input id={`${id}-name`} name="name" required autoComplete="name" maxLength={100} placeholder="Name" className={field} />
          <label htmlFor={`${id}-name`} className={floatLabel}>
            Your name
          </label>
        </div>
        <div className="relative">
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" maxLength={254} placeholder="Email" className={field} />
          <label htmlFor={`${id}-email`} className={floatLabel}>
            Email address
          </label>
        </div>
      </div>
      <div className="relative">
        <input id={`${id}-subject`} name="subject" maxLength={120} placeholder="Subject" className={field} />
        <label htmlFor={`${id}-subject`} className={floatLabel}>
          Subject <span className="text-muted/70">(optional)</span>
        </label>
      </div>
      <div className="relative">
        <textarea id={`${id}-message`} name="message" required rows={5} maxLength={4000} placeholder="Message" className={`${field} resize-y`} />
        <label htmlFor={`${id}-message`} className={floatLabel}>
          Message
        </label>
      </div>

      {/* honeypot: hidden from people, tempting for bots */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p id={`${id}-note`} className="text-xs text-muted" aria-live="polite">
          {status.kind === "error" ? (
            <span className="text-red-500">
              {status.message} Email me at{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </span>
          ) : ACCESS_KEY ? (
            "Goes straight to my inbox."
          ) : (
            <>
              Form not connected yet: email{" "}
              <a className="underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={sending}
          className="group/send inline-flex items-center gap-3 rounded-full bg-btn py-1.5 pr-1.5 pl-5 text-sm font-medium text-btn-fg shadow-raised transition-[transform,box-shadow,opacity] duration-500 ease-[var(--ease-out-expo)] hover:shadow-float active:scale-[0.98] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {sending ? "Sending…" : "Send message"}
          <span className="grid size-9 place-items-center rounded-full bg-btn-fg/10 transition-transform duration-500 ease-[var(--ease-spring)] group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 group-hover/send:scale-105">
            {sending ? (
              <span aria-hidden="true" className="size-4 rounded-full border-2 border-btn-fg/30 border-t-btn-fg motion-safe:animate-spin" />
            ) : (
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
