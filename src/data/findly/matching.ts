// The backend candidate filter, in the order it is applied in
// backend/Controllers/N8nMatchingController.cs (GET /n8n/matching/candidates).
// "Opposite item type" is implicit: a lost item is matched against the found-items table and
// the reverse. The limit is applied by the backend, before any AI step. `condition` is the
// criterion as written in that query (shortened). The database runs the Where clauses as one
// query; the order here is the order they appear in the code.
export type MatchingStage = { id: string; label: string; detail: string; condition: string }

export const matchingStages: MatchingStage[] = [
  { id: 'type', label: 'Opposite item type', detail: 'A lost report is compared with found items, and a found report with lost items.', condition: 'query FoundItems for a lost report, LostItems for a found report' },
  { id: 'university', label: 'Same university', detail: 'Both students belong to the same university.', condition: 'Student.UniversityId == newItem.Student.UniversityId' },
  { id: 'status', label: 'Open status', detail: 'Only items that are still open.', condition: 'Status.ToLower() == "open"' },
  { id: 'category', label: 'Same category', detail: 'Items must share a category.', condition: 'CategoryId == newItem.CategoryId' },
  { id: 'student', label: 'Different student', detail: 'An item is never matched with the same student’s own report.', condition: 'StudentId != newItem.StudentId' },
  { id: 'window', label: 'Within ±7 days', detail: 'The lost or found date is within seven days either side.', condition: 'date >= newItem.date − 7 days && date <= newItem.date + 7 days' },
  { id: 'limit', label: 'Newest 20 only', detail: 'Ordered by creation time, newest first; at most 20 are returned.', condition: 'OrderByDescending(CreatedAt).Take(20)' },
]
