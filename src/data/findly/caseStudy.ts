import { projects } from '../portfolioData'
import type { TraceSource } from './trace'

// Content of the Findly case study page. Status, scope and role come from the project data;
// the counts are the ones already published in the project's features; behaviour statements
// come from the Findly repository (github.com/SF-47/findly). Anything that rests only on the
// project README is marked `source: 'readme'`. See design-boards/.../ACCURACY-NOTES.md.

const findly = projects.find((project) => project.id === '01')
const meta = (label: string) => findly?.meta.find((item) => item.label === label)?.value ?? ''

export const findlyFacts: Array<{ label: string; value: string }> = [
  { label: 'Status', value: meta('Status') },
  { label: 'Scope', value: meta('Scope') },
  { label: 'Role', value: meta('Role') },
  { label: 'Apps', value: 'ASP.NET Core API · React admin · Expo app' },
  { label: 'Stack', value: 'ASP.NET Core · React · TypeScript · Expo React Native · PostgreSQL · n8n · Gemini AI' },
]

export const findlyOverview =
  'Findly is a full-stack lost-and-found platform for university campuses: an ASP.NET Core API, a React admin dashboard and an Expo React Native mobile app, with role-based access for 3 user types.'

export const findlyGlance = [
  { value: '64', label: 'REST endpoints', note: '13 controllers' },
  { value: '9', label: 'PostgreSQL entities', note: '13 EF Core migrations' },
  { value: '11', label: 'Admin pages', note: 'React dashboard' },
  { value: '17', label: 'Mobile screens', note: 'Expo React Native' },
]

export type BuildDetail = { text: string; source?: TraceSource }

// How the system is built: the API, then the two clients.
export const buildDetails: { backend: BuildDetail[]; clients: BuildDetail[] } = {
  backend: [
    { text: '13 controllers: admin, auth, categories, dashboard, found items, lost items, matches, messages, n8n matching, notifications, student actions, students and universities.' },
    { text: 'JWT Bearer authentication across the API, with role checks where a route is limited, for example resolving a match is for students only.' },
    { text: 'Passwords are hashed with BCrypt.' },
    { text: 'EF Core against PostgreSQL: 9 entities and 13 migrations, with constraints and unique indexes that back duplicate-match prevention.' },
    { text: 'The n8n endpoints are protected by a shared secret header rather than a user JWT, so only the automation can call them.' },
  ],
  clients: [
    { text: '11 admin pages and 17 mobile screens cover verification, reporting, matching, notifications, chat and profiles.' },
    { text: 'The React admin dashboard is where admins manage reports and categories, and review the matches the automation suggests.', source: 'readme' },
    { text: 'Both clients call the API with Axios and a JWT.', source: 'readme' },
    { text: 'Images are uploaded to Supabase Storage, and chat updates arrive through Supabase Realtime.', source: 'readme' },
  ],
}

export const findlyStack = [
  { title: 'Backend', items: ['ASP.NET Core', 'REST APIs', 'EF Core', 'JWT Bearer', 'BCrypt', 'Role-based authorization'] },
  { title: 'Clients', items: ['React', 'TypeScript', 'Expo React Native'] },
  { title: 'Data', items: ['PostgreSQL', 'MySQL', 'Supabase'] },
  { title: 'Automation & AI', items: ['n8n', 'Gemini AI'] },
]

// The flow around the backend candidate filter (see matching.ts for the filter itself).
export type MatchingStep = { id: string; title: string; text: string; source: TraceSource }

export const matchingFlow: MatchingStep[] = [
  {
    id: 'trigger',
    title: 'Item creation triggers n8n',
    text: 'After a lost or found item is saved, the backend posts its id and type to an n8n webhook, with a shared secret in the request header.',
    source: 'code',
  },
  {
    id: 'endpoint',
    title: 'A protected candidates endpoint',
    text: 'The backend exposes GET /n8n/matching/candidates. It rejects any request that does not carry the shared secret.',
    source: 'code',
  },
  {
    id: 'filter',
    title: 'The backend filters, orders and limits',
    text: 'It applies the seven criteria listed here, orders the result newest first and returns at most 20 candidates. This all happens before any AI is involved.',
    source: 'code',
  },
  {
    id: 'compare',
    title: 'Gemini compares the candidates',
    text: 'The comparison looks at item name, description, colour, location, date, category and image URL.',
    source: 'readme',
  },
  {
    id: 'review',
    title: 'An admin reviews strong matches',
    text: 'Matches the comparison keeps are saved as Pending, and an admin confirms or rejects them before students are connected.',
    source: 'readme',
  },
]
