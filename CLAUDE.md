# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # start dev server at http://localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview production build
npm run astro     # Astro CLI (e.g. npm run astro -- add <integration>)
```

There are no linting or test scripts configured.

## Architecture

This is an Astro 6 static blog with content collections. Key architectural points:

**Content pipeline:** Blog posts live in `src/content/blog/` as `.md` or `.mdx` files. The schema is defined in `src/content.config.ts` using Zod — `heroImage` uses Astro's `image()` helper for build-time optimization via `sharp`. All posts are typed through `CollectionEntry<'blog'>`.

**Mermaid diagrams:** Rendered entirely client-side via a CDN script embedded directly in `src/layouts/BlogPost.astro`. There is no Mermaid npm package. The script queries `pre[data-language="mermaid"]` (the attribute Astro's MDX renderer applies), swaps each element with a `<div class="mermaid">`, then calls `mermaid.run()`. Only works in `.mdx` posts, not plain `.md`.

**Font:** Atkinson Hyperlegible is self-hosted as woff files in `src/assets/fonts/` and loaded through Astro's font API (`astro/config` `fontProviders.local()`). It is injected via `<Font cssVariable="--font-atkinson" preload />` in `BaseHead.astro` and referenced throughout CSS as `var(--font-atkinson)`.

**Global constants:** `src/consts.ts` exports `SITE_TITLE` and `SITE_DESCRIPTION` — used by the RSS feed and page metadata.

**Site URL:** `astro.config.mjs` has `site: 'https://alex.profir.dev'`. The sitemap and RSS feed generate absolute URLs from this value.

**SEO/meta:** `BaseHead.astro` handles all `<head>` content including Open Graph, Twitter cards, canonical URL, RSS autodiscovery, and sitemap link. Every page composes this component.

## Git

- Do not include `Co-Authored-By` trailers in commit messages.
- `improvements.md` is a local working document — do not stage or commit it.
