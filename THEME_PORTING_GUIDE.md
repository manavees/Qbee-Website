# Porting This Site's Layout & Theme to a New Project

This document is for an AI agent tasked with reusing this site's **look, feel, and
architecture** (layout system, colors, typography, components) in a **different**
website with **different content**. Follow this as a checklist. Do not copy
Manavees-specific content, copy — and then correct — the _machinery_ that produces
the design.

## 0. What this site actually is

This is an **AstroWind** template (Astro v6 + Tailwind CSS v4) that has been
re-skinned for "Manavees Holding," a Greek holding company. The template itself is
generic and reusable; what makes this site look like _this_ site is:

1. A small set of CSS variables (colors + fonts) in one file.
2. A logo/brand asset set.
3. Content (copy, nav labels, page text) written in Greek for a holding company.

Porting = keep #nothing of (3), keep the mechanism of (1) and (2), and replace the
values.

## 1. Stack & prerequisites

- Astro v6, Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- TypeScript 5.9, MDX for blog content
- Node >= 22.12.0
- Read [AGENTS.md](./AGENTS.md) in this repo first — it documents the full
  architecture (directory layout, path aliases, config system, content
  collections, verification checklist). Everything below assumes that context.

The cleanest approach is usually to **scaffold a fresh copy of this repo** (or the
upstream `onwidget/astrowind` template) for the new site rather than trying to
strip Manavees content out of a clone in place — it avoids leftover references.
If the new project already exists, cherry-pick the files listed below instead.

## 2. Files that define "the theme" (copy the mechanism, replace the values)

### 2.1 Colors — `src/components/CustomStyles.astro`

This is the single source of truth for the color palette and fonts, defined as CSS
custom properties for light and dark mode:

```
--aw-color-primary       (light: navy rgb(15 27 45))
--aw-color-secondary     (light: darker navy rgb(24 42 68))
--aw-color-accent        (brass/gold rgb(166 124 82) — same in light & dark)
--aw-color-text-heading
--aw-color-text-default
--aw-color-text-muted
--aw-color-bg-page       (light: cream rgb(245 240 232))
--aw-color-bg-page-dark  (navy rgb(15 27 45))
```

Dark mode is a `.dark` class override of the same variable names. There's also a
hardcoded hex `#F5F0E8` (cream) and `#0F1B2D` (navy) duplicated in
`tailwind.css` for the sticky header background — **search for these two hex
values and the accent rgb `166 124 82` across the codebase**, they're the most
likely places a hardcoded brand color leaks outside the variable system.

**To port:** keep the variable _names_, swap the `rgb(...)` values for the new
brand's palette. Keep both light and dark variants filled in. Preserve the
`::selection` and focus-ring rules but update the accent color used inside them.

### 2.2 Design tokens — `src/assets/styles/tailwind.css`

Tailwind v4's CSS-first `@theme` block maps `--color-primary`, `--color-secondary`,
`--color-accent`, `--color-default`, `--color-muted` to the `--aw-color-*`
variables above — this is what lets components use `bg-primary`, `text-accent`,
etc. as ordinary Tailwind utility classes. Also defines:

- Font families (`--font-sans`, `--font-serif`, `--font-heading`) — currently
  Lato (body) + Inter Variable (headings). Swap the `@fontsource` imports in
  `CustomStyles.astro` and these variable names if the new brand uses different
  typefaces.
- Custom utilities: `bg-page`, `bg-dark`, `bg-light`, `text-page`, `text-muted`,
  `btn` / `btn-primary` / `btn-secondary` / `btn-tertiary`
- The sticky-header scroll effect (`#header.scroll`) — contains the hardcoded
  cream/navy hex values mentioned above.
- Mobile menu expand/collapse styles, dropdown behavior, icon stroke widths.

**To port:** copy this file mostly as-is; only touch the two hardcoded hex values
in the `#header.scroll` rules and the font-family fallback chain.

### 2.3 Logo — `src/components/Logo.astro`

Just two `<img>` tags (light-mode SVG / dark-mode SVG) pointing at
`/brand/*.svg` with `dark:hidden` / `hidden dark:block` toggling. **To port:**
replace the SVG paths with the new brand's logo files (keep a light-background
and dark-background variant, or simplify to one if the new brand only has one
logo lockup), keep the two-image dark/light toggle pattern.

### 2.4 Brand asset files — `public/brand/` and `manavees_brand_assets/`

`public/brand/` holds the SVGs/PNGs actually served (logo variants, monogram,
favicons, OG images). `manavees_brand_assets/` (repo root) is a source/reference
folder with the full brand sheet, including a `manavees-web-brand-tokens.css`
file — check that file too, it may duplicate or be the origin of the CSS
variables above.

**To port:** none of this is reusable — it's 100% brand-specific. Generate a
fresh equivalent set for the new brand (logo lockups, monogram, favicons at the
same sizes, OG image, `site.webmanifest`). Match the _set_ of files/sizes, not
the content.

### 2.5 Favicons — `src/components/Favicons.astro` and `public/favicon*`

Check `Favicons.astro` for how favicon links are wired (sizes, webmanifest,
apple-touch-icon). Regenerate all sizes for the new brand and keep the same
`<link>` structure.

