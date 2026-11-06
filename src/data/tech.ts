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
  /** brand colour, used for hover borders and glows */
  brand: string;
};

const list: Tech[] = [
  { name: "JavaScript", icon: "javascript", brand: "#F7DF1E" },
  { name: "TypeScript", icon: "typescript", brand: "#3178C6" },
  { name: "C#", icon: "csharp", brand: "#9B4F96" },
  { name: "Java", icon: "java", brand: "#E76F00" },
  { name: "Python", icon: "python", brand: "#3776AB" },
  { name: "C++", icon: "cplusplus", brand: "#00599C" },
  { name: "React", icon: "react", brand: "#61DAFB" },
  { name: "React Native", icon: "react", brand: "#61DAFB" },
  { name: "Next.js", icon: "nextjs", brand: "#94A3B8" },
  { name: "Tailwind CSS", icon: "tailwindcss", brand: "#38BDF8" },
  { name: "HTML5", icon: "html5", brand: "#E34F26" },
  { name: "CSS3", icon: "css3", brand: "#1572B6" },
  { name: "Expo", icon: "expo", mono: true, brand: "#94A3B8" },
  { name: "ASP.NET Core", icon: "dotnetcore", brand: "#512BD4" },
  { name: "PostgreSQL", icon: "postgresql", brand: "#4169E1" },
  { name: "MySQL", icon: "mysql", brightenOnDark: true, brand: "#00758F" },
  { name: "SQL Server", icon: "microsoftsqlserver", brand: "#CC2927" },
  { name: "Supabase", icon: "supabase", brand: "#3ECF8E" },
  { name: "Firebase", icon: "firebase", brand: "#FFCA28" },
  { name: "Git", icon: "git", brand: "#F05032" },
  { name: "GitHub", icon: "github", invertOnDark: true, brand: "#94A3B8" },
  { name: "Postman", icon: "postman", brand: "#FF6C37" },
  { name: "VS Code", icon: "vscode", brand: "#007ACC" },
  { name: "Jira", icon: "jira", brand: "#0052CC" },
  { name: "Cloudflare", icon: "cloudflare", brand: "#F38020" },
  { name: "n8n", icon: "n8n", mono: true, color: "#EA4B71", brand: "#EA4B71" },
  { name: "Gemini", icon: "googlegemini", mono: true, color: "#8E75B2", brand: "#8E75B2" },
];

const byName = new Map(list.map((t) => [t.name, t]));

export function tech(name: string): Tech | undefined {
  return byName.get(name);
}
