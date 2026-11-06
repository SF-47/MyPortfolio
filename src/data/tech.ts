/**
 * Logo lookup for technologies. Files in public/skills:
 * Devicon v2.16.0 (MIT) full-colour SVGs; Simple Icons v13.21.0 (CC0) single-colour SVGs
 * (`mono`, drawn as a mask in `color`, or the text colour when omitted).
 */
export type Tech = {
  name: string;
  icon: string;
  mono?: boolean;
  color?: string;
  /** dark full-colour logo: inverted in the dark theme */
  invertOnDark?: boolean;
  /** dim full-colour logo: brightened in the dark theme */
  brightenOnDark?: boolean;
};

const list: Tech[] = [
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "C#", icon: "csharp" },
  { name: "Java", icon: "java" },
  { name: "Python", icon: "python" },
  { name: "C++", icon: "cplusplus" },
  { name: "React", icon: "react" },
  { name: "React Native", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "HTML5", icon: "html5" },
  { name: "CSS3", icon: "css3" },
  { name: "Expo", icon: "expo", mono: true },
  { name: "ASP.NET Core", icon: "dotnetcore" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MySQL", icon: "mysql", brightenOnDark: true },
  { name: "SQL Server", icon: "microsoftsqlserver" },
  { name: "Supabase", icon: "supabase" },
  { name: "Firebase", icon: "firebase" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github", invertOnDark: true },
  { name: "Postman", icon: "postman" },
  { name: "VS Code", icon: "vscode" },
  { name: "Jira", icon: "jira" },
  { name: "Cloudflare", icon: "cloudflare" },
  { name: "n8n", icon: "n8n", mono: true, color: "#EA4B71" },
  { name: "Gemini", icon: "googlegemini", mono: true, color: "#8E75B2" },
];

const byName = new Map(list.map((t) => [t.name, t]));

export function tech(name: string): Tech | undefined {
  return byName.get(name);
}
