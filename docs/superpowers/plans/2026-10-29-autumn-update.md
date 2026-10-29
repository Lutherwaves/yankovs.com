# yankovs.com autumn update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring yankovs.com up to date around Martin's why, add a live contribution chart on `/`, and add a `/sponsor` page with a ♥ in the nav.

**Architecture:** Copy edits in the existing Astro pages. The chart is a pure TypeScript module (parse, cache, grid) tested with `node --test`, plus an Astro component whose inline script fetches in the browser. `/sponsor` is a new static page in the `Terminal` layout. No server, no adapter, no build-time fetch.

**Tech Stack:** Astro 5, Tailwind 4, TypeScript, `node:test` (Node 24 strips types natively; no new dependency), Playwright MCP for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-27-autumn-update-design.md`. Every copy string comes from its **Copy** section verbatim; do not paraphrase.

## Global Constraints

- Prose has no em dashes. List rows keep the `—` separator.
- The builders' OS company name never appears in `src/`.
- No job title for Lexroom.
- No Netlify functions, adapters, build-time fetches or new runtime dependencies.
- Every `localStorage` read and write sits in try/catch.
- The chart never shows an empty grid or a zero. The failure line is `contributions unavailable · see github.com/Lutherwaves`, linked to `https://github.com/Lutherwaves`.
- No horizontal page scroll at 375px.
- Commits: signed Conventional Commits, no `--no-verify`, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Nothing is pushed until Martin says so.

## Review Focus

1. API answers 200 with an unexpected body (`{"error": ...}`, empty `contributions`) → failure line, not an empty grid. Test in Task 2.
2. `localStorage` throws on access (Safari with blocked storage) → chart still renders from the network. Test in Task 2.
3. Cached value is corrupt JSON or an old shape → treated as no cache. Test in Task 2.
4. Window is resized from 1280px to 375px after render → grid redraws to fit, no sideways scroll. Check in Task 3.
5. JavaScript is off → the static HTML shows the GitHub link, not a blank block. Check in Task 3.

---

### Task 1: Copy for `/`, `/about`, `/now`, `/building`

**Files:**
- Modify: `src/components/BootSequence.astro` (the `sequence` array)
- Modify: `src/pages/about.astro`
- Modify: `src/pages/now.astro` (list and `updated`)
- Modify: `src/pages/building.astro`

**Interfaces:**
- Produces: `BootSequence` sets `document.documentElement.dataset.boot = "done"` and dispatches `document.dispatchEvent(new Event("boot:done"))` when the last line is written, on every path (animated, reduced motion, replayed session). Task 3 relies on both.

- [ ] **Step 1: Branch from the merged main**

Run: `git fetch origin && git switch -c feat/autumn-update origin/main`
Expected: `Switched to a new branch 'feat/autumn-update'`

- [ ] **Step 2: Replace the boot `sequence`** with the spec's `/` boot copy. `#` comment lines use `kind: "prompt"` (dim) and render instantly like prompts. Add the `boot:done` signal from Interfaces.

- [ ] **Step 3: Replace `/about` paragraphs** with the spec's `/about` copy. "sponsor each other" links to `/sponsor`.

- [ ] **Step 4: Replace the `/now` list** with the spec's five rows and set `updated` to the ship date (`YYYY-MM-DD`, today).

- [ ] **Step 5: Replace the `/building` list** with the spec's ten rows, in the spec's order, with the spec's links. "the OS for modern builders" is plain text with no link. Tags (`· current`, `· iOS in TestFlight`) use `class="dim"` on a trailing `<span>`.

- [ ] **Step 6: Build and grep the output**

