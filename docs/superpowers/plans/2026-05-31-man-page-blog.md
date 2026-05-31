# man-page Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog at `yankovs.com/blog` whose posts render like Unix man pages, matching the site's fullscreen-terminal aesthetic, with an RSS feed.

**Architecture:** Astro 5 content collection (`blog`) of MDX files loaded via the glob loader. A `ManPage.astro` layout wraps post bodies in NAME/DESCRIPTION man structure and reuses the existing `Terminal.astro` shell. `/blog` lists posts man-apropos style; `/blog/[slug]` renders each post; `/rss.xml` emits a feed.

**Tech Stack:** Astro 5, MDX (`@astrojs/mdx`, already installed), `@astrojs/rss`, Tailwind 4, TypeScript.

**Testing note:** This project has no unit-test runner, and adding one for a static personal blog is out of scope (YAGNI). Each task's gate is `npm run build` (astro check + build) plus a stated manual verification. `npm run build` runs `astro check && astro build` per package.json.

---

### Task 1: Content collection + schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create the collection config**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    section: z.number().default(1),
    summary: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Commit** (build verification happens in Task 2 once a post exists)

```bash
git add src/content.config.ts
git commit -m "feat: blog content collection schema"
```

---

### Task 2: Seed inaugural post

**Files:**
- Create: `src/content/blog/building-a-terminal-blog.mdx`

- [ ] **Step 1: Write the post**

```mdx
---
title: building-a-terminal-blog
section: 1
summary: building a blog that reads like a man page
date: 2026-05-31
---

## Synopsis

`cat ~/blog/building-a-terminal-blog.mdx`

## Description

This blog renders like a Unix man page. Posts are MDX files; the layout wraps
them in the familiar NAME / DESCRIPTION structure, caps the section headings, and
footers each page with `YANKOVS(1)` and the date.

Write a post by dropping an `.mdx` file in `src/content/blog`. The `##` headings
become man-style section headers automatically.

## See also

`ls ~/blog`, `/rss.xml`
```

- [ ] **Step 2: Build to verify the collection + post parse**

Run: `npm run build`
Expected: PASS — astro check reports 0 errors; build completes. (No `/blog` route yet; that's Task 4.)

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/building-a-terminal-blog.mdx
git commit -m "feat: inaugural blog post"
```

---

### Task 3: ManPage layout

**Files:**
- Create: `src/layouts/ManPage.astro`

Reuses `Terminal.astro` (StatusBar, Nav, theme, fonts). Renders the man structure around the post body passed as a slot. Caps-section styling for `##` headings is scoped to `.manpage`.

- [ ] **Step 1: Write the layout**

```astro
---
import Terminal from "./Terminal.astro";
interface Props {
  title: string;
  section: number;
  summary: string;
  date: string;
}
const { title, section, summary, date } = Astro.props;
---
<Terminal title={`${title}(${section}) — yankovs.com`} route="/blog" description={summary}>
  <article class="manpage">
    <p class="section-head">NAME</p>
    <p class="indent">{title} – {summary}</p>

    <p class="section-head mt-6">DESCRIPTION</p>
    <div class="indent">
      <slot />
    </div>

    <footer class="manpage-footer dim mt-12">
      <span>YANKOVS({section})</span>
      <span>{date}</span>
    </footer>
  </article>
</Terminal>

<style is:global>
  .manpage .section-head {
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .manpage .indent { margin-left: 2rem; }
  /* MDX `##` headings render as man-style section headers */
  .manpage h2 {
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    font-size: 1rem;
    margin: 1.5rem 0 0.5rem;
  }
  .manpage h2 + * { margin-left: 0; }
  .manpage-footer {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: 0.5rem;
    font-size: 13px;
  }
</style>
```

- [ ] **Step 2: Commit** (rendered + verified via the post route in Task 5)

```bash
git add src/layouts/ManPage.astro
git commit -m "feat: man-page layout"
```

---

### Task 4: Blog index page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Write the index**

```astro
---
import Terminal from "../../layouts/Terminal.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const fmt = (d: Date) => d.toISOString().slice(0, 10);
---
<Terminal title="Martin Yankov — blog" route="/blog" description="Notes, rendered like man pages.">
  <p class="dim">$ ls ~/blog</p>
  <ul class="mt-4 list-none">
    {posts.map((p) => (
      <li class="blog-entry">
        <a href={`/blog/${p.id}`}>{p.data.title}({p.data.section})</a>
        <span class="ml-2">{p.data.summary}</span>
        <span class="dim ml-2">{fmt(p.data.date)}</span>
      </li>
    ))}
  </ul>
  <p class="dim mt-8">$ <a href="/rss.xml">cat rss.xml</a></p>
