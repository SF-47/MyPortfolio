// The Findly architecture, as drawn in the case study diagram.
//
// Sources: counts (64 endpoints, 13 controllers, 17 screens, 11 admin pages, 9 entities,
// 13 migrations, 3 user types) come from the existing portfolio data. Behaviour comes from
// the Findly repository (github.com/SF-47/findly). Anything that is documented only in the
// project README, because the n8n workflow itself is not in the repo, is marked as such.
// See design-boards/system-map-phase2/ACCURACY-NOTES.md.

export type LayerId = 'all' | 'auth' | 'data' | 'automation'
export type NodeId = 'expo' | 'admin' | 'api' | 'db' | 'n8n' | 'gemini'
export type EdgeId = 'expoApi' | 'adminApi' | 'apiDb' | 'apiN8n' | 'n8nGemini'
export type DiagramLayout = 'wide' | 'tall'

export type DetailRow = { label: string; value: string }

export type ArchitectureNode = {
  id: NodeId
  kind: 'Client' | 'Backend' | 'Data' | 'Automation' | 'AI'
  title: string
  meta: string
  // Narrow layout wraps the meta text onto lines.
  metaTall?: string[]
  sub?: string
  layers: LayerId[]
  detail: { rows: DetailRow[]; note?: string }
}

export type ArchitectureEdge = {
  id: EdgeId
  from: NodeId
  to: NodeId
  label: string
  shortLabel?: string
  layers: LayerId[]
  description: string
}

export type Layer = {
  id: LayerId
  label: string
  heading: string
  rows: DetailRow[]
  // What is drawn in amber when the layer is selected.
  hot: { nodes: NodeId[]; edges: EdgeId[] }
}

export const nodes: Record<NodeId, ArchitectureNode> = {
  expo: {
    id: 'expo',
    kind: 'Client',
    title: 'Expo React Native',
    meta: '17 mobile screens',
    layers: ['all', 'auth'],
    detail: {
      rows: [
        { label: 'App', value: 'Student mobile app built with Expo React Native' },
        { label: 'Screens', value: '17' },
        { label: 'Talks to', value: 'The ASP.NET Core API, authenticated with a JWT' },
      ],
    },
  },
  admin: {
    id: 'admin',
    kind: 'Client',
    title: 'React admin',
    meta: '11 admin pages',
    layers: ['all', 'auth'],
    detail: {
      rows: [
        { label: 'App', value: 'React admin dashboard' },
        { label: 'Pages', value: '11' },
        { label: 'Talks to', value: 'The ASP.NET Core API, authenticated with a JWT' },
        { label: 'Reviews', value: 'Matches suggested by the matching workflow: confirm or reject' },
      ],
    },
  },
  api: {
    id: 'api',
    kind: 'Backend',
    title: 'ASP.NET Core API',
    meta: '64 endpoints · 13 controllers',
    sub: 'JWT Bearer · BCrypt · roles',
    layers: ['all', 'auth', 'data', 'automation'],
    detail: {
      rows: [
        { label: 'Endpoints', value: '64 REST endpoints across 13 controllers' },
        { label: 'Auth', value: 'JWT Bearer authentication, BCrypt password hashing, role-based authorization' },
        { label: 'Data access', value: 'EF Core against PostgreSQL' },
        { label: 'Matching', value: 'Triggers n8n, serves it filtered candidates, and validates the matches it sends back' },
      ],
    },
  },
  db: {
    id: 'db',
    kind: 'Data',
    title: 'PostgreSQL',
    meta: '9 entities · 13 migrations',
    metaTall: ['9 entities', '13 migrations'],
    layers: ['all', 'data'],
    detail: {
      rows: [
        { label: 'Entities', value: '9' },
        { label: 'Migrations', value: '13 (EF Core)' },
        { label: 'Safeguards', value: 'Constraints, unique indexes, duplicate-match prevention' },
        { label: 'Hosting', value: 'Supabase PostgreSQL (per the project README)' },
      ],
    },
  },
  n8n: {
    id: 'n8n',
    kind: 'Automation',
    title: 'n8n',
    meta: 'secured webhook',
    metaTall: ['secured', 'webhook'],
    layers: ['all', 'automation'],
    detail: {
      rows: [
        { label: 'Trigger', value: 'The backend calls an n8n webhook after an item is created, with a shared-secret header' },
        { label: 'Calls back', value: 'Asks the backend for filtered candidates and posts matches to it, with the same secret' },
      ],
      note: 'The n8n workflow itself is not in the repository; its steps are described in the project README.',
    },
  },
  gemini: {
    id: 'gemini',
    kind: 'AI',
    title: 'Gemini AI',
    meta: 'compares candidates',
    metaTall: ['compares', 'candidates'],
    layers: ['all', 'automation'],
    detail: {
      rows: [{ label: 'Role', value: 'Compares item name, description, colour, location, date, category and image URL' }],
      note: 'Per the project README. The Gemini step is part of the n8n workflow, which is not in the repository.',
    },
  },
}

