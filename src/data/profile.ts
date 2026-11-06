export const profile = {
  name: "Sami Farhat",
  role: "Junior Software Engineer",
  focus: "Full-stack & mobile development",
  location: "Beirut, Lebanon",
  timeZone: "Asia/Beirut",
  /** Hero statement: what I build, in one sentence. */
  statement: "I build web and mobile apps end to end: the database, the API and the screen people actually use.",
  /** Core stack shown under the statement. */
  coreStack: ["React", "React Native", "ASP.NET Core", "PostgreSQL"],
  /** Shown on the About card. Change or remove when it stops being true. */
  status: "Available for hire",
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