</Terminal>
```

- [ ] **Step 2: Build and serve, verify the index**

Run: `npm run build && npm run preview`
Expected: PASS. Visit `/blog` — shows `$ ls ~/blog`, the inaugural post entry `building-a-terminal-blog(1)` with summary + date, and the rss link. Stop preview (Ctrl-C).

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: blog index (ls ~/blog)"
```

---

### Task 5: Blog post route

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Write the dynamic route**

```astro
---
import ManPage from "../../layouts/ManPage.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const date = post.data.date.toISOString().slice(0, 10);
---
<ManPage
  title={post.data.title}
  section={post.data.section}
  summary={post.data.summary}
  date={date}
>
  <Content />
</ManPage>
```

- [ ] **Step 2: Build and serve, verify the post**

Run: `npm run build && npm run preview`
Expected: PASS. Visit `/blog/building-a-terminal-blog` — renders NAME/DESCRIPTION, the `##` headings appear as caps section headers, footer shows `YANKOVS(1)` left and the date right. Theme toggle + nav present. Stop preview.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/blog/[slug].astro"
git commit -m "feat: blog post route with man-page rendering"
```

---

### Task 6: RSS feed

**Files:**
- Modify: `package.json` (add dependency)
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Install @astrojs/rss**

Run: `npm install @astrojs/rss`
Expected: adds `@astrojs/rss` to dependencies, no errors.

- [ ] **Step 2: Write the feed endpoint**

```ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return rss({
    title: "Martin Yankov",
    description: "Notes, rendered like man pages.",
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((p) => ({
        title: p.data.title,
        description: p.data.summary,
        pubDate: p.data.date,
        link: `/blog/${p.id}/`,
      })),
  });
}
```

- [ ] **Step 3: Build and verify the feed**

Run: `npm run build && npm run preview`
Expected: PASS. Visit `/rss.xml` — valid XML with one `<item>` for the inaugural post (title, description, pubDate, link). Stop preview.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/pages/rss.xml.ts
git commit -m "feat: rss feed"
```

---

### Task 7: Wire blog into Nav + RSS head link

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/layouts/Terminal.astro`

- [ ] **Step 1: Repoint the Nav blog item to internal /blog and add rss**

In `src/components/Nav.astro`, replace the external blog item:

```ts
  { cmd: "open blog.yankovs.com", href: "https://blog.yankovs.com", external: true },
```

with:

```ts
  { cmd: "cd blog", href: "/blog" },
  { cmd: "cat rss.xml", href: "/rss.xml" },
```

- [ ] **Step 2: Add the RSS alternate link to the document head**

In `src/layouts/Terminal.astro`, after the favicon `<link>` (line 21), add:

```astro
    <link rel="alternate" type="application/rss+xml" title="Martin Yankov" href="/rss.xml" />
```

- [ ] **Step 3: Build and verify nav + head**

Run: `npm run build && npm run preview`
Expected: PASS. On any page the nav shows `$ cd blog` (→ /blog) and `$ cat rss.xml`; the old external blog.yankovs.com link is gone. Page source `<head>` contains the rss alternate link. Stop preview.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/layouts/Terminal.astro
git commit -m "feat: nav links to internal blog + rss alternate link"
```

---

### Task 8: Final verification

- [ ] **Step 1: Full clean build + check**

Run: `npm run build`
Expected: astro check 0 errors, build completes, output includes `blog/index.html`, `blog/building-a-terminal-blog/index.html`, `rss.xml`.

- [ ] **Step 2: Draft-exclusion sanity check**

Temporarily add `draft: true` to the inaugural post frontmatter, run `npm run build`, confirm the post is absent from `dist/blog/` and from `dist/rss.xml`. Revert the change.

- [ ] **Step 3: Confirm no leftover blog.yankovs.com references in the app**

Run: `grep -rn "blog.yankovs.com" src/`
Expected: no matches.

---

## Post-merge follow-ups (not part of this PR's code)

- Configure the 301 redirect `blog.yankovs.com` → `yankovs.com/blog` in the Netlify/DNS console.
- Repoint the README's `blog.yankovs.com` link to `https://yankovs.com/blog`.
- Merge order: land PR #2 (terminal site) first, then this blog PR.