export const edges: Record<EdgeId, ArchitectureEdge> = {
  expoApi: {
    id: 'expoApi',
    from: 'expo',
    to: 'api',
    label: 'JWT BEARER',
    layers: ['all', 'auth'],
    description: 'The Expo app calls the API with a JWT Bearer token.',
  },
  adminApi: {
    id: 'adminApi',
    from: 'admin',
    to: 'api',
    label: 'JSON / REST',
    shortLabel: 'REST',
    layers: ['all', 'auth'],
    description: 'The React admin dashboard calls the same API over JSON / REST.',
  },
  apiDb: {
    id: 'apiDb',
    from: 'api',
    to: 'db',
    label: 'EF CORE',
    layers: ['all', 'data'],
    description: 'The API reads and writes PostgreSQL through EF Core.',
  },
  apiN8n: {
    id: 'apiN8n',
    from: 'api',
    to: 'n8n',
    label: 'SECURED WEBHOOK',
    shortLabel: 'WEBHOOK',
    layers: ['all', 'automation'],
    description: 'The API triggers n8n through a secured webhook; n8n calls the API back with the same secret.',
  },
  n8nGemini: {
    id: 'n8nGemini',
    from: 'n8n',
    to: 'gemini',
    label: '',
    layers: ['all', 'automation'],
    description: 'n8n sends the candidates to Gemini AI for comparison (per the project README).',
  },
}

export const layers: Layer[] = [
  {
    id: 'all',
    label: 'All',
    heading: 'The whole path',
    rows: [
      { label: 'Clients', value: 'Expo React Native app · React admin dashboard' },
      { label: 'API', value: 'ASP.NET Core · 64 endpoints · 13 controllers' },
      { label: 'Data', value: 'PostgreSQL · 9 entities' },
      { label: 'Automation', value: 'n8n · Gemini AI' },
    ],
    hot: { nodes: [], edges: [] },
  },
  {
    id: 'auth',
    label: 'Auth',
    heading: 'Authentication and roles',
    rows: [
      { label: 'Scheme', value: 'JWT Bearer' },
      { label: 'Passwords', value: 'BCrypt hashing' },
      { label: 'Authorization', value: 'Role-based' },
      { label: 'User types', value: '3' },
    ],
    hot: { nodes: ['api'], edges: ['expoApi', 'adminApi'] },
  },
  {
    id: 'data',
    label: 'Data',
    heading: 'Data integrity',
    rows: [
      { label: 'Database', value: 'PostgreSQL' },
      { label: 'Entities', value: '9' },
      { label: 'Migrations', value: '13 (EF Core)' },
      { label: 'Safeguards', value: 'Constraints, unique indexes, duplicate-match prevention' },
    ],
    hot: { nodes: ['api', 'db'], edges: ['apiDb'] },
  },
  {
    id: 'automation',
    label: 'Automation',
    heading: 'Filtered AI matching',
    rows: [
      { label: 'Trigger', value: 'The backend calls an n8n webhook after an item is created, with a shared-secret header' },
      { label: 'Candidates', value: 'The backend filters candidates before any AI runs: newest 20 within ±7 days' },
      { label: 'Comparison', value: 'Gemini AI compares item details (per the project README)' },
      { label: 'Result', value: 'Matches are saved as Pending for admin review' },
    ],
    hot: { nodes: ['n8n', 'gemini'], edges: ['apiN8n', 'n8nGemini'] },
  },
]

type Point = [number, number]
type Box = { x: number; y: number; w: number; h: number }
type LayoutSpec = {
  width: number
  height: number
  nodes: Record<NodeId, Box>
  // Orthogonal route from the `from` node to the `to` node.
  edges: Record<EdgeId, { points: Point[]; label?: Point }>
}

// Drawn coordinates, taken from the approved design boards.
export const layouts: Record<DiagramLayout, LayoutSpec> = {
  wide: {
    width: 720,
    height: 630,
    nodes: {
      expo: { x: 0, y: 0, w: 220, h: 100 },
      admin: { x: 500, y: 0, w: 220, h: 100 },
      api: { x: 200, y: 170, w: 320, h: 140 },
      db: { x: 0, y: 380, w: 220, h: 100 },
      n8n: { x: 500, y: 380, w: 220, h: 100 },
      gemini: { x: 500, y: 530, w: 220, h: 100 },
    },
    edges: {
      expoApi: { points: [[110, 100], [110, 135], [280, 135], [280, 170]], label: [126, 118] },
      adminApi: { points: [[610, 100], [610, 135], [440, 135], [440, 170]], label: [452, 118] },
      apiDb: { points: [[280, 310], [280, 345], [110, 345], [110, 380]], label: [126, 337] },
      apiN8n: { points: [[440, 310], [440, 345], [610, 345], [610, 380]], label: [452, 337] },
      n8nGemini: { points: [[610, 480], [610, 530]] },
    },
  },
  tall: {
    width: 350,
    height: 564,
    nodes: {
      expo: { x: 0, y: 0, w: 167, h: 100 },
      admin: { x: 183, y: 0, w: 167, h: 100 },
      api: { x: 0, y: 152, w: 350, h: 108 },
      db: { x: 0, y: 312, w: 167, h: 100 },
      n8n: { x: 183, y: 312, w: 167, h: 100 },
      gemini: { x: 183, y: 464, w: 167, h: 100 },
    },
    edges: {
      expoApi: { points: [[83, 100], [83, 152]], label: [96, 146] },
      adminApi: { points: [[266, 100], [266, 152]], label: [279, 130] },
      apiDb: { points: [[83, 260], [83, 312]], label: [96, 292] },
      apiN8n: { points: [[266, 260], [266, 312]], label: [279, 292] },
      n8nGemini: { points: [[266, 412], [266, 464]] },
    },
  },
}

export const repositoryUrl = 'https://github.com/SF-47/findly'
