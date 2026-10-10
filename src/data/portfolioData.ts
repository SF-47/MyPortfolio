import type {
  EducationItem,
  ExperienceItem,
  LinkItem,
  NavItem,
  Project,
  SkillGroup,
} from '../types/portfolio'

const stitchAsset = (fileName: string) => `/assets/stitch/${fileName}`

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'Profile', href: '#profile' },
  { label: 'Skills', href: '#capabilities' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const profile = {
  name: 'Sami Farhat',
  title: 'Junior Software Engineer',
  specialization: 'Full-Stack & Mobile Development',
  location: 'Beirut, Lebanon',
  email: 'sami.farhat.dev@gmail.com',
  availability:
    'Open to Junior Software Engineer, backend, full-stack, frontend, and mobile development opportunities.',
  summary:
    'Computer Science graduate and Junior Software Engineer with hands-on experience building full-stack and mobile applications, backend APIs, database-driven systems, authentication, automation, and deployments using React, React Native, TypeScript, ASP.NET Core, PostgreSQL, Supabase, and Firebase.',
  growth:
    'Building practical software across REST APIs, role-based access, admin dashboards, mobile applications, automation workflows, and deployment.',
  educationSummary:
    'Bachelor of Science in Computer Science at the Islamic University of Lebanon, October 2023 – August 2026.',
}

export const heroStack = ['React', 'React Native', 'TypeScript', 'ASP.NET Core', 'PostgreSQL', 'Firebase']

export const socialLinks: LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/SF-47', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samifarhat-dev', external: true },
]

export const projects: Project[] = [
  {
    id: '01',
    title: 'Findly',
    kicker: 'Lost-and-found platform for university campuses',
    description:
      'Full-stack lost-and-found platform consisting of an ASP.NET Core API, React admin dashboard, and Expo React Native mobile app. The system includes 64 REST endpoints, 11 admin pages, 17 mobile screens, 9 PostgreSQL entities, and role-based access for 3 user types.',
    image: stitchAsset('findly-real-composite.webp'),
    imageAlt:
      'Findly admin dashboard and React Native mobile application screens',
    repository: 'https://github.com/SF-47/findly',
    actions: [
      { label: 'View GitHub', href: 'https://github.com/SF-47/findly', external: true },
      {
        label: 'Watch Demo',
        href: 'https://drive.google.com/file/d/1v0SOa4yqmMoDwy0Iu_RnM6rnAb1L9V1M/view?usp=sharing',
        external: true,
      },
    ],
    technologies: [
      'ASP.NET Core',
      'React',
      'TypeScript',
      'Expo React Native',
      'PostgreSQL',
      'Supabase',
      'JWT Bearer authentication',
      'BCrypt password hashing',
      'Role-based authorization',
      'n8n',
      'Gemini AI',
    ],
    features: [
      'Built 3 integrated applications: ASP.NET Core API, React admin dashboard, and Expo React Native app.',
      'Implemented 64 REST endpoints across 13 controllers with JWT Bearer authentication, BCrypt, and role-based authorization.',
      'Designed 9 PostgreSQL entities with 13 EF Core migrations, constraints, unique indexes, and duplicate-match prevention.',
      'Developed 11 admin pages and 17 mobile screens for verification, reporting, matching, notifications, chat, and profiles.',
      'Integrated secured n8n and Gemini AI matching workflows with university, category, item type, status, student, ±7-day, and 20-candidate filtering.',
    ],
    meta: [
      { label: 'Status', value: 'Repository public / not publicly deployed' },
      { label: 'Scope', value: 'University platform' },
      { label: 'Role', value: 'Full-stack development' },
    ],
  },
  {
    id: '02',
    title: 'Shawarma Story QR Menu',
    kicker: 'Customer QR menu and admin management dashboard',
    description:
      'Bilingual QR restaurant menu built with React, Vite, Tailwind CSS, and Firebase. The application includes a public customer interface, protected admin panel, Arabic RTL support, persistent cart, WhatsApp checkout, 7 menu-management operations, and 23 reusable React components.',
    image: stitchAsset('shawarma-real-composite.webp'),
    imageAlt:
      'Shawarma Story bilingual QR menu, cart ordering flow, and Firebase admin panel',
    repository: 'https://github.com/SF-47/restaurant-qr-menu',
    liveUrl: 'https://shawarmastory.com',
    actions: [
      { label: 'Live Website', href: 'https://shawarmastory.com', external: true },
      {
        label: 'View GitHub',
        href: 'https://github.com/SF-47/restaurant-qr-menu',
        external: true,
      },
    ],
    technologies: [
      'React',
      'JavaScript',
      'Vite',
      'Tailwind CSS',
      'Firebase Firestore',
      'Firebase Authentication',
      'Firebase Hosting',
      'LocalStorage cart persistence',
    ],
    features: [
      'Built 2 interfaces in one React/Vite application: public menu and protected admin panel.',
      'Supported 2 languages with Arabic RTL layout and localized menu content.',
      'Implemented persistent cart, quantity controls, totals, notes, and itemized WhatsApp checkout.',
      'Developed 7 admin menu-management operations for items, categories, prices, and availability.',
      'Integrated Firestore, Firebase Authentication, and Firebase Hosting with protected write rules and custom-domain deployment.',
    ],
    meta: [
      { label: 'Status', value: 'Live client website' },
      { label: 'Type', value: 'Freelance frontend development' },
      { label: 'Stack', value: 'React / JavaScript / Firebase' },
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
  },
  {
    title: 'Backend',
    items: ['ASP.NET Core', 'C#', 'REST APIs', 'JWT Authentication', 'Role-Based Access Control'],
  },
  {
    title: 'Mobile',
    items: ['React Native', 'Expo', 'NativeWind'],
  },
  {
    title: 'Databases & Cloud',
    items: [
      'PostgreSQL',
      'Supabase',
      'Firebase Firestore',
      'Firebase Authentication',
      'Firebase Hosting',
      'SQL Server',
    ],
  },
  {
    title: 'Tools & Workflow',
    items: ['Git', 'GitHub', 'Postman', 'Jira', 'VS Code'],
  },
  {
    title: 'Programming Languages',
    items: ['JavaScript', 'TypeScript', 'C#', 'Java', 'Python', 'C++'],
  },
  {
    title: 'Automation & AI',
    items: ['n8n', 'AI-assisted workflows'],
  },
  {
    title: 'Academic Exposure',
    items: ['Flutter', 'Java Desktop Applications', 'C# Windows Forms'],
  },
]

export const education: EducationItem[] = [
  {
    year: 'October 2023 – August 2026',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Islamic University of Lebanon',
  },
]

export const experience: ExperienceItem[] = [
  {
    year: 'January 2026 – July 2026',
    role: 'Freelance Frontend Developer',
    organization: 'Shawarma Story',
    details: [
      'Built and deployed a bilingual QR restaurant menu using React, Tailwind CSS, and Firebase.',
      'Developed a protected admin panel for managing menu items, categories, prices, and availability.',
      'Implemented cart persistence, quantity controls, notes, and WhatsApp checkout.',
    ],
  },
  {
    year: 'November 2025 – December 2025',
    role: 'Frontend Developer Intern',
    organization: 'TechTalks Community',
    location: 'Remote',
    details: [
      'Completed React-based development tasks using Git, GitHub, REST APIs, databases, and Jira.',
      'Applied the internship training to later academic, freelance, and full-stack projects.',
    ],
  },
]
