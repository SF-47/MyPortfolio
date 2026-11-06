export const profile = {
  name: "Sami Farhat",
  role: "Junior Software Engineer",
  focus: "Full-stack & mobile development",
  location: "Beirut, Lebanon",
  /** Core stack, shown on the back of the ID badge. */
  coreStack: ["React", "React Native", "ASP.NET Core", "PostgreSQL"],
  timeZone: "Asia/Beirut",
  intro:
    "Computer Science graduate building web and mobile apps end to end: React and React Native on the front end; ASP.NET Core, PostgreSQL and Supabase behind them.",
  /** Shown on the About card. Change or remove when it stops being true. */
  status: "Available for hire",
  /** One line under the status on the About card. */
  statusDetail: "Junior software engineering roles: full-stack, frontend or mobile.",
  languages: "Arabic (native) · English",
  cv: "/cv.pdf",
  email: "sami.farhat.dev@gmail.com",
  github: "https://github.com/SF-47",
  githubHandle: "SF-47",
  linkedin: "https://www.linkedin.com/in/samifarhat-dev",
  linkedinHandle: "samifarhat-dev",
};

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;
