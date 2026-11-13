export type ExperienceLink = {
  label: string;
  href: string;
  /** opens in a new tab */
  external?: boolean;
};

export type Experience = {
  id: string;
  kind: "Internship" | "Freelance";
  role: string;
  org: string;
  place: string;
  period: string;
  summary: string;
  /** printed under the links, e.g. a certificate credential */
  credentialId?: string;
  links: ExperienceLink[];
  featured?: boolean;
};

/** Newest first. Everything here is also on the CV, so keep the two in step. */
export const experience: Experience[] = [
  {
    id: "violet-pro",
    kind: "Internship",
    role: "Software Development Intern",
    org: "Violet Pro",
    place: "Tyre, Lebanon",
    period: "Sep – Nov 2026",
    summary:
      "Built Flexible Portfolio, a configurable company website with an admin dashboard (ASP.NET Core, Next.js, MySQL), and a personal training (PT) system. Also researched a virtual try-on feature for e-commerce and rebuilt the Hillside portfolio with a framework.",
    links: [
      { label: "View certificate (PDF)", href: "/violetpro-internship-certificate.pdf", external: true },
    ],
    featured: true,
  },
  {
    id: "shawarma-story",
    kind: "Freelance",
    role: "Frontend Developer",
    org: "Shawarma Story",
    place: "Lebanon",
    period: "Jan – Jul 2026",
    summary:
      "Bilingual (English and Arabic) QR menu for a real restaurant, with a saved cart, WhatsApp checkout and a protected Firebase admin panel.",
    links: [{ label: "Live site", href: "https://shawarmastory.com", external: true }],
  },
  {
    id: "techtalks",
    kind: "Internship",
    role: "Frontend Developer Intern",
    org: "TechTalks Community",
    place: "Remote",
    period: "Nov – Dec 2025",
    summary: "React-based tasks using Git, GitHub, REST APIs, databases and Jira, practicing full-stack workflows and Git-based version control.",
    credentialId: "TT-INT-2025-089",
    links: [{ label: "Verify certificate", href: "https://verify.techtalkslb.com/", external: true }],
  },
];
