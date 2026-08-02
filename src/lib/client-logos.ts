/**
 * Client logo resolution.
 *
 * Logos are looked up by key at build time rather than imported statically per
 * client. That is what satisfies the brief's requirement that a missing image
 * must never break the build: an unresolved key returns `undefined` and the
 * component falls back to setting the client's name in fine type.
 *
 * Adding a logo means dropping `src/assets/clients/<key>.<ext>` in place and
 * referencing `<key>` from the case study's frontmatter. No code change.
 */

import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/clients/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true },
);

const byKey = new Map<string, ImageMetadata>();

for (const [filePath, module] of Object.entries(modules)) {
  const fileName = filePath.split('/').pop();
  if (!fileName) continue;
  byKey.set(fileName.replace(/\.[^.]+$/, ''), module.default);
}

/** Returns the logo for a key, or `undefined` if no such file is present. */
export function getClientLogo(key: string): ImageMetadata | undefined {
  return byKey.get(key);
}

/** Keys that currently resolve — useful for build-time reporting. */
export function availableClientLogos(): string[] {
  return [...byKey.keys()].sort();
}
