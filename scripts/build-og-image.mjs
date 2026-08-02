/**
 * Generates the default Open Graph share image.
 *
 * Run with `node scripts/build-og-image.mjs`. The output is committed, so this
 * only needs re-running when the brand changes — it is deliberately not part
 * of `npm run build`, which keeps CI free of image-toolchain dependencies.
 *
 * The wordmark comes from the real logo asset rather than a redrawing of it.
 * The source is ink-on-white with a tonal gradient across the letters; that
 * gradient runs dark-to-light left to right, so simply inverting it would
 * reverse the brand's tonal direction. Instead the artwork is used as an
 * alpha mask and filled with flat porcelain, which also keeps the edges
 * antialiased.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 96;

const INK = '#0B1220';
const PORCELAIN = { r: 0xfa, g: 0xfb, b: 0xfc };
const COBALT = '#2E5BFF';

const WORDMARK_WIDTH = 420;

/** Fills the logo artwork with flat porcelain, using its own ink as the mask. */
async function tintedWordmark() {
  const { data, info } = await sharp(path.join(root, 'src/assets/NextLevel.png'))
    // The asset carries a white margin; trim it so placement is measured from
    // the artwork itself rather than from its padding.
    .trim({ threshold: 10 })
    .resize({ width: WORDMARK_WIDTH })
    .flatten({ background: '#ffffff' })
    .grayscale()
    .toColourspace('b-w')
    // Dark ink becomes a high alpha value; the white ground becomes zero.
    .negate({ alpha: false })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  const rgba = Buffer.alloc(pixels * 4);

  /**
   * The logo's letters are drawn in graded tones (the N is near-black, the T
   * mid-grey). Used as alpha directly, that grading would survive as an
   * uneven wordmark on the ink ground. Scaling the alpha up and clamping
   * flattens the letter interiors to fully opaque while leaving the
   * partially covered edge pixels partial, so the artwork stays antialiased.
   */
  const ALPHA_GAIN = 2;

  for (let i = 0; i < pixels; i += 1) {
    rgba[i * 4] = PORCELAIN.r;
    rgba[i * 4 + 1] = PORCELAIN.g;
    rgba[i * 4 + 2] = PORCELAIN.b;
    rgba[i * 4 + 3] = Math.min(255, data[i] * ALPHA_GAIN);
  }

  return {
    buffer: await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toBuffer(),
    width: info.width,
    height: info.height,
  };
}

const wordmark = await tintedWordmark();

/** The ≡ mark and the cobalt rule — plain geometry, so no font is required. */
const BAR_WIDTH = 104;
const BAR_HEIGHT = 10;
const BAR_GAP = 18;

const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <g fill="rgb(${PORCELAIN.r},${PORCELAIN.g},${PORCELAIN.b})">
    ${[0, 1, 2]
      .map(
        (index) =>
          `<rect x="${MARGIN}" y="${MARGIN + index * (BAR_HEIGHT + BAR_GAP)}" width="${BAR_WIDTH}" height="${BAR_HEIGHT}"/>`,
      )
      .join('\n    ')}
  </g>
  <rect x="${MARGIN}" y="${HEIGHT - MARGIN}" width="140" height="4" fill="${COBALT}"/>
</svg>`;

/** Sits between the ≡ mark above and the cobalt rule below. */
const wordmarkTop = Math.round((HEIGHT - wordmark.height) / 2) + 24;

const image = await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 4, background: INK },
})
  .composite([
    { input: Buffer.from(overlay), left: 0, top: 0 },
    { input: wordmark.buffer, left: MARGIN, top: wordmarkTop },
  ])
  .png()
  .toBuffer();

const outputDir = path.join(root, 'public/og');
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'default.png'), image);

console.log(
  `Wrote public/og/default.png (${WIDTH}x${HEIGHT}, ${image.length} bytes); ` +
    `wordmark ${wordmark.width}x${wordmark.height} at y=${wordmarkTop}`,
);
