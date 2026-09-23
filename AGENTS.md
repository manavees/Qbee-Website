# AstroWind Agent Instructions

## Project Overview

AstroWind is a free, open-source website template built with **Astro v6** and **Tailwind CSS v4**. It generates a fully static site optimized for performance, SEO, and accessibility.

**Stack:** Astro v6 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.12.0

## Architecture

### Directory Structure

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Headline, WidgetWrapper, ItemGrid
    widgets/       # Page sections: Hero, Features, Pricing, Header, Footer
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro v6 location)
  data/post/           # Blog posts (.md, .mdx)
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration (loaded as virtual module)
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

### Configuration System

Site config lives in `src/config.yaml` and is loaded as a Vite virtual module `astrowind:config` by the custom integration in `vendor/integration/`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Tailwind CSS v4

Configuration is CSS-first in `src/assets/styles/tailwind.css`:

- **Theme tokens:** `@theme { --color-primary: var(--aw-color-primary); ... }`
- **Custom utilities:** `@utility bg-page { ... }`
- **Dark mode:** Class-based via `@variant dark (&:where(.dark, .dark *))`
- **Plugins:** `@plugin "@tailwindcss/typography"`
- **Custom variant:** `@custom-variant intersect (&:not([no-intersect]))`

CSS variables for colors/fonts are defined in `src/components/CustomStyles.astro` with light/dark theme variants.

The Vite plugin `@tailwindcss/vite` is configured in `astro.config.ts` (not as an Astro integration).

### Class Merging

Components use `twMerge` from `tailwind-merge` v3 for conditional class composition.

## Content Collections

Defined in `src/content.config.ts` using the Astro v6 Content Layer API with `glob()` loader. Posts are in `src/data/post/` as `.md` or `.mdx` files.

Post frontmatter: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition
- Widget components accept standardized props (see `~/types`)

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains: `cdn.pixabay.com`, `images.unsplash.com`, `plus.unsplash.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

## Brand Identity (QBEE)

The site's visual identity (colors, fonts, logos, favicons) is sourced from
`qbee_brand_assets/` (source/reference folder, checked into the repo root —
see `qbee_brand_assets/README.md` for the full spec in Greek). That folder is
the single source of truth for brand assets; regenerate/replace its files if
the brand changes, then re-run the steps below to re-wire the site.

**Palette** (defined as CSS variables in `src/components/CustomStyles.astro`,
consumed via Tailwind's `@theme` mapping in `src/assets/styles/tailwind.css`):

| Token         | Light                                                               | Dark                 |
| ------------- | ------------------------------------------------------------------- | -------------------- |
| primary       | Deep Navy `#0F1B2D`                                                 | Warm Cream `#F5F0E8` |
| secondary     | Near Black `#1A1A2E`                                                | Warm Gray `#DDD8D0`  |
| accent (CTAs) | Deep Navy (same both themes — no separate accent hue in this brand) | Deep Navy            |
| accent-ink    | White (text on the navy accent)                                     | White                |
| text-muted    | Slate Gray `#6B7280`                                                | Cream 66%            |
| bg-page       | Warm Cream `#F5F0E8`                                                | Deep Navy `#0F1B2D`  |

There is no distinct "accent" hue in the QBEE brand (unlike the previous
Manavees brass accent) — CTA buttons stay navy-on-cream/white in both themes.
In dark mode the accent bg equals the dark page bg, so `btn-primary` adds a
`dark:border-white/20` for definition (see `tailwind.css`).

**Fonts:** Inter Display (Bold 700 for h1/h2/`.brand-wordmark`, Medium 500
available) for headings, Lato Medium 500 for body. Static `.woff2` files live
in `public/fonts/` (copied from `qbee_brand_assets/fonts/`) and are declared
via `@font-face` directly in `CustomStyles.astro` — no `@fontsource` package
is used for this brand.

**Logos/favicons:** `public/brand/*.svg` (logo-horizontal, logo-horizontal-dark-bg,
logo-compact, logo-compact-dark-bg, icon) and the favicon/OG files at the
`public/` root are copies of the matching `qbee-*-transparent.svg` / PNG files
in `qbee_brand_assets/`. `src/components/Logo.astro` and `Favicons.astro`
reference these paths directly; `src/assets/images/default.png` (the default
OG image) is a copy of `qbee_brand_assets/qbee-og-image.png`.

**Known gap:** most page content under `src/pages/` (index, about, sectors,
contact, company-info, privacy, terms, cookies, the blog listing) still has
literal leftover "Manavees" copy, `manavees.com` email addresses, and
placeholder ΑΦΜ/ΓΕΜΗ in `src/navigation.ts` — carried over verbatim from the
Manavees site this was scaffolded from. The contact form in `contact.astro`
also still posts to a Web3Forms `access_key` that belongs to Manavees, so
submissions currently would not reach QBEE. None of this has been rewritten
yet; it needs real QBEE business copy/facts (not something to invent) before
launch.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier)
3. Visual check in browser: homepage, blog, dark mode, mobile menu
