# yankovs.com autumn update: design

Date: 2026-10-27 (revised 2026-10-29). Size: small project.

## Intent

The site still says what was true on 2026-05-31. Since then Martin shipped goifc, openblox, matchblox (now also an iOS app in TestFlight) and builder, started building the next legal OS for modern lawyers at Lexroom.ai, and opened GitHub Sponsors. The site should say why he builds, show what he ships, and invite people to sponsor, in that order.

## The why (celery test)

**An opinionated builder who believes software should be cool to use and make you feel good.** Every line on the site has to prove that. A line that does not goes.

Supporting belief: open source runs on people sponsoring each other. The amount does not matter; the signal does. Martin sponsors open-webui, llama.cpp and openclaw himself.

## Goals

- The intro on `/` and `/about` leads with the why.
- Lexroom.ai appears as the current project, with no job title.
- "The OS for modern builders" appears as a public, unnamed current project.
- The four launches appear on `/building` and `/now`.
- A live contribution chart on `/`, drawn in block characters.
- A ♥ in the nav and a `/sponsor` page that names the real bills and links to GitHub Sponsors.

## Non-goals

- The builders' OS stays unnamed. The "stealth project · private" line goes.
- No amounts or ranges for bills. Relative shares only.
- No Netlify functions, adapters, build-time fetches or scheduled builds. The site stays static.
- No sponsor tiers or promised perks.
- No GitHub Sponsors widget iframe (breaks the terminal look).
- No `.github/FUNDING.yml` in other repos (outside this repo; next step).
- No launch blog post; no layout or theme changes.

## Anti-goals

- The site reads like a CV.
- The sponsor page reads like a tip jar or a guilt trip.
- "What's your excuse" reads as earnest self-help instead of a joke.
- The chart shows an empty grid or a zero when the data did not load.

## Approaches

**Content edits.** Edit pages in place (picked, Martin, 2026-10-27). Dropped: shared projects data file (pages say different things); launch blog post (out of scope).

**Contribution chart data.** Client-side fetch from the public `github-contributions-api.jogruber.de` with `localStorage` caching (picked, Martin, 2026-10-29: no Netlify build time). Dropped: build-time GitHub GraphQL fetch with a daily rebuild (spends Netlify build minutes); a Netlify function with an hourly cache (adds a server and an adapter); GitHub's own contributions HTML (no CORS).

Trade-off accepted by Martin: each visitor's browser calls that third-party service, which sees the visitor's IP, and the chart depends on its uptime.

**Bills.** Relative share bars, no numbers (picked, Martin, 2026-10-29: transparent and nothing to maintain).

## Copy

**`/` boot sequence**

```
$ whoami
Martin Yankov
$ cat intro.md
Hi, I'm Martin.

I'm an opinionated builder.
I think software should be cool to use and make you feel good.
If it doesn't, I rebuild it.

Right now: the next legal OS for modern lawyers, at Lexroom.ai.
# what's your excuse not to be the best version of yourself?
$ excuses
zsh: command not found: excuses
```

Below the boot sequence, the contribution chart (see Chart), then `$ cd sponsor ♥` linking to `/sponsor`.

**`/about`**

> Hi, I'm Martin.
>
> I'm an opinionated builder. Software, mostly, but I'll build whatever needs building.
>
> I think software should be cool to use and make you feel good. I work in small steps, ask a lot of questions, and care about the person on the other end. The most expensive bug is building the wrong thing perfectly.
>
> Right now I'm building the next legal OS for modern lawyers at Lexroom.ai, and the OS for modern builders.
>
> I believe in open source, and that we should [sponsor each other](/sponsor).
>
> Trilingual: English, German, Bulgarian.

**`/now`** (updated on ship day)

```
$ cat now.md
· Building the next legal OS for modern lawyers at Lexroom.ai.
· Building the OS for modern builders.
· Shipped this autumn: goifc, openblox, matchblox and builder.
· matchblox for iOS is in TestFlight.
· Learning via lutherskills.
```

**`/building`**

