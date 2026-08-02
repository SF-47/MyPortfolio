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
  title: 'Junior Full-Stack & Mobile Developer',
  location: 'Beirut, Lebanon',
  email: 'samihfarhat2005@gmail.com',
  availability:
    'Open to junior developer roles, internships, remote opportunities, and freelance projects.',
  summary:
    'Junior Full-Stack & Mobile Developer focused on building practical web and mobile applications using React, React Native, ASP.NET Core, TypeScript, PostgreSQL, Supabase, and Firebase.',
  growth:
    'Currently strengthening TypeScript and advanced React skills through practical projects.',
  educationSummary:
    'He has completed the degree requirements for a Bachelor of Science in Computer Science at the Islamic University of Lebanon and is currently waiting for the official graduation certificate.',
}

export const socialLinks: LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/SF-47', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sami-farhat-46692641a', external: true },
]

export const projects: Project[] = [
  {
    id: '01',
    title: 'Findly',
    kicker: 'AI-Powered Lost & Found System for University Campuses',
    description:
      'A full-stack university lost-and-found platform with a React admin dashboard, React Native mobile application, ASP.NET Core Web API, PostgreSQL database, AI-assisted item matching, notifications, image storage, and real-time chat.',
    image: stitchAsset('findly-real-composite.webp'),
    imageAlt:
      'Findly admin dashboard and React Native mobile application screens',
    repository: 'https://github.com/SF-47/findly',
    actions: [
      { label: 'View Repository', href: 'https://github.com/SF-47/findly', external: true },
      {
        label: 'Watch Demo',
        href: 'https://drive.google.com/file/d/1v0SOa4yqmMoDwy0Iu_RnM6rnAb1L9V1M/view?usp=drive_link',
        external: true,
      },
    ],
    technologies: [
      'ASP.NET Core',
      'Entity Framework Core',
      'React',
      'TypeScript',
      'React Native',
      'PostgreSQL',
      'Supabase',
      'n8n / Gemini AI',
    ],
    features: [
      'Role-based accounts',
      'Student verification',
      'Lost and found reports',
      'AI-assisted matching',
      'Admin match review',
      'Real-time chat and notifications',
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
      'A live bilingual restaurant QR menu built for a real client, combining a customer-facing ordering experience with a protected Firebase Authentication admin dashboard for managing menu items, categories, prices, availability, and Firestore menu data.',
    image: stitchAsset('shawarma-real-composite.webp'),
    imageAlt:
      'Shawarma Story bilingual QR menu, cart ordering flow, and Firebase admin panel',
    repository: 'https://github.com/SF-47/restaurant-qr-menu',
    liveUrl: 'https://shawarmastory.com',
    actions: [
      { label: 'Visit Website', href: 'https://shawarmastory.com', external: true },
      {
        label: 'View Repository',
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
    ],
    features: [
      'Bilingual English and Arabic support',
      'RTL layout',
      'Customer category filtering and cart controls',
      'WhatsApp checkout',
      'Firebase Authentication admin login',
      'Add, edit, delete, price, availability, and category management',
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
    title: 'Languages',
    items: ['JavaScript', 'TypeScript', 'C#', 'Java', 'Python', 'C++'],
  },
  {
    title: 'Frontend',
    items: ['React', 'HTML5', 'CSS3', 'Tailwind CSS', 'React Router'],
  },
  {
    title: 'Mobile',
    items: ['React Native', 'Expo', 'NativeWind'],
  },
  {
    title: 'Backend',
    items: [
      'ASP.NET Core Web API',
      'Entity Framework Core',
      'REST APIs',
      'JWT Authentication',
      'Role-Based Authorization',
      'BCrypt',
    ],
  },
  {
    title: 'Databases and Cloud',
    items: [
      'PostgreSQL',
      'Supabase',
      'Supabase Storage',
      'Supabase Realtime',
      'Firebase Firestore',
      'Firebase Authentication',
      'Firebase Hosting',
      'SQL Server',
      'SSMS',
    ],
  },
  {
    title: 'AI and Automation',
    items: ['n8n', 'Gemini AI integration'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Postman', 'Jira', 'VS Code', 'Stitch'],
  },
  {
    title: 'Spoken Languages',
    items: ['Arabic — Native', 'English — Upper-Intermediate'],
  },
]

export const education: EducationItem[] = [
  {
    year: '2026',
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Islamic University of Lebanon',
    status: 'Degree requirements completed — official graduation certificate pending',
  },
]

export const experience: ExperienceItem[] = [
  {
    year: '2025',
    role: 'Frontend Developer Intern',
    organization: 'TechTalks Community',
    location: 'Remote',
    details: [
      'Completed the official TechTalks Internship Program',
      'Worked with React, Git, GitHub, databases, REST APIs, Jira, and structured development workflows',
      'Official Internship Completion Certificate issued in December 2025',
    ],
  },
  {
    year: '2024',
    role: 'Freelance Frontend Developer',
    organization: 'Shawarma Story',
    details: [
      'Built and deployed a mobile-first bilingual restaurant QR menu',
      'Implemented Firebase-backed menu and protected admin functionality',
      'Added English and Arabic support with RTL layout',
      'Added cart controls, customer notes, and WhatsApp ordering',
      'Deployed using Firebase Hosting and a custom domain',
    ],
  },
]
