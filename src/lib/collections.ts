/**
 * Locale-aware access to content collections.
 *
 * Pages should never call `getCollection()` directly: entry ids carry a locale
 * prefix (`en/custom-software`) and drafts must stay out of production, and
 * both concerns belong in one place rather than repeated in every route.
 */

import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { DEFAULT_LOCALE, type LocaleCode } from '../i18n/config';

/** `"en/custom-software"` → `"en"` */
export function entryLocale(id: string): string {
  return id.split('/')[0] ?? '';
}

/** `"en/custom-software"` → `"custom-software"` */
export function entrySlug(id: string): string {
  return id.split('/').slice(1).join('/');
}

type EntryData = Record<string, unknown>;

/** Drafts are visible while developing and never reach a production build. */
function isVisible(data: EntryData): boolean {
  if (import.meta.env.DEV) return true;
  return data.draft !== true;
}

/** Collections carrying an explicit `order` render in that order; the rest fall
    back to alphabetical id so output stays deterministic between builds. */
function byOrderThenId<C extends CollectionKey>(a: CollectionEntry<C>, b: CollectionEntry<C>) {
  const orderA = (a.data as EntryData).order;
  const orderB = (b.data as EntryData).order;

  if (typeof orderA === 'number' && typeof orderB === 'number' && orderA !== orderB) {
    return orderA - orderB;
  }
  return a.id.localeCompare(b.id);
}

/**
 * All entries of a collection for one locale.
 *
 * If the locale has no content yet — the normal state for a language being
 * translated — it falls back to the default locale so the route still renders
 * rather than 404ing on a half-finished translation.
 */
export async function getLocalisedCollection<C extends CollectionKey>(
  collection: C,
  locale: LocaleCode = DEFAULT_LOCALE,
): Promise<CollectionEntry<C>[]> {
  const forLocale = await getCollection(collection, ({ id, data }) => {
    return entryLocale(id) === locale && isVisible(data as EntryData);
  });

  if (forLocale.length > 0) {
    return forLocale.sort(byOrderThenId);
  }

  if (locale === DEFAULT_LOCALE) return [];

  const fallback = await getCollection(collection, ({ id, data }) => {
    return entryLocale(id) === DEFAULT_LOCALE && isVisible(data as EntryData);
  });

  return fallback.sort(byOrderThenId);
}

/** A single entry by its locale-less slug, or `undefined` if absent. */
export async function getLocalisedEntry<C extends CollectionKey>(
  collection: C,
  slug: string,
  locale: LocaleCode = DEFAULT_LOCALE,
): Promise<CollectionEntry<C> | undefined> {
  const entries = await getLocalisedCollection(collection, locale);
  return entries.find((entry) => entrySlug(entry.id) === slug);
}

/**
 * Builds `getStaticPaths()` output for every published locale of a collection.
 * Routes are generated from content, so publishing a language adds its pages
 * automatically once its code is in `PUBLISHED_LOCALES`.
 */
export async function getLocalisedPaths<C extends CollectionKey>(
  collection: C,
  locales: LocaleCode[],
) {
  const paths = [];

  for (const locale of locales) {
    const entries = await getLocalisedCollection(collection, locale);
    for (const entry of entries) {
      paths.push({
        params: { slug: entrySlug(entry.id) },
        props: { entry, locale },
      });
    }
  }

  return paths;
}
