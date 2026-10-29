import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCalendar, readCache, writeCache, toWeeks, monthLabels, TTL_MS } from "./contributions.ts";

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

const day = (date: string, level: 0 | 1 | 2 | 3 | 4 = 0) => ({ date, count: level, level });

test("toWeeks pads the first week with nulls, Sunday first", () => {
  // 2026-10-28 is a Wednesday
  const weeks = toWeeks([day("2026-10-28"), day("2026-10-29", 4)]);
  assert.equal(weeks.length, 1);
  assert.deepEqual(weeks[0].slice(0, 3), [null, null, null]);
  assert.equal(weeks[0][3]?.date, "2026-10-28");
  assert.equal(weeks[0][4]?.level, 4);
  assert.equal(weeks[0].length, 5);
});

test("toWeeks starts a new column every Sunday", () => {
  const days = Array.from({ length: 70 }, (_, i) => day(new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10)));
  assert.equal(toWeeks(days).length, 10);
});

test("monthLabels names a month on the first week it starts in", () => {
  // Sundays 2026-09-13, 09-20, 09-27, 10-04, 10-11
  const days = Array.from({ length: 35 }, (_, i) => day(new Date(Date.UTC(2026, 8, 13 + i)).toISOString().slice(0, 10)));
  assert.deepEqual(monthLabels(toWeeks(days)), ["Sep", "", "", "Oct", ""]);
});

test("monthLabels drops a label when the next month starts within two weeks", () => {
  // Sundays 2026-10-25, 11-01, 11-08: Oct gets one column before Nov
  const days = Array.from({ length: 21 }, (_, i) => day(new Date(Date.UTC(2026, 9, 25 + i)).toISOString().slice(0, 10)));
  assert.deepEqual(monthLabels(toWeeks(days)), ["", "Nov", ""]);
});
