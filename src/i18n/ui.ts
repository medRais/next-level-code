/**
 * Translation lookup.
 *
 * Every string rendered anywhere on the site goes through `t()`. That is not
 * ceremony for a single-language V1 — it is the one discipline that decides
 * whether adding French, Arabic and Russian later is a content task or a
 * rewrite. A hard-coded string in a component is a bug.
 *
 * Keys are dot-paths into `en.json` and are checked by the compiler, so a
 * typo fails `astro check` instead of shipping. A key missing at runtime
 * throws during the build rather than rendering `nav.srvices` to a visitor.
 */

import { DEFAULT_LOCALE, type LocaleCode } from './config';
import en from './en.json';

export type Dictionary = typeof en;

/**
 * Dot-paths that resolve to a string leaf, e.g. `'nav.services'`.
 * Object branches are walked; anything that is not a string is rejected.
 */
type StringPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends object
      ? `${K}.${StringPaths<T[K]>}`
      : never;
}[keyof T & string];

export type TranslationKey = StringPaths<Dictionary>;

/**
 * Registered dictionaries. Adding a locale means importing its JSON here and
 * listing its code in `PUBLISHED_LOCALES` (src/i18n/config.ts) — the type of
 * `TranslationKey` is derived from English, so a translation missing a key is
 * caught rather than silently rendering nothing.
 */
const dictionaries = {
  en,
} satisfies Partial<Record<LocaleCode, Dictionary>>;

function resolve(dictionary: Dictionary, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, segment) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[segment] : undefined,
      dictionary,
    );

  return typeof value === 'string' ? value : undefined;
}

/**
 * Returns a translator bound to a locale.
 *
 * ```astro
 * const t = useTranslations(Astro.currentLocale as LocaleCode);
 * <a href="/contact/">{t('cta.primary')}</a>
 * ```
 *
 * Interpolation uses named placeholders: `t('common.readingTime', { minutes: 6 })`
 * against `"{minutes} min read"`.
 */
export function useTranslations(locale: LocaleCode = DEFAULT_LOCALE) {
  const dictionary = (dictionaries as Partial<Record<LocaleCode, Dictionary>>)[locale] ?? en;

  return function t(key: TranslationKey, values?: Record<string, string | number>): string {
    // Fall back to English for a locale that is published but incomplete —
    // a partially translated page beats a broken one.
    const template = resolve(dictionary, key) ?? resolve(en, key);

    if (template === undefined) {
      throw new Error(
        `[i18n] Missing translation key "${key}" (locale "${locale}"). ` +
          `Add it to src/i18n/${locale}.json.`,
      );
    }

    if (!values) return template;

    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
  };
}

export type Translator = ReturnType<typeof useTranslations>;

/* ──────────────────────────────────────────────────────────────────────────
   Structured content
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Every path in the dictionary, including ones that resolve to an object or
 * an array. Arrays are treated as leaves: a page wants the whole list of
 * pillars, not `pillars.0.title`.
 */
type ContentPath<T> = {
  [K in keyof T & string]: T[K] extends string | readonly unknown[]
    ? K
    : T[K] extends object
      ? K | `${K}.${ContentPath<T[K]>}`
      : K;
}[keyof T & string];

/** The type sitting at a given dot-path. */
type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type ContentKey = ContentPath<Dictionary>;

/**
 * Reads structured content — lists of pillars, process steps, FAQ entries —
 * out of the dictionary with its shape preserved.
 *
 * `t()` deliberately only returns strings, so page sections built from lists
 * would otherwise have to hard-code their content in the component, which is
 * exactly what the i18n architecture exists to prevent.
 *
 * ```astro
 * const c = useContent(locale);
 * const pillars = c('home.pillars.items'); // typed as {title, body}[]
 * ```
 */
export function useContent(locale: LocaleCode = DEFAULT_LOCALE) {
  const dictionary = (dictionaries as Partial<Record<LocaleCode, Dictionary>>)[locale] ?? en;

  return function content<P extends ContentKey>(key: P): PathValue<Dictionary, P> {
    const read = (source: Dictionary): unknown =>
      key
        .split('.')
        .reduce<unknown>(
          (node, segment) =>
            node && typeof node === 'object'
              ? (node as Record<string, unknown>)[segment]
              : undefined,
          source,
        );

    const value = read(dictionary) ?? read(en);

    if (value === undefined) {
      throw new Error(
        `[i18n] Missing content key "${key}" (locale "${locale}"). ` +
          `Add it to src/i18n/${locale}.json.`,
      );
    }

    return value as PathValue<Dictionary, P>;
  };
}
