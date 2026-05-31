# yankovs.com Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Gatsby 2 starter at yankovs.com with a fullscreen-terminal Astro site (5 routes, dark/light, single boot animation, deployed to Netlify).

**Architecture:** Astro 5 static site, MDX page content, Tailwind 4 for styling, zero JS frameworks. One vanilla-TS island for the home-page boot sequence. Deploys via `astro build` → `dist/` to existing Netlify project.

**Tech Stack:** Astro 5, TypeScript, Tailwind 4, MDX, JetBrains Mono (self-hosted via `@fontsource`), Netlify.

**Reference spec:** `docs/superpowers/specs/2026-05-31-yankovs-revamp-design.md`

---

## Task 1: Wipe Gatsby scaffolding, leave only spec and license

**Files:**
- Delete: everything in repo root except `LICENSE`, `.git/`, `docs/`, `dictionary.txt`, `markdownlint.js`, `README-GATSBY.md`
- Delete: `src/`, `gatsby-browser.js`, `gatsby-config.js`, `gatsby-node.js`, `gatsby-ssr.js`, `package.json`, `package-lock.json`, `README.md`, `dictionary.txt`, `markdownlint.js`, `README-GATSBY.md`

- [ ] **Step 1: Delete old files**

```bash
cd /home/blox-master/dev/yankovs.com
rm -rf src node_modules .cache public
rm -f gatsby-browser.js gatsby-config.js gatsby-node.js gatsby-ssr.js \
      package.json package-lock.json README.md dictionary.txt markdownlint.js \
      README-GATSBY.md
ls
```

