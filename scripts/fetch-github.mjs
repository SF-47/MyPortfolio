// Build-time snapshot of public GitHub activity -> src/data/github.json.
// Reads the public contribution calendar (no token needed) and the public user API.
// If GitHub is unreachable, the previously committed snapshot is kept and the build continues.
import { writeFileSync } from "node:fs";

const USER = "SF-47";
const OUT = new URL("../src/data/github.json", import.meta.url);
const headers = { "User-Agent": "portfolio-build" };

try {
  const [html, user] = await Promise.all([
    fetch(`https://github.com/users/${USER}/contributions`, { headers }).then((r) => {
      if (!r.ok) throw new Error(`contributions: HTTP ${r.status}`);
      return r.text();
    }),
    fetch(`https://api.github.com/users/${USER}`, { headers }).then((r) => {
      if (!r.ok) throw new Error(`user: HTTP ${r.status}`);
      return r.json();
    }),
  ]);

  const days = new Map(); // cell id -> { date, level }
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const tag = m[0];
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const date = tag.match(/data-date="([^"]+)"/)?.[1];
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (id && date) days.set(id, { date, level, count: 0 });
  }
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const day = days.get(m[1]);
    const n = m[2].match(/^(\d[\d,]*) contribution/);
    if (day && n) day.count = Number(n[1].replace(/,/g, ""));
  }

  const list = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (list.length < 300) throw new Error(`calendar parse looks wrong (${list.length} days)`);

  const snapshot = {
    user: USER,
    fetchedAt: new Date().toISOString(),
    publicRepos: user.public_repos,
    total: list.reduce((s, d) => s + d.count, 0),
    activeDays: list.filter((d) => d.count > 0).length,
    days: list.map((d) => [d.date, d.count, d.level]),
  };
  writeFileSync(OUT, JSON.stringify(snapshot) + "\n");
  console.log(`github.json: ${snapshot.total} contributions on ${snapshot.activeDays} days, ${snapshot.publicRepos} public repos`);
} catch (err) {
  console.warn(`github.json not refreshed (${err.message}); keeping the existing snapshot.`);
}
