# yankovs.com revamp — design

**Date:** 2026-05-31
**Owner:** Martin Yankov
**Status:** Approved

## Purpose

Replace the current Gatsby 2 / React 16 starter at yankovs.com with a modern, fullscreen-terminal personal site. Personal substance: identity, current focus (Blox), what I'm building, contact. Writing lives on `blog.yankovs.com` (separate project, next).

## Non-goals

- Blog content or RSS (handled by `blog.yankovs.com`)
- Analytics
- CMS, comments, search
- Animations beyond a single boot sequence

## Stack

- **Astro 5** with TypeScript
- **Tailwind 4**
- **MDX** for page content (Astro content collections)
- **Zero JS islands by default.** One vanilla-TS island for the boot typing sequence on `/`.
- **Deploy:** Netlify (keep current host); Astro static adapter; `netlify.toml` at repo root.
- **Node:** LTS (currently 22).
- **Package manager:** npm (match current).

## Pages (5 static routes)

| Route       | Content source                | Purpose                                                         |
|-------------|-------------------------------|-----------------------------------------------------------------|
| `/`         | `src/content/pages/home.mdx`  | Boot sequence → typed intro → static greeting + nav             |
| `/about`    | `src/content/pages/about.mdx` | Short bio + how I work. ~200 words. No résumé. No photo.        |
| `/now`      | `src/content/pages/now.mdx`   | What I'm doing right now (Blox, learning). [nownownow] style.   |
| `/building` | `src/content/pages/building.mdx` | One-line each: Blox, eopowers, coinskills, lutherskills, debugmydinner. |
| `/contact`  | `src/content/pages/contact.mdx` | Email, LinkedIn, GitHub, blog link.                            |

Writing/blog → external link to `https://blog.yankovs.com` (no internal route).

## Aesthetic — fullscreen terminal

### Layout

- Single layout component wraps every page edge-to-edge (`100vw` × `100vh`, no max-width).
- **Top status bar (1 line):** `martin@yankovs.com  ~/{route}  · {ISO date of last content edit}`. Subtle border-bottom.
- **Body region:** terminal-style content. Left-aligned, monospace, no decorative chrome.
- **Footer nav (rendered on every page):** lines styled as commands. Click navigates.
  ```
  $ cd about
  $ cd now
  $ cd building
  $ cd contact
  $ open blog.yankovs.com
  ```
  The current-page command is rendered dim (no strikethrough) and is non-clickable.

### Typography & color

- **Font:** JetBrains Mono via `@fontsource/jetbrains-mono` (self-hosted, no Google CDN).
- **Sizes:** body 15–16px; status bar 13px; no header sizes — body weight + spacing carries hierarchy.
- **Dark default:** bg `#0d1117`, fg `#c9d1d9`, accent `#58a6ff`, dim `#6e7681`.
- **Light mode:** bg `#ffffff`, fg `#24292f`, accent `#0969da`, dim `#6e7781`.
- **Theme toggle:** precedence is `localStorage` → `prefers-color-scheme` → dark default. Toggle accessible via a `$ theme toggle` link in the nav; writes to `localStorage`.

### Boot animation (the only animation)

- On `/` first load only. After a navigation away and back, skip the animation (`sessionStorage` flag).
- Sequence (~1.2s total):
  1. Status bar appears immediately.
  2. Typed line: `$ whoami`
  3. Output: `Martin Yankov`
  4. Typed line: `$ cat intro.md`
  5. Output: the homepage paragraph appears character-by-character at ~30 chars/sec.
  6. Cursor lands on the nav.
- Implementation: one vanilla-TS file, `<script>` island, ≤ 80 LOC. No framework.
- Respects `prefers-reduced-motion`: animation is skipped, content rendered instantly.

## Content (initial drafts)

### `/` home
```
Hi, I'm Martin.

Building Blox — dream big, build simple.
Cloud architect by trade, terminal addict, deep in AI agents.
```

### `/about`
Short, first-person, ~200 words. Same modest tone as the README. Covers: who I am, how I work (terminal-first, async-first, ship-and-iterate), what I value (simplicity, value-driven, user-obsessed). No employer list. Trilingual mention OK.

