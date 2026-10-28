// Engineering decisions for the Findly case study. Counts come from the existing portfolio
// data; the matching row follows the backend code (see matching.ts).
export type Decision = { id: string; title: string; text: string; tag: string }

export const decisions: Decision[] = [
  {
    id: 'one-api',
    title: 'Three applications, one API',
    text: 'An ASP.NET Core API with 64 REST endpoints across 13 controllers serves both the React admin dashboard and the Expo React Native app.',
    tag: 'API',
  },
  {
    id: 'auth',
    title: 'Authentication and roles',
    text: 'JWT Bearer authentication, BCrypt password hashing and role-based authorization for 3 user types.',
    tag: 'Auth',
  },
  {
    id: 'data',
    title: 'Data integrity',
    text: '9 PostgreSQL entities with 13 EF Core migrations, constraints, unique indexes and duplicate-match prevention.',
    tag: 'Data',
  },
  {
    id: 'matching',
    title: 'Filtered AI matching',
    text: 'The backend narrows candidates before any AI runs: opposite item type, same university, open status, same category, a different student, a ±7-day window, newest 20 only. A secured n8n workflow then has Gemini AI compare them (per the project README).',
    tag: 'Automation',
  },
]
