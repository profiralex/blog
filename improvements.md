# UI Improvement Plan

## Phase 1 — Highest impact, lowest risk

### 1.1 Replace card grid with left-aligned list
**Files:** [src/pages/index.astro](src/pages/index.astro)

- Remove the `<style>` block's grid layout (lines 25-97).
- New markup: vertical list, each item = date (gray, small) · title (h3) · description (one line). No hero images on the index.
- Set `main` width to inherit the global 720px (delete the override at line 27).
- Pinned post: prepend a small uppercase "Pinned" label (or "Start here") above the title for the entry where `pinned.includes(p.id)`.
- Group entries by year with a subtle year heading (only if there are enough posts to warrant it — for now, skip).

**Acceptance:** Index reads as a chronological list, left-aligned, single column, container width matches blog post pages.

---

### 1.2 Unify container width
**Files:** [src/styles/global.css](src/styles/global.css), [src/layouts/BlogPost.astro](src/layouts/BlogPost.astro), [src/pages/index.astro](src/pages/index.astro)

- Confirm `main` width is 720px globally via `global.css`.
- Remove the duplicated `main` width declaration in [BlogPost.astro:20](src/layouts/BlogPost.astro#L20). Same for `.prose` width — it's redundant with `main`.
- Remove the 960px override in `index.astro`.

**Acceptance:** Navigating from index → post → about shows no container jump.

---

### 1.3 New accent color + minor palette refresh
**Files:** [src/styles/global.css](src/styles/global.css)

- Replace `--accent: #2337ff` and `--accent-dark: #000d8a` with something less starter-default. Suggested: a muted ink/teal (`#1f6feb` is still blue but warmer), or oxblood (`#a83232`), or warm graphite (`#3a3a3a`). Decide before implementing.
- Adjust `blockquote` border, links, and the active-nav underline — they all reference `var(--accent)`, so the change cascades automatically.

**Acceptance:** Site no longer reads as "Astro default theme."

---

## Phase 2 — Personal blog polish

### 2.1 Add tags + reading time to post schema
**Files:** [src/content.config.ts](src/content.config.ts), [src/layouts/BlogPost.astro](src/layouts/BlogPost.astro), [src/pages/index.astro](src/pages/index.astro), existing posts under [src/content/blog/](src/content/blog/)

- Extend Zod schema with `tags: z.array(z.string()).optional()`.
- Compute reading time at build via word count (no library needed — split body text on whitespace, divide by ~220 wpm). Astro exposes `entry.body` in `[...slug].astro`.
- Surface on the index (gray meta line: `· 4 min · #distributed-systems`) and on the post header.
- Backfill tags on the two existing posts.

**Acceptance:** Each post shows tags + reading time on both list and detail.

---

### 2.2 "Pinned" / "Start here" label
**Files:** [src/pages/index.astro](src/pages/index.astro)

- Already covered structurally in 1.1, but worth calling out as its own success criterion: a returning reader can tell at a glance why hello-world is at the top.

---

### 2.3 Replace footer copy
**Files:** [src/components/Footer.astro](src/components/Footer.astro)

- Drop "All rights reserved." Replace with something warmer — options to pick from:
  - `Built with Astro · RSS`
  - `© 2026 Alexandr · CC-BY where it makes sense`
  - Just `Alexandr Profir · 2026` and the social icons.
- Add an RSS link icon next to GitHub/LinkedIn (the feed already exists at `/rss.xml`).

**Acceptance:** Footer no longer reads like a SaaS landing page.

---

### 2.4 Verify nav active state
**Files:** [src/components/HeaderLink.astro](src/components/HeaderLink.astro), [src/components/Header.astro](src/components/Header.astro)

- Read `HeaderLink.astro`, confirm it adds `class="active"` based on `Astro.url.pathname`. If not, fix.

**Acceptance:** Visiting `/about` shows the underline on the about icon.

---

## Phase 3 — Optional, decide later

### 3.1 Dark mode
**Files:** [src/styles/global.css](src/styles/global.css), [src/components/BaseHead.astro](src/components/BaseHead.astro)

- Add `@media (prefers-color-scheme: dark)` block: invert backgrounds (`#f8f9fc` → `#111418`), darken `--gray-light`, lighten text variables, pick a dark-friendly accent variant.
- Test code-block contrast (the syntax highlighter Astro ships with may need a dark theme override in `astro.config.mjs`).
- Skip a manual toggle for v1 — `prefers-color-scheme` only.

**Acceptance:** Site respects OS theme without flicker.

---

### 3.2 Replace network SVG background
**Files:** [public/network-bg.svg](public/network-bg.svg), [src/consts.ts](src/consts.ts)

- Either: remove `--bg-image` entirely (solid `#f8f9fc` is enough), or swap for a faint dot grid / paper texture.
- Decide based on dark-mode work in 3.1 — the SVG would need a dark variant otherwise.

**Acceptance:** Background reads as understated, not thematic.

---

### 3.3 Author byline on post pages
**Files:** [src/layouts/BlogPost.astro](src/layouts/BlogPost.astro)

- Below the title, add a small row: avatar (24px) · "Alexandr Profir" · date · reading time. Mirrors the hover card pattern from places like Mataroa/Bear without being a card.

**Acceptance:** A reader landing on a post directly knows who wrote it.

---

## Suggested order

Merge Phase 1 as a single PR (high visual delta, all touch the same files), then Phase 2 as 2-3 smaller PRs (schema change + tags is its own thing; footer/nav-active are trivial cleanups). Phase 3 is opt-in.

Before starting Phase 1: pick the accent color (1.3) so the rest isn't guesswork.
