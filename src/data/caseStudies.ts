/**
 * Case studies for the project dialogs. Every statement comes from the project's README,
 * API.md, firestore.rules or the CV; nothing here is estimated or invented.
 * Projects without documented challenges show their documented next steps instead.
 */
export type CaseStudy = {
  /** one line on the card: the problem the project solves */
  problem: string;
  /** the problem, in a little more detail */
  context: string;
  /** request flow, left to right */
  flow: string[];
  decisions: { title: string; body: string }[];
  outcome: string;
  /** documented future improvements, if the README lists any */
  next?: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  findly: {
    problem: "Lost property on campus is scattered across offices and group chats.",
    context:
      "Students hunting for a lost item check several offices, post in social-media groups or share their phone number publicly. Findly puts every lost and found report in one place and suggests likely matches.",
    flow: ["Expo app / React admin", "ASP.NET Core API · JWT", "PostgreSQL · EF Core", "n8n → Gemini"],
    decisions: [
      {
        title: "Filter before the AI",
        body: "The API narrows candidates first: opposite report type, same university and category, still open, a different student, within ±7 days, at most 20. Only those go through n8n to Gemini.",
      },
      {
        title: "A person confirms every match",
        body: "Matches Gemini scores at 70% or higher are saved as Pending. An admin confirms or rejects each one before the two students are connected.",
      },
      {
        title: "Images out of the database",
        body: "Photos and university cards go to Supabase Storage; PostgreSQL stores only their URLs.",
      },
      {
        title: "Realtime for display, not for writes",
        body: "The API saves and validates every chat message. Supabase Realtime only pushes the new row to the open chat screen.",
      },
    ],
    outcome:
      "Complete as a working prototype: 64 REST endpoints, 11 admin pages and 17 mobile screens covering verification, reporting, AI matching, notifications, image storage and realtime chat. Not deployed publicly; the demo video shows it running.",
    next: ["Refresh tokens", "Stricter checks on who can message whom", "Weighted scoring for AI matches"],
  },
  "flexible-portfolio": {
    problem: "Let a company reorder, edit and restyle its own website without a developer.",
    context:
      "Admins pick from 15 section types, reorder or hide them, edit their content beside a live desktop, tablet and mobile preview, and switch theme presets. The public site follows every change.",
    flow: ["Browser", "Next.js · site + admin BFF", "ASP.NET Core · controller → service", "EF Core → MySQL"],
    decisions: [
      {
        title: "Next.js as the admin's backend-for-frontend",
        body: "The browser only talks to Next.js; the Next.js server calls the ASP.NET Core API on its behalf.",
      },
      {
        title: "Typed section content",
        body: "Each of the 15 section types has a defined content shape, validated with Zod and documented in API.md.",
      },
      {
        title: "Rebuild on save",
        body: "The home page is prerendered at build time and regenerated automatically after an admin saves.",
      },
      {
        title: "Hardened admin access",
        body: "Secure admin cookies, CSRF protection and per-IP rate limits (10 logins or 5 contact messages per 15 minutes), trusting forwarded IPs only from known proxies.",
      },
    ],
    outcome:
      "Runs end to end: API, admin dashboard and generated public site (the screenshots are from a local run). Not deployed publicly; the repository includes a full endpoint reference.",
    next: ["An automated test suite", "A password reset flow"],
  },
  "shawarma-story": {
    problem: "A restaurant menu customers open from a QR code and order from, in English or Arabic.",
    context:
      "Customers scan a code at the table, browse in English or Arabic, build an order and send it to the restaurant. Staff keep the menu, prices and availability up to date themselves.",
    flow: ["React + Vite", "Firebase Auth", "Firestore · rules", "Firebase Hosting"],
    decisions: [
      {
        title: "No custom backend",
        body: "Firestore holds the menu, Firebase Auth handles staff sign-in and Firebase Hosting serves the app; the rules and hosting config live in the repository.",
      },
      {
        title: "Admin rights checked by the database",
        body: "Anyone can read the menu. Firestore rules allow changes only when the signed-in user has a document in the admins collection.",
      },
      {
        title: "Arabic as a first-class layout",
        body: "Switching to Arabic flips the whole interface to right-to-left, not just the text.",
      },
      {
        title: "Ordering through WhatsApp",
        body: "The cart builds an itemized message with quantities, notes and a total, and opens it in WhatsApp for the restaurant.",
      },
    ],
    outcome:
      "Live at shawarmastory.com on a custom domain, built from 23 reusable components. Staff manage the menu from an admin route that isn't linked publicly.",
  },
};
