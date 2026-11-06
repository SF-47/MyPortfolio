import type { Tech } from "../../data/tech";

export function TechLogo({ t, size = 36, className = "" }: { t: Tech; size?: number; className?: string }) {
  const src = `/skills/${t.icon}.svg`;
  if (t.mono) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: t.color ?? "var(--fg)",
          mask: `url(${src}) center / contain no-repeat`,
          WebkitMask: `url(${src}) center / contain no-repeat`,
        }}
      />
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`shrink-0 ${t.invertOnDark ? "dark:invert" : ""} ${t.brightenOnDark ? "dark:brightness-[1.8]" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
