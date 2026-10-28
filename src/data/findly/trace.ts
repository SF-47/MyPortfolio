import type { EdgeId, NodeId } from './architecture'

// How a newly reported item becomes a match an admin can review, step by step.
// `source` says where each step is established: the Findly backend code, or only the
// project README (the n8n workflow, which holds the Gemini step, is not in the repository).
// The steps follow the real endpoints: POST /lost-items and /found-items,
// GET /n8n/matching/candidates, POST /n8n/matching/save-match, PATCH /matches/{id}/status.

export type TraceSource = 'code' | 'readme'

export type TraceStage = {
  id: string
  title: string
  text: string
  source: TraceSource
  note?: string
  nodes: NodeId[]
  edge?: EdgeId
  // Direction the dot travels along `edge`; the edge is drawn from its `from` node.
  direction?: 'forward' | 'reverse'
}

export const traceStages: TraceStage[] = [
  {
    id: 'report',
    title: 'A student reports an item',
    text: 'The report reaches the API with the student’s JWT. The API validates it and checks that the student and category exist before accepting it.',
    source: 'code',
    nodes: ['expo', 'api'],
    edge: 'expoApi',
    direction: 'forward',
  },
  {
    id: 'save',
    title: 'The item is saved',
    text: 'The API saves the lost or found item to PostgreSQL through EF Core.',
    source: 'code',
    nodes: ['api', 'db'],
    edge: 'apiDb',
    direction: 'forward',
  },
  {
    id: 'trigger',
    title: 'The backend triggers n8n',
    text: 'After saving, the backend posts the item id and type (lost or found) to an n8n webhook, with a shared secret in the x-n8n-secret header. If the call fails it is logged and the report still succeeds.',
    source: 'code',
    nodes: ['api', 'n8n'],
    edge: 'apiN8n',
    direction: 'forward',
  },
  {
    id: 'candidates',
    title: 'n8n asks for candidates',
    text: 'n8n requests candidates from the backend, which checks the secret. Before any AI runs, the backend keeps only items of the opposite type, from the same university, with open status, in the same category, from a different student, within ±7 days, newest 20 only.',
    source: 'code',
    note: 'The endpoint and its filters are in the backend code. That n8n calls it is described in the project README.',
    nodes: ['n8n', 'api'],
    edge: 'apiN8n',
    direction: 'reverse',
  },
  {
    id: 'compare',
    title: 'Gemini compares the candidates',
    text: 'Gemini AI compares the new item with each candidate: name, description, colour, location, date, category and image URL.',
    source: 'readme',
    note: 'Documented in the project README. The n8n workflow that runs this step is not in the repository.',
    nodes: ['n8n', 'gemini'],
    edge: 'n8nGemini',
    direction: 'forward',
  },
  {
    id: 'return',
    title: 'n8n sends matches back',
    text: 'n8n posts each match to the backend with a match percentage (0–100), a confidence level and a reasoning summary. The backend rejects the request if any of those is missing or out of range.',
    source: 'code',
    nodes: ['n8n', 'api'],
    edge: 'apiN8n',
    direction: 'reverse',
  },
  {
    id: 'pending',
    title: 'The match is saved as Pending',
    text: 'The backend checks that both items exist, belong to different students, share a category and a university, and that the match is not already saved. Then it stores the match with status Pending.',
    source: 'code',
    nodes: ['api', 'db'],
    edge: 'apiDb',
    direction: 'forward',
  },
  {
    id: 'review',
    title: 'An admin reviews it',
    text: 'In the admin dashboard an admin sets the match to Confirmed or Rejected. Confirming marks both items Confirmed and sends each student a push notification if they have a push token; rejecting returns the items to open.',
    source: 'code',
    nodes: ['admin', 'api'],
    edge: 'adminApi',
    direction: 'reverse',
  },
]

export const traceSourceLabel: Record<TraceSource, string> = {
  code: 'Backend code',
  readme: 'Project README',
}
