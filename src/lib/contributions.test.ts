import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCalendar, readCache, writeCache, toRows, TTL_MS } from "./contributions.ts";

test("parseCalendar reads total and days", () => {
  const c = parseCalendar({ total: { lastYear: 13433 }, contributions: [{ date: "2026-10-29", count: 17, level: 1 }] });
  assert.equal(c?.total, 13433);
  assert.equal(c?.days.length, 1);
});

test("parseCalendar rejects an error body", () => {
  assert.equal(parseCalendar({ error: "rate limited" }), null);
});

test("parseCalendar rejects empty contributions", () => {
  assert.equal(parseCalendar({ total: { lastYear: 0 }, contributions: [] }), null);
});

test("readCache survives a throwing storage", () => {
  const storage = { getItem() { throw new Error("SecurityError"); } } as unknown as Storage;
  assert.equal(readCache(storage, 0), null);
});

test("readCache ignores corrupt JSON", () => {
  const storage = { getItem: () => "{not json" } as unknown as Storage;
  assert.equal(readCache(storage, 0), null);
});

test("readCache marks fresh and stale by TTL", () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => map.set(k, v),
  } as unknown as Storage;
  const cal = { total: 1, days: [{ date: "2026-10-29", count: 1, level: 1 as const }] };
  writeCache(storage, cal, 1000);
  assert.equal(readCache(storage, 1000 + TTL_MS - 1)?.fresh, true);
  assert.equal(readCache(storage, 1000 + TTL_MS)?.fresh, false);
});

test("toRows pads the first week and maps levels", () => {
  // 2026-10-28 is a Wednesday
  const rows = toRows([{ date: "2026-10-28", count: 0, level: 0 }, { date: "2026-10-29", count: 9, level: 4 }], 53);
  assert.equal(rows.length, 7);
  assert.equal(rows[0], " ");
  assert.equal(rows[3], "·");
  assert.equal(rows[4], "█");
});

test("toRows keeps only the last maxWeeks columns", () => {
  const days = Array.from({ length: 70 }, (_, i) => ({
    date: new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10),
    count: 0,
    level: 0 as const,
  }));
  assert.equal(toRows(days, 3)[0].length, 3);
});
