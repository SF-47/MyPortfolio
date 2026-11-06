import type { ReactNode } from "react";

export type Shot = { src: string; srcSmall?: string; alt: string; width: number; height: number };

function Img({ shot, sizes, eager }: { shot: Shot; sizes: string; eager?: boolean }) {
  return (
    <img
      src={shot.src}
      srcSet={shot.srcSmall ? `${shot.srcSmall} 800w, ${shot.src} ${shot.width}w` : undefined}
      sizes={shot.srcSmall ? sizes : undefined}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className="block h-full w-full object-cover object-top"
    />
  );
}

/** Desktop screenshot in a minimal browser window. */
export function BrowserFrame({ shot, sizes = "(min-width: 1024px) 700px, 100vw", className = "", url, eager }: { shot: Shot; sizes?: string; className?: string; url?: string; eager?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#111317] shadow-float ${className}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] bg-[#16181d] px-3">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        {url && <span className="ml-3 truncate rounded bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] text-white/40">{url}</span>}
      </div>
      <div className="aspect-[16/10]">
        <Img shot={shot} sizes={sizes} eager={eager} />
      </div>
    </div>
  );
}

/** Phone screenshot in a rounded device bezel. */
export function PhoneFrame({ shot, className = "", eager }: { shot: Shot; className?: string; eager?: boolean }) {
  return (
    <div className={`rounded-[1.6rem] border border-white/15 bg-[#0c0d10] p-[5px] shadow-float ${className}`}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.3rem] bg-black">
        <Img shot={shot} sizes="260px" eager={eager} />
      </div>
    </div>
  );
}

export function Stage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative isolate overflow-hidden ${className}`}>{children}</div>;
}
