/**
 * Sample data for the Findly walkthrough. Nothing here comes from the real system:
 * people, campus, items, scores and AI reasoning were written for the demo.
 * The filter rules mirror N8nMatchingController.GetCandidates in the Findly backend.
 */

export type ItemStatus = "Open" | "Confirmed" | "Resolved";

export type Item = {
  id: string;
  name: string;
  category: string;
  color: string;
  location: string;
  /** yyyy-mm-dd */
  date: string;
  description: string;
  reporter: string;
  campus: string;
  status: ItemStatus;
};

export const CAMPUS = "Demo University, Main campus";

export const lostItem: Item = {
  id: "lost-1",
  name: "AirPods Pro case",
  category: "Electronics",
  color: "White",
  location: "Library, 2nd floor",
  date: "2026-11-03",
  description: "White charging case with both earbuds inside. Small scratch near the hinge.",
  reporter: "Karim Haddad",
  campus: CAMPUS,
  status: "Open",
};

/** Found reports already in the database when Karim submits. */
export const foundPool: Item[] = [
  {
    id: "f1",
    name: "White earbuds case",
    category: "Electronics",
    color: "White",
    location: "Library, study room B",
    date: "2026-11-04",
    description: "Small white charging case with two earbuds. Scratch on the side near the hinge.",
    reporter: "Lea Mansour",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f4",
    name: "AirPods case",
    category: "Electronics",
    color: "White",
    location: "Science building lobby",
    date: "2026-11-03",
    description: "White earbuds case found on a bench.",
    reporter: "Jad Fares",
    campus: "Demo University, North campus",
    status: "Open",
  },
  {
    id: "f2",
    name: "Wireless earphones",
    category: "Electronics",
    color: "Black",
    location: "Cafeteria",
    date: "2026-11-01",
    description: "Black neckband earphones left on a table near the window.",
    reporter: "Omar Khalil",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f5",
    name: "Earbuds in a white case",
    category: "Electronics",
    color: "White",
    location: "Library entrance",
    date: "2026-11-02",
    description: "Earbuds case handed to the front desk.",
    reporter: "Maya Aoun",
    campus: CAMPUS,
    status: "Confirmed",
  },
  {
    id: "f6",
    name: "Student ID card",
    category: "Documents",
    color: "Blue",
    location: "Library, 2nd floor",
    date: "2026-11-03",
    description: "University ID card on a study desk.",
    reporter: "Tala Nassar",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f3",
    name: "Phone charger",
    category: "Electronics",
    color: "White",
    location: "Engineering lab 3",
    date: "2026-11-06",
    description: "White USB-C wall charger with a short cable.",
    reporter: "Rania Saab",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f7",
    name: "Water bottle",
    category: "Personal items",
    color: "White",
    location: "Gym",
    date: "2026-11-04",
    description: "White metal bottle with stickers.",
    reporter: "Hadi Saleh",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f8",
    name: "Earbuds case",
    category: "Electronics",
    color: "White",
    location: "Library, 2nd floor",
    date: "2026-11-03",
    description: "Posted by mistake as found instead of lost.",
    reporter: "Karim Haddad",
    campus: CAMPUS,
    status: "Open",
  },
  {
    id: "f9",
    name: "AirPods case",
    category: "Electronics",
    color: "White",
    location: "Library, ground floor",
    date: "2026-10-21",
    description: "White case found under a chair.",
    reporter: "Nour Hamdan",
    campus: CAMPUS,
    status: "Open",
  },
];

export type Rule = {
  label: string;
  /** what the real LINQ query checks */
  code: string;
  /** shown on a removed item */
  reason: string;
  keep: (f: Item, lost: Item) => boolean;
};

const DAY = 86_400_000;
const withinDays = (a: string, b: string, days: number) => Math.abs(Date.parse(a) - Date.parse(b)) <= days * DAY;

export const rules: Rule[] = [
  { label: "Same campus", code: "UniversityId ==", reason: "Other campus", keep: (f, l) => f.campus === l.campus },
  { label: "Still open", code: 'Status == "open"', reason: "Already matched", keep: (f) => f.status === "Open" },
  { label: "Same category", code: "CategoryId ==", reason: "Different category", keep: (f, l) => f.category === l.category },
  { label: "Another student", code: "StudentId !=", reason: "Same reporter", keep: (f, l) => f.reporter !== l.reporter },
  { label: "Within 7 days", code: "FoundDate ± 7d", reason: "Outside 7 days", keep: (f, l) => withinDays(f.date, l.date, 7) },
];

/** The query also takes the 20 newest candidates; the sample pool never reaches that cap. */
export const CANDIDATE_CAP = 20;

/**
 * Index of the first rule (among the first `applied`) that removes the item, or -1 if it survives.
 * Same order as the backend query, so an item is blamed on the first rule it fails.
 */
export function removedBy(item: Item, applied: number, lost: Item = lostItem): number {
  for (let i = 0; i < Math.min(applied, rules.length); i++) {
    if (!rules[i].keep(item, lost)) return i;
  }
  return -1;
}

export const candidates = foundPool.filter((f) => removedBy(f, rules.length) === -1);

export const THRESHOLD = 70;

export type Score = { percent: number; confidence: "High" | "Medium" | "Low"; reasoning: string };

export const scores: Record<string, Score> = {
  f1: {
    percent: 86,
    confidence: "High",
    reasoning:
      "Both reports describe a white earbuds charging case in the library, one day apart. Each mentions a scratch near the hinge. The found report does not confirm the brand.",
  },
  f2: {
    percent: 54,
    confidence: "Medium",
    reasoning: "Same category and dates, but black neckband earphones are a different object from a white charging case, found in another building.",
  },
  f3: {
    percent: 31,
    confidence: "Low",
    reasoning: "Only the color and category match. A wall charger is not an earbuds case.",
  },
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
