/** Skill groups as on the CV / GitHub profile. Names map to logos in data/tech. */
export type SkillGroup = { title: string; skills: string[]; also?: string[] };

export const skillGroups: SkillGroup[] = [
  { title: "Languages", skills: ["JavaScript", "TypeScript", "C#", "Java", "Python", "C++"] },
  { title: "Frontend", skills: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
  { title: "Mobile", skills: ["React Native", "Expo"], also: ["NativeWind", "Expo SecureStore", "Push notifications"] },
  {
    title: "Backend & Data",
    skills: ["ASP.NET Core", "PostgreSQL", "MySQL", "SQL Server", "Supabase", "Firebase"],
    also: ["REST APIs", "EF Core", "JWT auth", "Role-based access"],
  },
  { title: "Tools", skills: ["Git", "GitHub", "Postman", "VS Code", "Jira", "Cloudflare"] },
  { title: "AI & Automation", skills: ["n8n", "Gemini"], also: ["AI-assisted matching", "Webhook workflows"] },
];
