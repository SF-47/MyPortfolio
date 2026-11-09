/** Line icons for the walkthrough, drawn in the same style as components/ui/icons.tsx. */
type P = { size?: number; className?: string };

const base = (size: number, className: string) => ({
  "aria-hidden": true as const,
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export const CheckIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const XIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowRightIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const SparkIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8z" />
  </svg>
);

export const SendIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 12 20 4l-6 16-3-7z" />
  </svg>
);

export const BellIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5h4" />
  </svg>
);

export const RestartIcon = ({ size = 14, className = "" }: P) => (
  <svg {...base(size, className)}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
  </svg>
);