## 3. Layout & structure (reuse almost unchanged)

These are generic and should need **no changes** beyond content/props:

- `src/layouts/Layout.astro` — root HTML shell: fonts import, meta, dark-mode
  script, `<ClientRouter>` view transitions, `bg-page text-default` on `<body>`.
- `src/layouts/PageLayout.astro` — wraps `Layout` with `Header` + `<main>` +
  `Footer`, using `headerData`/`footerData` from `src/navigation.ts`.
- `src/layouts/LandingLayout.astro`, `MarkdownLayout.astro` — variants for
  landing pages / markdown-rendered pages (privacy, terms, etc.).
- `src/components/widgets/*` — the page-section building blocks: `Header`,
  `Footer`, `Hero`/`Hero2`/`HeroText`, `Features`/`Features2`/`Features3`,
  `CallToAction`, `Contact`, `FAQs`, `Pricing`, `Stats`, `Steps`/`Steps2`,
  `Testimonials`, `Brands`, `BlogLatestPosts`/`BlogHighlightedPosts`,
  `Announcement`, `Content`, `Note`. These are all prop-driven — reuse them by
  passing new copy/props, don't rewrite them.
- `src/components/ui/*` — primitives (`Button`, `Headline`, `Timeline`,
  `WidgetWrapper`, `Form`). Fully generic, reuse as-is.
- `src/components/common/*` — `Image`, `Metadata`, `Analytics`, `ToggleTheme`,
  `ToggleMenu`, etc. Fully generic, reuse as-is.

## 4. What is 100% Manavees-specific (do NOT carry over)

- `src/navigation.ts` — nav links and footer links are in Greek and reference
  Manavees pages (`/sectors`, `/company-info`, ΑΦΜ/ΓΕΜΗ registration numbers in
  the footer note). Rewrite entirely for the new site's nav/footer.
- `src/config.yaml` — site name, domain, SEO description (Greek), i18n language
  (`el`). Update `site.name`, `site.site`, `metadata.description`,
  `i18n.language`, OG image path, etc.
- `src/pages/*.astro` and `src/pages/*.md` — all actual page content
  (`index.astro`, `about.astro`, `sectors.astro`, `company-info.astro`,
  `contact.astro`, `privacy.md`, `terms.md`, `cookies.astro`) is Manavees
  content. Use these as **structural examples** of how to assemble widgets into
  a page, but replace the copy.
- `src/data/post/*` — Manavees blog posts. Not reusable content, but
  `src/content.config.ts` (the Content Collections schema) is reusable
  machinery.
- Legal/company-specific text: ΑΦΜ, ΓΕΜΗ, company name strings hardcoded in
  `footerData.footNote` (`src/navigation.ts`) and likely in
  `company-info.astro`, `privacy.md`, `terms.md`.

## 5. Suggested porting procedure for the next agent

1. Scaffold the new project (fresh AstroWind clone, or copy this repo and strip
   content — your call based on how much of `vendor/integration/`,
   `astro.config.ts`, `netlify.toml`/`vercel.json`/`Dockerfile` deploy config is
   also wanted).
2. Copy `src/layouts/`, `src/components/widgets/`, `src/components/ui/`,
   `src/components/common/`, `src/components/CustomStyles.astro`,
   `src/assets/styles/tailwind.css`, `src/content.config.ts`,
   `src/utils/` verbatim.
3. Get the new brand's color palette (ask the user if not given) and update the
   `--aw-color-*` values in `CustomStyles.astro` (light + dark), plus the two
   hardcoded hex values in `tailwind.css`'s `#header.scroll` rules.
4. Get the new brand's fonts, update `@fontsource*` imports and the
   `--aw-font-*` variables.
5. Replace `Logo.astro` and all files in `public/brand/`/favicons with the new
   brand's assets (ask the user for logo files, or generate placeholders and
   flag them clearly as placeholders).
6. Rewrite `src/navigation.ts` and `src/config.yaml` for the new site.
7. Write new page content in `src/pages/`, reusing existing widgets
   (`Hero`, `Features`, `CallToAction`, `Contact`, `Stats`, `FAQs`, etc.) as the
   layout building blocks — this is the main point of the port: same visual
   language, new words.
8. Run the verification checklist from `AGENTS.md`: `npm run build`,
   `npm run check`, then visually check homepage, blog, dark mode, and mobile
   menu in a browser.

## 6. Quick reference: current Manavees palette (for context, not to copy)

| Token           | Light                    | Dark                     |
| --------------- | ------------------------ | ------------------------ |
| primary         | navy `rgb(15 27 45)`     | cream `rgb(245 240 232)` |
| secondary       | navy `rgb(24 42 68)`     | `rgb(221 216 208)`       |
| accent          | brass `rgb(166 124 82)`  | brass `rgb(166 124 82)`  |
| bg-page         | cream `rgb(245 240 232)` | navy `rgb(15 27 45)`     |
| text-default    | `rgb(26 26 46)`          | `rgb(232 227 219)`       |
| font-heading    | Inter Variable           | same                     |
| font-sans/serif | Lato                     | same                     |

Replace this whole table's values with the new brand's palette; the _shape_ of
the table (primary/secondary/accent/bg-page/text tokens × light/dark) is what to
preserve.
