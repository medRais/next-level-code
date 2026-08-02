/**
 * Keeps parent-scoped styling working across component boundaries.
 *
 * Astro compiles a component's scoped CSS to `.foo[data-astro-cid-parent]`,
 * and passes that `data-astro-cid-*` to child components as an ordinary prop.
 * So a child only picks up the parent's scope if it SPREADS its props onto
 * its root element:
 *
 *   const { class: className, ...rest } = Astro.props;
 *   <div class:list={['thing', className]} {...rest}>
 *
 * A component that accepts `class` but drops the rest silently breaks any
 * rule a parent writes for it: the class lands, the rule is emitted, and the
 * two never meet. Nothing errors. On this project that cost a dead optical
 * nudge on the logo, missing hero spacing, and ≡ bullets that never turned
 * cobalt — each invisible until someone looked at the rendered page.
 *
 * This check enforces the invariant at the source: if a component takes a
 * `class` prop, it must forward the rest of its props to its root element.
 *
 * Run with `node scripts/check-scoped-classes.mjs`. Exits non-zero on a hit.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentDirs = ['src/components', 'src/layouts'];

async function astroFiles(directory) {
  const found = [];
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await astroFiles(full)));
    else if (entry.name.endsWith('.astro')) found.push(full);
  }

  return found;
}

const problems = [];

for (const directory of componentDirs) {
  for (const file of await astroFiles(path.join(root, directory))) {
    const source = await readFile(file, 'utf8');

    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) continue;

    const acceptsClass = /\bclass\s*:\s*className\b/.test(frontmatter[1]);
    if (!acceptsClass) continue;

    const collectsRest = /\.\.\.\s*rest\b/.test(frontmatter[1]);
    const spreadsRest = /\{\s*\.\.\.\s*rest\s*\}/.test(source.slice(frontmatter[0].length));

    if (collectsRest && spreadsRest) continue;

    problems.push(
      `${path.relative(root, file)}\n` +
        `  accepts a \`class\` prop but does not ${
          collectsRest ? 'spread `{...rest}` onto its root element' : 'collect `...rest` from Astro.props'
        }.\n` +
        '  Parent components cannot style it: their scoped rules will never match.',
    );
  }
}

if (problems.length > 0) {
  console.error(
    `\nComponents that swallow the parent's style scope (${problems.length}):\n\n` +
      `${problems.join('\n\n')}\n\n` +
      'Destructure `...rest` from Astro.props and spread it on the root element.\n',
  );
  process.exit(1);
}

console.log('All components accepting `class` forward their props to the root.');
