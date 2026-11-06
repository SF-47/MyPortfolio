import { profile } from "../../data/profile";

/**
 * Two-part status badge in the style of a README build badge: a neutral "status" label
 * next to the value. Renders as a link when given an href.
 */
export function StatusBadge({ href, className = "" }: { href?: string; className?: string }) {
  const body = (
    <>
      <span className="bg-fg/[0.07] px-2 py-[5px] text-fg-3">status</span>
      <span className="bg-emerald-500/15 px-2 py-[5px] text-emerald-700 dark:text-emerald-300">{profile.status.toLowerCase()}</span>
    </>
  );
  const cls = `inline-flex overflow-hidden rounded-[5px] font-mono text-[11px] leading-none ring-1 ring-line-strong ${className}`;
  return href ? (
    <a href={href} className={`${cls} transition-[box-shadow] duration-300 hover:ring-emerald-500/50`} aria-label={`Status: ${profile.status}. Go to contact`}>
      {body}
    </a>
  ) : (
    <span className={cls} aria-label={`Status: ${profile.status}`}>
      {body}
    </span>
  );
}
