# Next Level Code — corporate site

Static marketing site for **Next Level Code**, served at
<https://nextlevelcode.tech> from GitHub Pages.

The product brief, design direction and content rules live in
[`AGENTS.md`](./AGENTS.md) — read it before changing anything visible.

## Stack

| Concern     | Choice |
|-------------|--------|
| Framework   | [Astro 7](https://astro.build) — static output, zero client JS by default |
| Styling     | Tailwind CSS v4, CSS-first tokens declared in `src/styles/global.css` |
| Language    | TypeScript (strict) |
| Content     | Astro content collections, Markdown/MDX, locale-scoped folders |
| Icons       | `astro-icon` + Lucide, inlined as SVG at build time |
| Fonts       | Jost (display) + Inter (body), self-hosted via Fontsource |
| Hosting     | GitHub Pages, custom domain, deployed by GitHub Actions |

## Requirements

Node **≥ 22.12** (see `.nvmrc` — the project is developed on 24.18.1 LTS).

## Commands

```bash
npm install          # dependencies
npm run dev          # development server
npm run build        # static build (output: dist/)
npm run preview      # preview the production build
npm run check        # TypeScript + Astro diagnostics
```

## Repository layout

```
public/              Served verbatim: CNAME, robots.txt, favicons, verification files
src/assets/          Images processed by the build (logo, client logos)
src/components/      brand/ · layout/ · ui/ · sections/ · seo/ · forms/
src/content/         Content collections, one folder per locale
src/i18n/            Locale registry, UI dictionaries, t() helper
src/layouts/         Page shells
src/pages/           Routes
src/scripts/         Small vanilla-TS behaviours (reveals, header, counters)
src/styles/          Design tokens and global styles
```

## Internationalisation

V1 ships **English only**, served at the root without a `/en/` prefix. French,
Arabic and Russian are already wired into the locale registry
(`src/i18n/config.ts`) and publish by adding their dictionary, their content
folders, and their code to `PUBLISHED_LOCALES`. No component changes required:
all copy flows through `t()` and all layout uses CSS logical properties, so
right-to-left mirroring is automatic.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. `.github/workflows/ci.yml` runs a build check on other branches
without deploying.

The custom domain is pinned by `public/CNAME`.
