type P = { size?: number; className?: string };

export function GitHubIcon({ size = 20, className = "" }: P) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current [mask:url(/skills/github.svg)_center/contain_no-repeat] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function LinkedInIcon({ size = 19, className = "" }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="2.5" y="9" width="4" height="12.5" rx="0.6" />
      <circle cx="4.5" cy="4.6" r="2.3" />
      <path d="M9.5 9h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.4 0 4.2 2.2 4.2 5.2v7.6h-4v-6.7c0-1.6-.3-2.9-1.9-2.9s-2.1 1.3-2.1 2.9v6.7h-4z" />
    </svg>
  );
}

export function MailIcon({ size = 19, className = "" }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PinIcon({ size = 14, className = "" }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function FileIcon({ size = 18, className = "" }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function ArrowUpRight({ size = 12, className = "" }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 12 12" className={className}>
      <path d="M3.5 8.5 8.5 3.5M4 3.5h4.5V8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