```
$ ls -la ~/building
· lexroom.ai — the legal OS for modern lawyers · current
· the OS for modern builders · current
· goifc.org — read IFC building models from Go, no CGO
· openblox.sh — run untrusted AI-generated code on your own hardware
· matchblox.sh — one console for every AI coding agent you run · iOS in TestFlight
· builder — makes your coding agent answer to you
· eopowers — Bulgarian public procurement
· coinskills — personal finance
· lutherskills — learning workspace
· debugmydinner.com — cooking blog
```

Links: https://lexroom.ai, https://goifc.org, https://openblox.sh, https://matchblox.sh, https://github.com/Lutherwaves/builder. "The OS for modern builders" has no link. The rest are unchanged.

**`/sponsor`**

```
$ cat sponsor.md
I build open source, opinionated, made to feel good to use.
If something I made made your day better, you can help keep it running.
$1 is as welcome as $100. It's not the money. It's the signal.

$ bills --by-share
claude code      ████████████████░░░░  the dev seat
apple developer  █████░░░░░░░░░░░░░░░  matchblox on iOS
github ci/cd     ████░░░░░░░░░░░░░░░░  grows with every push
domains          ██░░░░░░░░░░░░░░░░░░  the .sh and .org names
rough shares, not invoices

$ cat ~/sponsoring
♥ open-webui · llama.cpp · openclaw
I sponsor them too. That's the deal: we hold each other up.

$ sponsor --without-money
★ star a repo · open an issue · tell a friend

[ ♥ sponsor on github ] → https://github.com/sponsors/Lutherwaves
```

The share bars are Claude's estimate (16/5/4/2 of 20). Martin corrects them at copy review. Each name under `~/sponsoring` links to that project's sponsor page, verified before ship.

**Nav**: add `cd sponsor ♥` after `cd building`.

## Chart

- Source: `GET https://github-contributions-api.jogruber.de/v4/Lutherwaves?y=last`. Response: `{ total: { lastYear }, contributions: [{ date, count, level 0–4 }] }`. CORS `*`, verified 2026-10-29 (13,433 contributions in the last year).
- Cache: `localStorage`, 12-hour TTL, every read and write in try/catch. A blocked storage means a fetch on each visit.
- Draw: one row per weekday, one column per week, level 0–4 → `·░▒▓█`, with a `less ·░▒▓█ more` legend and the total. Colour from the theme accent. The grid is `aria-hidden`; a text label gives the total.
- Width: show the most recent weeks that fit the container. The page never scrolls sideways at 375px.
- Failure (fetch error, bad JSON, no cache): `contributions unavailable · see github.com/Lutherwaves`, linked. Never an empty grid or a zero. A stale cache beats the failure line.

## Calls made (Claude)

- List rows keep the `—` separator (list format). Prose has no em dashes, so the one in the boot text goes.
- "If it doesn't, I rebuild it." is Claude's line. Martin approves or cuts it at copy review.
- The joke: Martin's line as a `#` comment, then `$ excuses` → `command not found` as the punchline (approved, Martin, 2026-10-29).
- All existing projects stay: each one is an opinionated tool built to feel better than the alternatives.
- `/building` order: current (Lexroom, the builders' OS), then shipped, then ongoing. The copy block is the source of truth.
- builder links to its GitHub repo; no site was found.
- Martin's "fold into the spec and write the plan" (2026-10-29) counts as approval of this spec. The copy gets a final review in the running site.

- The chart and `$ cd sponsor ♥` are separate elements below `BootSequence`, not typed lines. The chart fetches at page load and is revealed when the boot finishes; with reduced motion or a replayed session, it shows at once. `BootSequence` stays plain text, so Lexroom.ai is not a link in the boot (it links on `/about` and `/building`).
- A project under `~/sponsoring` without a sponsor page links to its repo. The name stays.
- At narrow widths, each bills row puts its note on its own line under the bar, and bars shrink to 10 cells.

## Done when

- `astro check` and `astro build` pass.
- A local preview shows all copy above at 375px and 1280px, in light and dark themes.
- The chart draws from live data, draws from cache on reload, and shows the failure line when the API is blocked.
- The diff does not name the builders' OS company.
