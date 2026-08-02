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
  title: 'Full-Stack & Mobile Developer',
  location: 'Beirut, Lebanon',
  email: 'sami.farhat.dev@gmail.com',
  availability:
    'Open to full-stack, mobile, remote, and freelance developer opportunities.',
  summary:
    'Full-Stack & Mobile Developer focused on building practical web and mobile applications using React, React Native, ASP.NET Core, TypeScript, PostgreSQL, Supabase, and Firebase.',
  growth:
    'Currently strengthening TypeScript and advanced React skills through practical projects.',
  educationSummary:
    'Bachelor of Science in Computer Science at the Islamic University of Lebanon, October 2023 - August 2026.',
}

export const socialLinks: LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/SF-47', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sami-farhat-46692641a', external: true },
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
      'JWT Authentication',
      'BCrypt password hashing',
      'n8n integration',
    ],
    features: [
      '3 integrated applications: ASP.NET Core API, React admin dashboard, and Expo React Native mobile app',
      '64 REST API endpoints across 13 controllers',
      '9 PostgreSQL entities and 3 user roles: Owner, UniversityAdmin, and Student',
      '11 admin pages and 17 mobile screens',
      'Matching candidates filtered by university, category, report type, open status, student, date window, and candidate limit',
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
      '2 interfaces in one React/Vite application: public customer menu and protected admin panel',
      '2 routes and 23 reusable React component files',
      'English and Arabic with Arabic RTL support',
      '7 admin menu-management operations',
      'Firestore collections: menuItems and admins',
      'WhatsApp checkout and admin metrics for total, available, unavailable, and categories',
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
    items: ['ASP.NET Core', 'C#', 'REST APIs', 'JWT Authentication'],
  },
  {
    title: 'Mobile',
    items: ['React Native', 'Expo', 'NativeWind', 'Flutter'],
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
      'Cloudflare',
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
    items: ['n8n'],
  },
  {
    title: 'Academic Exposure',
    items: ['Java Desktop Applications', 'C# Windows Forms'],
  },
]

export const education: EducationItem[] = [
  {
    year: 'October 2023 - August 2026',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Islamic University of Lebanon',
  },
]

export const experience: ExperienceItem[] = [
  {
    year: 'January 2026 - July 2026',
    role: 'Freelance Frontend Developer',
    organization: 'Shawarma Story',
    details: [
      'Built and deployed a mobile-first bilingual restaurant QR menu.',
      'Implemented a protected Firebase-backed admin panel for menu management.',
      'Added English and Arabic support with RTL layout, cart persistence, and WhatsApp checkout.',
    ],
  },
  {
    year: 'November 2025 - December 2025',
    role: 'Frontend Developer Intern',
    organization: 'TechTalks Community',
    location: 'Remote',
    details: [
      'Completed the official TechTalks Internship Program.',
      'Worked with React, Git, GitHub, databases, REST APIs, Jira, and structured development workflows.',
      'Received the official internship completion certificate in December 2025.',
    ],
  },
]
