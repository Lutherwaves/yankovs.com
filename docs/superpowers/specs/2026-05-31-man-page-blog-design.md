# man-page blog under yankovs.com — design

Date: 2026-05-31
Status: approved

## Goal

Host the blog directly under `yankovs.com/blog`, sunset `blog.yankovs.com`, start
fresh (no content migration). Posts read like Unix **man pages**, matching the
site's fullscreen-terminal aesthetic.

Ships as a **separate PR on top of PR #2** (the Astro terminal-site revamp).

## Content model

Astro content collection `blog`, MDX files in `src/content/blog/*.mdx`.
Zod-validated frontmatter:

```ts
{
  title: string,        // command name, e.g. "building-a-terminal-blog"
  section: number = 1,  // man section number; default 1 (general)
  summary: string,      // one-liner — shown in NAME line and on the index
  date: Date,
  draft: boolean = false
}
```

- Slug = filename. URL = `/blog/<slug>`.
- `draft: true` excludes the post from the build output and from RSS.
- `section` gives the `NAME(1)` convention for free and leaves room to grow into
  topic grouping later. No tag system now (YAGNI).

## Routing & pages

- **`/blog`** — index. Renders `$ ls ~/blog`, then posts as man-style entries:

  ```
  building-a-terminal-blog(1)   building a blog that reads like a man page   2026-05-31
  ```

  Sorted by `date` descending. Drafts hidden. Title links to the post.

- **`/blog/[slug]`** — `getStaticPaths` over the collection, body wrapped in the
  man-page layout.

## Man-page rendering (`ManPage.astro`)

Classic man structure:

```
NAME
     building-a-terminal-blog – building a blog that reads like a man page

DESCRIPTION
     <MDX body renders here>

                                                          YANKOVS(1)  2026-05-31
```

- `NAME` / `DESCRIPTION` headers in caps, accent color, hanging indent for body
  (mimics real man layout).
- MDX `##` headings restyle to caps section headers (`SYNOPSIS`, `EXAMPLES`, …)
  so authors write normal markdown and it reads man-ish.
- Footer mimics the man footer: left `YANKOVS(section)`, right the date.
- Reuses the existing `Terminal.astro` shell (StatusBar, Nav, theme toggle,
  self-hosted JetBrains Mono) for visual continuity with the rest of the site.

## RSS

- `@astrojs/rss` generates `/rss.xml` from non-draft posts (title, summary, date,
  link).
- Add `<link rel="alternate" type="application/rss+xml">` to the document head.

## Nav

- Replace the external `open blog.yankovs.com` item with internal `cd blog` →
  `/blog`.
- Add a small `rss` link in the nav.

## Sunsetting blog.yankovs.com (deploy step — not code in this PR)

301 redirect `blog.yankovs.com` → `yankovs.com/blog`, configured in the
Netlify/DNS console. Documented here as a manual cutover step; this build does
not ship it.

After this PR merges, repoint the README's `blog.yankovs.com` link to
`https://yankovs.com/blog`.

## Seed content

One inaugural post `building-a-terminal-blog.mdx` explaining the man-page concept
— doubles as a living example of the format and gives the index real content.

## Testing

- `astro build` green; `astro check` clean.
- Manually verify: `/blog` index, a post page, `/rss.xml` validates, draft
  exclusion works, theme toggle + nav continuity hold on blog routes.

## Out of scope (YAGNI)

Tags, search, reading time, prev/next nav, per-post OG images, comments,
content migration from the old blog.
