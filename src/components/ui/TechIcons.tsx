import type { CSSProperties } from "react";
import { tech } from "../../data/tech";
import { TechLogo } from "./TechLogo";

/** Row of logo-only badges. The name shows in a tooltip on hover and is announced by screen readers; the badges are not Tab stops (they do nothing). */
export function TechIcons({ names, size = 22 }: { names: string[]; size?: number }) {
  const items = names.map((n) => tech(n)).filter((t): t is NonNullable<typeof t> => !!t);
  // React Native shares React's logo; show it once.
  const seen = new Set<string>();
  const unique = items.filter((t) => (seen.has(t.icon) ? false : (seen.add(t.icon), true)));

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Built with">
      {unique.map((t) => (
        <li key={t.name}>
          <span
            role="img"
            aria-label={t.name}
            style={{ "--brand": t.brand } as CSSProperties}
            className="skill-tile has-tip relative grid size-10 place-items-center rounded-xl border border-line bg-tint shadow-soft"
          >
            <TechLogo t={t} size={size} />
            <span className="tip z-30 rounded-lg border border-line-strong bg-bg px-2 py-1 text-[11px] font-medium text-fg shadow-raised">{t.name}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
