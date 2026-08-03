/**
 * Locale registry — the single source of truth for the site's languages.
 *
 * This module is imported by `astro.config.ts`, so it must stay free of Astro
 * virtual modules (`astro:content`, `astro:i18n`, …): those do not exist yet
 * while the config is being loaded. Plain TypeScript only.
 *
 * ── Adding a language ────────────────────────────────────────────────────────
 * 1. Create the dictionary `src/i18n/<code>.json` (copy `en.json`, translate).
 * 2. Create the content folders `src/content/<collection>/<code>/`.
 * 3. Add the code to `PUBLISHED_LOCALES` below.
 * There is no third step in the components: every string already flows through
 * `t()` and every layout property is already logical (`ms-*`, `pe-*`, …), so
 * RTL and locale routing come for free.
 */

export type LocaleCode = 'en' | 'fr' | 'ar' | 'ru';

export interface LocaleDefinition {
  code: LocaleCode;
  /** BCP-47 tag written to `<html lang>`. */
  htmlLang: string;
  /** Endonym — how speakers name their own language, for the switcher. */
  label: string;
  /** Short form for compact UI. */
  shortLabel: string;
  dir: 'ltr' | 'rtl';
  /**
   * Font family stack for this locale's script. Latin and Cyrillic are both
   * covered by Jost + Inter, which is precisely why they were chosen over
   * Space Grotesk (no Cyrillic). Arabic needs a dedicated pairing — it is
   * declared here and only loaded once `ar` is published, so V1 ships no
   * unused font bytes.
   */
  fonts: {
    display: string;
    body: string;
  };
  /**
   * Wide letter-spacing is a core part of the brand's Latin typography (it
   * echoes the "N E X T" wordmark), but it breaks Arabic, where letterforms
   * must stay connected. Locales with `allowsLetterSpacing: false` get the
   * tracking neutralised in `global.css`.
   */
  allowsLetterSpacing: boolean;
}

export const LOCALES = {
  en: {
    code: 'en',
    htmlLang: 'en',
    label: 'English',
    shortLabel: 'EN',
    dir: 'ltr',
    fonts: { display: 'var(--font-display)', body: 'var(--font-body)' },
    allowsLetterSpacing: true,
  },
  fr: {
    code: 'fr',
    htmlLang: 'fr',
    label: 'Français',
    shortLabel: 'FR',
    dir: 'ltr',
    fonts: { display: 'var(--font-display)', body: 'var(--font-body)' },
    allowsLetterSpacing: true,
  },
  ar: {
    code: 'ar',
    htmlLang: 'ar',
    label: 'العربية',
    shortLabel: 'AR',
    dir: 'rtl',
    // Planned pairing, not loaded in V1: IBM Plex Sans Arabic (or Noto Sans
    // Arabic as a fallback) for both display and body — Jost/Inter have no
    // Arabic coverage.
    fonts: { display: 'var(--font-display-ar)', body: 'var(--font-body-ar)' },
    allowsLetterSpacing: false,
  },
  ru: {
    code: 'ru',
    htmlLang: 'ru',
    label: 'Русский',
    shortLabel: 'RU',
    dir: 'ltr',
    // Jost and Inter both ship Cyrillic; only the subset changes.
    fonts: { display: 'var(--font-display)', body: 'var(--font-body)' },
    allowsLetterSpacing: true,
  },
} as const satisfies Record<LocaleCode, LocaleDefinition>;

/** Every locale the site is designed for, published or not. */
export const LOCALE_CODES = Object.keys(LOCALES) as LocaleCode[];

export const DEFAULT_LOCALE: LocaleCode = 'en';

/**
 * Locales that actually emit routes. V1 = English only.
 * Everything that builds pages iterates over this array, so publishing a
 * language is a one-word change here once its content exists.
 */
export const PUBLISHED_LOCALES: LocaleCode[] = ['en'];

export function isPublishedLocale(value: string): value is LocaleCode {
  return (PUBLISHED_LOCALES as string[]).includes(value);
}

export function getLocale(code: LocaleCode): LocaleDefinition {
  return LOCALES[code];
}

/**
 * URL prefix for a locale. The default locale is served at the root
 * (`prefixDefaultLocale: false`), so it gets no segment.
 */
export function localePrefix(locale: LocaleCode): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`;
}

/**
 * Builds an absolute, locale-aware, trailing-slashed path.
 * `localePath('en', '/services/')` → `/services/`
 * `localePath('fr', '/services/')` → `/fr/services/`
 */
export function localePath(locale: LocaleCode, path = '/'): string {
  const normalised = `/${path.replace(/^\/+|\/+$/g, '')}`;
  const prefix = localePrefix(locale);
  if (normalised === '/') return `${prefix}/`;
  return `${prefix}${normalised}/`;
}

/**
 * True while the site is monolingual — used to hide the language switcher
 * without deleting it. The switcher activates on its own the moment a second
 * locale is published.
 */
export const IS_MULTILINGUAL = PUBLISHED_LOCALES.length > 1;
