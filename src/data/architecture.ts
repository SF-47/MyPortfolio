/**
 * How the three projects are actually wired, verified against their repositories
 * (package.json, .csproj, firebase.json, firestore.rules and the READMEs), Nov 2026.
 *
 *  Findly            admin (React) + mobile (Expo) → ASP.NET Core (JWT, BCrypt, EF Core)
 *                    → PostgreSQL on Supabase; Supabase Storage + Realtime from the clients;
 *                    backend → n8n webhook → Gemini.
 *  Flexible Portfolio Next.js (site + admin BFF) → ASP.NET Core (cookie auth, CSRF)
 *                    → EF Core → MySQL.
 *  Shawarma Story    React + Vite → Firestore + Firebase Auth (rules: public reads, writes only
 *                    for uids in the admins collection), Firebase Hosting, WhatsApp order hand-off.
 */
export type Layer = "client" | "api" | "data" | "services";
export type ProjectKey = "findly" | "flexible-portfolio" | "shawarma-story";

export type ArchNode = {
  id: string;
  layer: Layer;
  name: string;
  note: string;
  /** name in data/tech for the logo, if there is one */
  logo?: string;
  icon?: "key" | "chat";
};

export type ArchEdge = { from: string; to: string; projects: ProjectKey[]; label: string };

export const layers: { id: Layer; label: string; hint: string }[] = [
  { id: "client", label: "Client", hint: "what people touch" },
  { id: "api", label: "API", hint: "rules & access" },
  { id: "data", label: "Data", hint: "where it lives" },
  { id: "services", label: "Services", hint: "beyond the app" },
];

export const nodes: ArchNode[] = [
  { id: "rn", layer: "client", name: "React Native", note: "Expo mobile app", logo: "React Native" },
  { id: "next", layer: "client", name: "Next.js", note: "site + admin BFF", logo: "Next.js" },
  { id: "react", layer: "client", name: "React", note: "dashboards, menus", logo: "React" },

  { id: "aspnet", layer: "api", name: "ASP.NET Core", note: "REST · EF Core", logo: "ASP.NET Core" },
  { id: "auth", layer: "api", name: "Auth & roles", note: "JWT · cookies · Firebase Auth", icon: "key" },

  { id: "pg", layer: "data", name: "PostgreSQL", note: "on Supabase", logo: "PostgreSQL" },
  { id: "storage", layer: "data", name: "Supabase", note: "Storage · Realtime", logo: "Supabase" },
  { id: "mysql", layer: "data", name: "MySQL", note: "via EF Core", logo: "MySQL" },
  { id: "firestore", layer: "data", name: "Firestore", note: "admin-only writes", logo: "Firebase" },

  { id: "n8n", layer: "services", name: "n8n", note: "matching workflow", logo: "n8n" },
  { id: "gemini", layer: "services", name: "Gemini", note: "compares items", logo: "Gemini" },
  { id: "hosting", layer: "services", name: "Firebase Hosting", note: "custom domain", logo: "Firebase" },
  { id: "whatsapp", layer: "services", name: "WhatsApp", note: "order hand-off", icon: "chat" },
];

export const edges: ArchEdge[] = [
  { from: "rn", to: "aspnet", projects: ["findly"], label: "mobile app calls the API" },
  { from: "react", to: "aspnet", projects: ["findly"], label: "admin dashboard calls the API" },
  { from: "next", to: "aspnet", projects: ["flexible-portfolio"], label: "Next.js server calls the API" },
  { from: "aspnet", to: "auth", projects: ["findly", "flexible-portfolio"], label: "JWT and roles, or admin cookies" },
  { from: "react", to: "auth", projects: ["shawarma-story"], label: "staff sign in with Firebase Auth" },
  { from: "aspnet", to: "pg", projects: ["findly"], label: "EF Core to PostgreSQL" },
  { from: "aspnet", to: "mysql", projects: ["flexible-portfolio"], label: "EF Core to MySQL" },
  { from: "rn", to: "storage", projects: ["findly"], label: "photo uploads and live chat" },
  { from: "react", to: "firestore", projects: ["shawarma-story"], label: "menu and admin data" },
  { from: "aspnet", to: "n8n", projects: ["findly"], label: "new report triggers a webhook" },
  { from: "n8n", to: "gemini", projects: ["findly"], label: "AI compares candidates" },
  { from: "react", to: "hosting", projects: ["shawarma-story"], label: "deployed to Firebase Hosting" },
  { from: "react", to: "whatsapp", projects: ["shawarma-story"], label: "itemized order message" },
];

export const archProjects: { key: ProjectKey | "all"; label: string; summary: string }[] = [
  {
    key: "all",
    label: "All projects",
    summary:
      "Three projects, one way of working: a client on the web or a phone, an API that owns the rules, and a database behind it. Pick a project to trace its path.",
  },
  {
    key: "findly",
    label: "Findly",
    summary:
      "The React admin dashboard and the Expo mobile app share one ASP.NET Core API, secured with JWT and BCrypt, that stores everything in PostgreSQL through EF Core. Photos go to Supabase Storage and chat updates arrive through Supabase Realtime. Each new report triggers an n8n workflow that asks Gemini to compare candidates before an admin confirms a match.",
  },
  {
    key: "flexible-portfolio",
    label: "Flexible Portfolio",
    summary:
      "A Next.js site that also acts as the admin's backend-for-frontend talks to an ASP.NET Core API (controller → service → EF Core) backed by MySQL. Admin sessions use cookies with CSRF protection and per-IP rate limits.",
  },
  {
    key: "shawarma-story",
    label: "Shawarma Story",
    summary:
      "A React + Vite app with no custom server: the menu lives in Firestore, staff sign in with Firebase Auth, and Firestore rules let only accounts listed as admins change the menu. It's served from Firebase Hosting, and each order is handed to WhatsApp as an itemized message.",
  },
];