Run: `npm run build && rg -c "legal OS for modern lawyers" dist/about/index.html dist/now/index.html dist/building/index.html && rg -n "stealth|Full Stack|Heads-down" dist/ ; rg -n "builder —" src/components/BootSequence.astro`
Expected: build succeeds, one count per page, and no matches for the last two searches.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/specs/2026-10-27-autumn-update-design.md docs/superpowers/plans/2026-10-29-autumn-update.md src/components/BootSequence.astro src/pages/about.astro src/pages/now.astro src/pages/building.astro
git commit -S -m "feat: lead with the why, add autumn launches and Lexroom"
```

### Task 2: Contributions logic module

**Files:**
- Create: `src/lib/contributions.ts`
- Create: `src/lib/contributions.test.ts`
- Modify: `package.json` (add `"test": "node --test 'src/lib/*.test.ts'"`)

**Interfaces:**
- Produces:
  - `type Level = 0 | 1 | 2 | 3 | 4`
  - `type Day = { date: string; count: number; level: Level }`
  - `type Calendar = { total: number; days: Day[] }`
  - `const API_URL = "https://github-contributions-api.jogruber.de/v4/Lutherwaves?y=last"`
  - `const CACHE_KEY = "contributions:v1"`, `const TTL_MS = 12 * 60 * 60 * 1000`
  - `const LEVEL_CHARS = "·░▒▓█"`
  - `parseCalendar(json: unknown): Calendar | null`: reads `total.lastYear` and `contributions`; null if either is missing, the wrong type, or `contributions` is empty.
  - `readCache(storage: Storage | null, now: number): { calendar: Calendar; fresh: boolean } | null`: null on a missing key, a throw, bad JSON or a failed `parseCalendar`; `fresh` is `now - savedAt < TTL_MS`.
  - `writeCache(storage: Storage | null, calendar: Calendar, now: number): void`: stores `{ savedAt, calendar }`; swallows throws.
  - `toRows(days: Day[], maxWeeks: number): string[]`: 7 strings, Sunday first. Columns are weeks, oldest left. Days before the first day's weekday pad with a space. Keeps only the last `maxWeeks` columns.

- [ ] **Step 1: Write the failing tests** in `src/lib/contributions.test.ts` (`import { test } from "node:test"`, `import assert from "node:assert/strict"`, import from `"./contributions.ts"`):

```ts
test("parseCalendar reads total and days", () => {
  const c = parseCalendar({ total: { lastYear: 13433 }, contributions: [{ date: "2026-10-29", count: 17, level: 1 }] });
  assert.equal(c?.total, 13433);
  assert.equal(c?.days.length, 1);
});
test("parseCalendar rejects an error body", () => assert.equal(parseCalendar({ error: "rate limited" }), null));
test("parseCalendar rejects empty contributions", () =>
  assert.equal(parseCalendar({ total: { lastYear: 0 }, contributions: [] }), null));
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
  const storage = { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => map.set(k, v) } as unknown as Storage;
  const cal = { total: 1, days: [{ date: "2026-10-29", count: 1, level: 1 as const }] };
  writeCache(storage, cal, 1000);
  assert.equal(readCache(storage, 1000 + TTL_MS - 1)?.fresh, true);
  assert.equal(readCache(storage, 1000 + TTL_MS)?.fresh, false);
});
test("toRows pads the first week and maps levels", () => {
  // 2026-10-28 is a Wednesday (weekday 3)
  const rows = toRows([{ date: "2026-10-28", count: 0, level: 0 }, { date: "2026-10-29", count: 9, level: 4 }], 53);
  assert.equal(rows.length, 7);
  assert.equal(rows[0], " ");
  assert.equal(rows[3], "·");
  assert.equal(rows[4], "█");
});
test("toRows keeps only the last maxWeeks columns", () => {
  const days = Array.from({ length: 70 }, (_, i) => ({ date: new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10), count: 0, level: 0 as const }));
  assert.equal(toRows(days, 3)[0].length, 3);
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm test`
Expected: FAIL, `Cannot find module` / missing export.

- [ ] **Step 3: Implement `src/lib/contributions.ts`** with the Interfaces above. Use UTC for weekday math (`new Date(date + "T00:00:00Z").getUTCDay()`).

- [ ] **Step 4: Run the tests and `astro check`**

Run: `npm test && npx astro check`
Expected: 8 passing, 0 failing; `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contributions.ts src/lib/contributions.test.ts package.json
git commit -S -m "feat: contributions calendar parse, cache and grid"
```

### Task 3: Contribution chart and sponsor link on `/`

**Files:**
- Create: `src/components/Contributions.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Task 1's `data-boot="done"` / `boot:done`; Task 2's exports.

- [ ] **Step 1: Build `Contributions.astro`.** Markup, inside a wrapper hidden until boot is done:
  - `$ git contributions --last-year` (dim prompt)
  - a label line: `{total formatted with toLocaleString("en-US")} contributions · github.com/Lutherwaves` (linked)
  - a `<pre aria-hidden="true">` grid: `Mon`, `Wed`, `Fri` labels on rows 1, 3, 5 (blank labels elsewhere), glyphs in `var(--accent)`, then the legend `less ·░▒▓█ more` (dim)
  - static HTML before the script runs: the failure line with its link, so a no-JS visitor still gets a way out
  - after the chart: `$ <a href="/sponsor">cd sponsor ♥</a>`

  Script flow: `readCache(localStorage-or-null)`; when a cache exists, render it; when there's no fresh cache, `fetch(API_URL)` → `parseCalendar` → render + `writeCache`; a fetch or parse failure with no cache leaves the failure line. `maxWeeks` = whole glyph columns that fit the `<pre>`'s parent width minus the 4-character label (measure one glyph's width with a hidden span). Rerender on `resize`. Reveal the wrapper when `document.documentElement.dataset.boot === "done"`, or on `boot:done`.

- [ ] **Step 2: Add `<Contributions />` after `<BootSequence />`** in `src/pages/index.astro`.

- [ ] **Step 3: Check it in the browser** (`npm run dev`, then Playwright MCP on `http://localhost:4321/`):
  1. Live: the grid appears after the boot types out; the label shows a number above 0.
  2. Cache: reload; `browser_network_requests` shows no call to `jogruber`.
  3. Blocked: clear storage, block `**/github-contributions-api.jogruber.de/**` with `browser_run_code_unsafe` (`page.route(..., r => r.abort())`), reload → the failure line shows, with no grid.
  4. Width: resize 1280 → 375; `document.documentElement.scrollWidth <= 375` is true and the grid shows fewer weeks.
  5. No JS: `browser_run_code_unsafe` with a context that has `javaScriptEnabled: false` → the failure line and link show.
  6. Theme: toggle; the grid follows the accent colour.

  Expected: all six as described. Save screenshots at 1280 and 375 to the scratchpad.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contributions.astro src/pages/index.astro
git commit -S -m "feat: live contribution chart on the home page"
```

### Task 4: `/sponsor` page and the nav ♥

**Files:**
- Create: `src/pages/sponsor.astro`
- Modify: `src/components/Nav.astro` (`items`)

- [ ] **Step 1: Add `{ cmd: "cd sponsor ♥", href: "/sponsor" }`** after `cd building` in `items`.

- [ ] **Step 2: Build `sponsor.astro`** in `Terminal` (title `Martin Yankov — sponsor`, route `/sponsor`, description `Sponsor Martin's open source.`) with the spec's `/sponsor` copy. Bills: shares out of 20 cells, `claude code` 16, `apple developer` 5, `github ci/cd` 4, `domains` 2; filled `█`, empty `░`. Below 640px (Tailwind `sm`), bars are 10 cells (shares halved, rounded up) and each note sits on its own dim line under its bar. Links under `~/sponsoring`: open-webui → `https://github.com/sponsors/open-webui`, llama.cpp → `https://github.com/sponsors/ggerganov`, openclaw → `https://github.com/sponsors/openclaw` (all three returned 200 on 2026-10-29). `★ star a repo` → `https://github.com/Lutherwaves`. The final button is a link styled like the theme-toggle button: `♥ sponsor on github` → `https://github.com/sponsors/Lutherwaves`.

- [ ] **Step 3: Check it in the browser** at 1280 and 375, light and dark: all copy shows, bars align in columns, `scrollWidth <= 375` at 375, and the nav shows `cd sponsor ♥` dimmed on `/sponsor`.
Expected: all true. Save screenshots to the scratchpad.

- [ ] **Step 4: Commit**

```bash
git add src/pages/sponsor.astro src/components/Nav.astro
git commit -S -m "feat: sponsor page and nav heart"
```

### Task 5: Final check and hand-off

- [ ] **Step 1: Run every gate**

Run: `npm test && npx astro check && npm run build && git diff origin/main --name-only && git diff origin/main -- src | rg -in "$PRIVATE_NAME"`
Expected: tests pass, `0 errors`, build succeeds, and the last search prints nothing (`PRIVATE_NAME` is set from Martin's private notes, never written in this repo).

- [ ] **Step 2: Publish the screenshots as one artifact** for Martin's copy review: each page at 1280 and 375, plus the chart failure state.

- [ ] **Step 3: Stop.** Ask Martin to review the copy (including the estimated bill shares and the line "If it doesn't, I rebuild it.") and to say whether to push `feat/autumn-update` and open a pull request (Netlify builds a deploy preview from it).
