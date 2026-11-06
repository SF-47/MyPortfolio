import { profile } from "../../data/profile";

/** Availability as plain mono text in green: no chip, no dot. */
export function StatusBadge({ href, className = "" }: { href?: string; className?: string }) {
  const cls = `font-mono text-xs tracking-wider uppercase text-emerald-700 dark:text-emerald-400 ${className}`;
  return href ? (
    <a href={href} className={`${cls} underline-offset-4 transition-colors hover:underline`}>
      {profile.status}
    </a>
  ) : (
    <span className={cls}>{profile.status}</span>
  );
}