### `/now`
- Building Blox (no link, private)
- Trial role at Praven Intelekt starting 2026-07-01
- Learning: <current topic from lutherskills>
- Last updated: `<date>`

### `/building`
One line per item, with link where public:
- **Blox** — construction platform; private
- **[eopowers](https://github.com/Lutherwaves/eopowers)** — Bulgarian public procurement
- **[coinskills](https://github.com/Lutherwaves/coinskills)** — personal finance
- **[lutherskills](https://github.com/Lutherwaves/lutherskills)** — learning workspace
- **[debugmydinner.com](https://debugmydinner.com)** — cooking blog

### `/contact`
```
$ cat contact.txt

email     martin@yankovs.com
github    github.com/Lutherwaves
linkedin  linkedin.com/in/mdyankov
blog      blog.yankovs.com
```

## File structure

```
yankovs.com/
├─ astro.config.mjs
├─ tailwind.config.mjs
├─ netlify.toml
├─ package.json
├─ tsconfig.json
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ layouts/
│  │  └─ Terminal.astro          # status bar + body slot + nav
│  ├─ components/
│  │  ├─ StatusBar.astro
│  │  ├─ Nav.astro
│  │  ├─ ThemeToggle.astro
│  │  └─ BootSequence.astro      # script island for /
│  ├─ content/
│  │  ├─ config.ts               # collections schema
│  │  └─ pages/{home,about,now,building,contact}.mdx
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ about.astro
│  │  ├─ now.astro
│  │  ├─ building.astro
│  │  └─ contact.astro
│  └─ styles/
│     └─ global.css              # tailwind directives + theme vars
└─ docs/
   └─ superpowers/
      └─ specs/
         └─ 2026-05-31-yankovs-revamp-design.md
```

## Migration plan

- **Wipe** `src/`, `gatsby-*.js`, `markdownlint.js`, `dictionary.txt`, `README-GATSBY.md`.
- **Keep** `LICENSE`, replace `README.md` with a one-line description + dev instructions.
- **Drop dependencies:** all `gatsby-*`, `@fortawesome/*`, `react`, `react-dom`, `react-helmet`, `react-typist`, `react-delay`, `prop-types`.
- **Add dependencies:** `astro`, `@astrojs/mdx`, `@astrojs/check`, `@tailwindcss/vite`, `tailwindcss`, `@fontsource/jetbrains-mono`, `typescript`.
- **No content to port.** Old `src/content/` had two stub project markdowns and a terminal index; new content is written fresh per `/building`, `/now`.
- **`about-picture.jpg`** and other images: deleted.
- **Branch:** `astro-revamp`. PR into `main`. Netlify will pick up the new build via `astro build` → `dist/`.

## Netlify config

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

No redirects needed (no old URLs survive — all current routes are being replaced; the only live URL is `/`).

## Accessibility & SEO

- Semantic HTML (`<header>` for status bar, `<main>` for body, `<nav>` for commands).
- Page titles set per route (`Martin Yankov — about`, etc.).
- Meta description per page (from MDX frontmatter).
- OpenGraph image: simple terminal screenshot SVG generated at build time, or a single static file. (YAGNI: ship without OG image first; add if needed.)
- `prefers-reduced-motion` honored in boot sequence.
- Color contrast: verify both themes pass WCAG AA against `#c9d1d9` and `#24292f` foregrounds.

## Risks & open questions

- **Custom domain on Netlify** — already configured for the current site. Verify branch deploys preview correctly before promoting the new build. No DNS changes required.
- **OG image** — deferred. Acceptable for a personal site to ship without one.
- **`/now` content rot** — by definition this page goes stale. No tooling solution; intent is "I'll update it when I update it." Footer shows last-edit date.

## Success criteria

- Lighthouse 100/100/100/100 on production.
- Total JS shipped < 5KB gzipped (boot script + theme toggle only).
- First Contentful Paint < 500ms on a cold cache, fast 3G.
- Time-to-edit-content < 30s (open MDX, write, save, commit).