Expected: `LICENSE`, `docs/`, `.git/` remain (plus any other dotfiles).

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove gatsby scaffolding"
```

---

## Task 2: Initialize Astro 5 + TypeScript

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Create package.json**

`package.json`:

```json
{
  "name": "yankovs.com",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/mdx": "^4.0.0",
    "@fontsource/jetbrains-mono": "^5.1.0",
    "@tailwindcss/vite": "^4.0.0",
    "astro": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://yankovs.com",
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules
dist
.astro
.env
.env.*
!.env.example
```

- [ ] **Step 5: Install and verify**

```bash
cd /home/blox-master/dev/yankovs.com
npm install
npx astro --version
```

Expected: version `5.x.x` printed.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "feat: scaffold astro 5 + typescript + tailwind 4"
```

---

## Task 3: Global styles, theme tokens, JetBrains Mono

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create src/styles/global.css**

```css
@import "tailwindcss";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/700.css";

@theme {
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

:root {
  --bg: #0d1117;
  --fg: #c9d1d9;
  --accent: #58a6ff;
  --dim: #6e7681;
  --border: #21262d;
}

:root[data-theme="light"] {
  --bg: #ffffff;
  --fg: #24292f;
  --accent: #0969da;
  --dim: #6e7781;
  --border: #d0d7de;
}

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  min-height: 100vh;
}

a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.dim {
  color: var(--dim);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: global theme tokens + jetbrains mono"
```

---

## Task 4: Terminal layout (status bar + body + nav)

**Files:**
- Create: `src/layouts/Terminal.astro`
- Create: `src/components/StatusBar.astro`
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create src/components/StatusBar.astro**

```astro
---
interface Props {
  route: string;
  updated?: string;
}
const { route, updated } = Astro.props;
const date = updated ?? new Date().toISOString().slice(0, 10);
---
<header class="border-b px-4 py-1 text-[13px] dim" style="border-color: var(--border)">
  <span>martin@yankovs.com</span>
  <span class="mx-2">·</span>
  <span>~{route}</span>
  <span class="mx-2">·</span>
  <span>{date}</span>
</header>
```

- [ ] **Step 2: Create src/components/Nav.astro**

```astro
---
interface Props {
  current: string;
}
const { current } = Astro.props;
const items = [
  { cmd: "cd about",    href: "/about" },
  { cmd: "cd now",      href: "/now" },
  { cmd: "cd building", href: "/building" },
  { cmd: "cd contact",  href: "/contact" },
  { cmd: "open blog.yankovs.com", href: "https://blog.yankovs.com", external: true },
];
---
<nav class="px-4 py-6 mt-8">
  {items.map(({ cmd, href, external }) => {
    const isCurrent = href === current;
    if (isCurrent) {
      return <div class="dim">$ {cmd}</div>;
    }
    return (
      <div>
        $ <a href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>{cmd}</a>
      </div>
    );
  })}
  <div class="mt-4">
    $ <button id="theme-toggle" class="underline" style="color: var(--accent); background: none; border: none; cursor: pointer; font: inherit;">theme toggle</button>
  </div>
</nav>
```

- [ ] **Step 3: Create src/layouts/Terminal.astro**

```astro
---
import "../styles/global.css";
import StatusBar from "../components/StatusBar.astro";
import Nav from "../components/Nav.astro";

interface Props {
  title: string;
  route: string;
  description?: string;
  updated?: string;
}
const { title, route, description, updated } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <script is:inline>
      (() => {
        const stored = localStorage.getItem("theme");
        const system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        const theme = stored ?? system ?? "dark";
        if (theme === "light") document.documentElement.dataset.theme = "light";
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <StatusBar route={route} updated={updated} />
    <main class="px-4 py-6 flex-1">
      <slot />
    </main>
    <Nav current={route} />
    <script>
      const btn = document.getElementById("theme-toggle");
      btn?.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        if (next === "light") document.documentElement.dataset.theme = "light";
        else delete document.documentElement.dataset.theme;
        localStorage.setItem("theme", next);
      });
    </script>
  </body>
</html>
```

- [ ] **Step 4: Create placeholder favicon**

`public/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#0d1117"/><text x="2" y="12" font-family="monospace" font-size="10" fill="#58a6ff">$</text></svg>
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/ src/components/ public/favicon.svg
git commit -m "feat: terminal layout, status bar, nav, theme toggle"
```

---

## Task 5: Static pages (about, now, building, contact)

**Files:**
- Create: `src/pages/about.astro`, `src/pages/now.astro`, `src/pages/building.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Create src/pages/about.astro**

```astro
---
import Terminal from "../layouts/Terminal.astro";
---
<Terminal title="Martin Yankov — about" route="/about" description="About Martin Yankov.">
  <p>Hi, I'm Martin.</p>
  <p class="mt-4">I build software. Cloud architect by trade, terminal addict, deep in AI agents.</p>
  <p class="mt-4">I work async, ship in small steps, and care about the user actually using what I build. I ask a lot of questions — the most expensive bug is building the wrong thing perfectly.</p>
  <p class="mt-4">Trilingual: English, German, Bulgarian.</p>
</Terminal>
```

- [ ] **Step 2: Create src/pages/now.astro**

```astro
---
import Terminal from "../layouts/Terminal.astro";
const updated = "2026-05-31";
---
<Terminal title="Martin Yankov — now" route="/now" description="What I'm working on right now." updated={updated}>
  <p class="dim">$ cat now.md</p>
  <ul class="mt-4 list-none">
    <li>· Building Blox.</li>
    <li>· Starting a trial role at Praven Intelekt on 2026-07-01.</li>
    <li>· Learning via lutherskills.</li>
  </ul>
  <p class="dim mt-8">Last updated {updated}.</p>
</Terminal>
```

- [ ] **Step 3: Create src/pages/building.astro**

```astro
---
import Terminal from "../layouts/Terminal.astro";
---
<Terminal title="Martin Yankov — building" route="/building" description="What I'm building.">
  <p class="dim">$ ls -la ~/building</p>
  <ul class="mt-4 list-none">
    <li>· <strong>Blox</strong> — construction platform · private</li>
    <li>· <a href="https://github.com/Lutherwaves/eopowers">eopowers</a> — Bulgarian public procurement</li>
    <li>· <a href="https://github.com/Lutherwaves/coinskills">coinskills</a> — personal finance</li>
    <li>· <a href="https://github.com/Lutherwaves/lutherskills">lutherskills</a> — learning workspace</li>
    <li>· <a href="https://debugmydinner.com">debugmydinner.com</a> — cooking blog</li>
  </ul>
</Terminal>
```

- [ ] **Step 4: Create src/pages/contact.astro**

```astro
---
import Terminal from "../layouts/Terminal.astro";
---
<Terminal title="Martin Yankov — contact" route="/contact" description="Contact Martin Yankov.">
  <p class="dim">$ cat contact.txt</p>
  <pre class="mt-4">email     <a href="mailto:martin@yankovs.com">martin@yankovs.com</a>
github    <a href="https://github.com/Lutherwaves">github.com/Lutherwaves</a>
linkedin  <a href="https://linkedin.com/in/mdyankov">linkedin.com/in/mdyankov</a>
blog      <a href="https://blog.yankovs.com">blog.yankovs.com</a></pre>
</Terminal>
```

- [ ] **Step 5: Verify dev server renders each route**

```bash
cd /home/blox-master/dev/yankovs.com
npm run dev &
sleep 5
curl -s http://localhost:4321/about | grep -q "Hi, I'm Martin" && echo OK
curl -s http://localhost:4321/now | grep -q "Building Blox" && echo OK
curl -s http://localhost:4321/building | grep -q "eopowers" && echo OK
curl -s http://localhost:4321/contact | grep -q "martin@yankovs.com" && echo OK
kill %1 2>/dev/null
```

Expected: four `OK` lines.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: about, now, building, contact pages"
```

---

## Task 6: Home page with boot animation island

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/BootSequence.astro`

- [ ] **Step 1: Create src/components/BootSequence.astro**

```astro
---
---
<div id="boot">
  <div id="boot-output" aria-live="polite"></div>
</div>

<script>
  const sequence = [
    { kind: "prompt", text: "$ whoami" },
    { kind: "out",    text: "Martin Yankov" },
    { kind: "prompt", text: "$ cat intro.md" },
    { kind: "out",    text: "Hi, I'm Martin." },
    { kind: "out",    text: "" },
    { kind: "out",    text: "Building Blox — dream big, build simple." },
    { kind: "out",    text: "Cloud architect by trade, terminal addict, deep in AI agents." },
  ];

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem("boot-played") === "1";
  const out = document.getElementById("boot-output")!;

  const appendLine = (s: { kind: string; text: string }) => {
    const line = document.createElement("div");
    if (s.kind === "prompt") line.className = "dim";
    line.textContent = s.text;
    out.appendChild(line);
    return line;
  };

  if (reduce || seen) {
    for (const s of sequence) appendLine(s);
  } else {
    sessionStorage.setItem("boot-played", "1");
    (async () => {
      for (const s of sequence) {
        const line = appendLine({ kind: s.kind, text: "" });
        if (s.kind === "prompt") {
          line.textContent = s.text;
          await new Promise((r) => setTimeout(r, 250));
        } else {
          for (const ch of s.text) {
            line.textContent += ch;
            await new Promise((r) => setTimeout(r, 30));
          }
        }
      }
    })();
  }
</script>
```

- [ ] **Step 2: Create src/pages/index.astro**

```astro
---
import Terminal from "../layouts/Terminal.astro";
import BootSequence from "../components/BootSequence.astro";
---
<Terminal title="Martin Yankov" route="/" description="Martin Yankov — building Blox.">
  <BootSequence />
</Terminal>
```

- [ ] **Step 3: Verify home renders and JS loads**

```bash
cd /home/blox-master/dev/yankovs.com
npm run build
ls dist/index.html
grep -c "boot-output" dist/index.html
```

Expected: file exists; grep prints `1`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/BootSequence.astro
git commit -m "feat: home page with boot sequence island"
```

---

## Task 7: Netlify deploy config

**Files:**
- Create: `netlify.toml`
- Create: `README.md`

- [ ] **Step 1: Create netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

- [ ] **Step 2: Create README.md**

```markdown
# yankovs.com

Personal site. Astro 5 + Tailwind 4. Deploys to Netlify.

## Develop

    npm install
    npm run dev

## Build

    npm run build
```

- [ ] **Step 3: Commit**

```bash
git add netlify.toml README.md
git commit -m "chore: netlify config + readme"
```

---

## Task 8: Type-check, build, and final verification

- [ ] **Step 1: Run Astro type-check**

```bash
cd /home/blox-master/dev/yankovs.com
npm run check
```

Expected: `0 errors, 0 warnings, 0 hints`.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build succeeds, `dist/` populated with `index.html`, `about/`, `now/`, `building/`, `contact/`.

- [ ] **Step 3: Serve and smoke-test**

```bash
npm run preview &
sleep 3
for path in / /about /now /building /contact; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$path")
  echo "$path -> $code"
done
kill %1 2>/dev/null
```

Expected: each line ends with `200`.

- [ ] **Step 4: Inspect JS budget**

```bash
du -bc dist/**/*.js 2>/dev/null | tail -1
```

Expected: total under ~10KB raw (we target <5KB gzipped — raw <10KB is the proxy).

- [ ] **Step 5: Final commit if any drift**

```bash
git status
# if anything unstaged from build artifacts (shouldn't be — dist is gitignored)
```

---

## Task 9: PR

- [ ] **Step 1: Push branch**

```bash
cd /home/blox-master/dev/yankovs.com
git push -u origin astro-revamp
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "Astro revamp: fullscreen terminal site" --body "$(cat <<'EOF'
## Summary
- Replace Gatsby 2 starter with Astro 5 + Tailwind 4
- Fullscreen-terminal aesthetic, 5 static routes (/, /about, /now, /building, /contact)
- One JS island: boot sequence on home (respects prefers-reduced-motion, session-cached)
- Dark default with system-aware light mode + persisted toggle
- Netlify deploy config; preview will build automatically

Design: docs/superpowers/specs/2026-05-31-yankovs-revamp-design.md
Plan: docs/superpowers/plans/2026-05-31-yankovs-revamp.md

## Test plan
- [ ] Netlify deploy preview loads each route 200
- [ ] Boot animation plays on first /, skipped on second visit
- [ ] Theme toggle persists across reload
- [ ] Lighthouse ≥95 on all metrics in preview

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Wait for Netlify preview, visually verify, then merge**

Inspect the preview URL Netlify posts on the PR. If good → squash-merge → delete branch.

---

## Out of scope (deferred)

- OG image
- Analytics
- Custom 404 page styling (Astro default is fine for now)
- Blog content (handled by separate `blog.yankovs.com` project)
