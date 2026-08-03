// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';

import { DEFAULT_LOCALE, LOCALE_CODES } from './src/i18n/config';

/**
 * Next Level Code — https://nextlevelcode.tech
 *
 * Deployment target is GitHub Pages on a custom domain, so the build is fully
 * static and served from the domain root (base `/`). See `public/CNAME`.
 */
export default defineConfig({
  site: 'https://nextlevelcode.tech',
  trailingSlash: 'always',
  build: {
    // Emits `/services/index.html` so GitHub Pages serves clean URLs without
    // a redirect hop. Pairs with `trailingSlash: 'always'` above.
    format: 'directory',
  },

  /**
   * V1 publishes English only, served at the root with no `/en/` prefix.
   * `fr`, `ar` and `ru` are declared here so the locale helpers and the
   * hreflang machinery already know about them; they emit no routes until
   * their content exists AND they are added to `PUBLISHED_LOCALES`
   * (src/i18n/config.ts). Adding a language is a content task, not a code one.
   */
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALE_CODES,
    routing: {
      prefixDefaultLocale: false,
    },
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  markdown: {
    shikiConfig: {
      // Code samples sit on ink surfaces; the background is overridden in
      // global.css so the highlighter blends with our palette.
      theme: 'github-dark-default',
      // Wrapping destroys the column alignment that makes a JSON payload
      // readable. The block scrolls horizontally inside its own container
      // instead (see `.astro-code` in global.css), so the page never does.
      wrap: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // astro-icon inlines each used glyph as SVG at build time — no icon font,
  // no runtime JS, no network request.
  integrations: [
    sitemap({
      // The sitemap integration does not read `<meta name="robots">`, so
      // pages marked noindex have to be excluded here too. Submitting a URL
      // and then telling the crawler not to index it wastes crawl budget and
      // reads as a configuration mistake.
      filter: (page) => !page.includes('/legal/'),
    }),
    mdx(),
    icon({ iconDir: 'src/icons' }),
  ],
});
