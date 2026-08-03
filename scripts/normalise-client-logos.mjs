/**
 * Trims the transparent padding around client logos.
 *
 * Run with `node scripts/normalise-client-logos.mjs`. Output is committed;
 * this is a one-off tidy-up, not part of `npm run build`.
 *
 * The logos arrive with wildly different amounts of built-in whitespace, so
 * capping them all to the same CSS height makes some look tiny and others
 * huge. Cropping to the artwork's own bounding box means the height cap
 * finally measures the mark rather than the padding around it.
 *
 * Only the artwork's margins are removed — nothing is recoloured, rescaled or
 * recomposed. Logos without an alpha channel are skipped: their border is
 * part of the mark (Orange's wordmark sits on a solid square), and trimming
 * would crop the logo itself rather than empty space.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'src/assets/clients');

const files = (await readdir(directory)).filter((file) => /\.(png|webp)$/i.test(file));

for (const file of files) {
  const filePath = path.join(directory, file);
  const original = await readFile(filePath);
  const metadata = await sharp(original).metadata();

  if (!metadata.hasAlpha) {
    console.log(`${file.padEnd(28)} skipped — opaque, its border is part of the mark`);
    continue;
  }

  const trimmed = await sharp(original)
    // Threshold tolerates the near-transparent fringe left by antialiasing.
    .trim({ threshold: 5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const after = await sharp(trimmed).metadata();
  await writeFile(filePath, trimmed);

  console.log(
    `${file.padEnd(28)} ${metadata.width}x${metadata.height} → ${after.width}x${after.height}`,
  );
}
