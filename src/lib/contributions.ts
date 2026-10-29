export type Level = 0 | 1 | 2 | 3 | 4;
export type Day = { date: string; count: number; level: Level };
export type Calendar = { total: number; days: Day[] };

export const API_URL = "https://github-contributions-api.jogruber.de/v4/Lutherwaves?y=last";
export const CACHE_KEY = "contributions:v1";
export const TTL_MS = 12 * 60 * 60 * 1000;
export const LEVEL_CHARS = "·░▒▓█";

const isDay = (d: unknown): d is Day => {
  if (typeof d !== "object" || d === null) return false;
  const { date, count, level } = d as Record<string, unknown>;
  return (
    typeof date === "string" &&
    typeof count === "number" &&
    typeof level === "number" &&
    Number.isInteger(level) &&
    level >= 0 &&
    level <= 4
  );
};

export function parseCalendar(json: unknown): Calendar | null {
  if (typeof json !== "object" || json === null) return null;
  const { total, contributions } = json as Record<string, unknown>;
  const lastYear = (total as Record<string, unknown> | null | undefined)?.lastYear;
  if (typeof lastYear !== "number") return null;
  if (!Array.isArray(contributions) || contributions.length === 0) return null;
  if (!contributions.every(isDay)) return null;
  return { total: lastYear, days: contributions };
}

export function readCache(storage: Storage | null, now: number): { calendar: Calendar; fresh: boolean } | null {
  try {
    const raw = storage?.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, calendar } = JSON.parse(raw);
    const parsed = parseCalendar({ total: { lastYear: calendar?.total }, contributions: calendar?.days });
    if (!parsed || typeof savedAt !== "number") return null;
    return { calendar: parsed, fresh: now - savedAt < TTL_MS };
  } catch {
    return null;
  }
}

export function writeCache(storage: Storage | null, calendar: Calendar, now: number): void {
  try {
    storage?.setItem(CACHE_KEY, JSON.stringify({ savedAt: now, calendar }));
  } catch {}
}

export function toRows(days: Day[], maxWeeks: number): string[] {
  const first = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cells = [...Array(first).fill(" "), ...days.map((d) => LEVEL_CHARS[d.level])];
  const weeks: string[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const shown = weeks.slice(-Math.max(1, maxWeeks));
  return Array.from({ length: 7 }, (_, row) => shown.map((week) => week[row] ?? " ").join(""));
}
