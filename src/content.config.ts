/**
 * Content collections.
 *
 * Every collection is locale-scoped by folder:
 *
 *   src/content/work/en/maileva-smb-invoices.md   → id "en/maileva-smb-invoices"
 *   src/content/work/fr/maileva-smb-invoices.md   → id "fr/maileva-smb-invoices"
 *
 * The locale is therefore part of the entry id, which is what lets a second
 * language be added by dropping files into a new folder — no schema change,
 * no code change. Query these collections through `src/lib/collections.ts`,
 * which handles the locale split, draft filtering and ordering.
 */

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Files live at `<collection>/<locale>/<slug>.<ext>`. */
function localised(collection: string, extensions = 'md,mdx') {
  return glob({
    pattern: `*/*.{${extensions}}`,
    base: `./src/content/${collection}`,
  });
}

/**
 * Per-page SEO. The length caps are deliberate: they turn "write a good title"
 * into a build-time check rather than a review-time reminder. Titles beyond
 * ~60 characters and descriptions beyond ~160 get truncated in search results.
 */
const seo = z.object({
  title: z.string().min(10).max(60),
  description: z.string().min(50).max(160),
});

/** A heading + body pair — used for outcome, capability and use-case lists. */
const pointSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const services = defineCollection({
  loader: localised('services'),
  schema: z.object({
    title: z.string(),
    /** One-line summary used on the services index and in nav previews. */
    summary: z.string(),
    /** Lucide icon name, rendered inline at build time. */
    icon: z.string(),
    /** Controls display order on /services/. */
    order: z.number().int(),
    seo,
    heroEyebrow: z.string(),
    heroTitle: z.string(),
    heroLead: z.string(),
    /** What the client gets — business outcomes, not feature lists. */
    outcomes: z.array(pointSchema).min(2),
    /** What we actually do under this offer. */
    capabilities: z.array(pointSchema).min(3),
    /**
     * Technologies worth naming for credibility, grouped by concern.
     *
     * Grouped rather than flat: a service page can legitimately name fifteen
     * or more technologies, and an undifferentiated row of pills that long
     * stops being scannable. The groups also let each page carry only the
     * part of the stack that is relevant to it.
     *
     * Optional by design — `stack: []` renders no section at all.
     */
    stack: z
      .array(
        z.object({
          group: z.string(),
          items: z.array(z.string()).min(1),
        }),
      )
      .default([]),
    /** Case-study slugs (without locale prefix) to surface as proof. */
    relatedWork: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const products = defineCollection({
  loader: localised('products'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    icon: z.string(),
    order: z.number().int(),
    seo,
    /** The business problem, stated before any technology. */
    problem: z.string(),
    useCases: z.array(pointSchema).min(2),
    /** Decision-maker benefits, phrased as outcomes. */
    benefits: z.array(z.string()).min(3),
    /** Integration proof: language label for the snippet in the body. */
    snippetLanguage: z.string().default('bash'),
    /** Security and reliability commitments — the DSI's first question. */
    assurances: z.array(z.string()).min(2),
    /** Pricing is always "on request"; the flag exists so it can change. */
    pricingOnRequest: z.boolean().default(true),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: localised('work'),
  schema: z.object({
    /** Client name in its original spelling — never translated. */
    client: z.string(),
    /** Project name where one exists (AGHORA, FIBRE, CLIPER…). */
    project: z.string().optional(),
    /** Key into src/assets/clients/, resolved with a typographic fallback so
        a missing image degrades gracefully instead of failing the build. */
    logo: z.string(),
    /**
     * How the client is represented in the logo band.
     *
     * `wordmark` renders the client's name in the site's own display type
     * instead of their artwork. It is the correct choice where a brand's
     * logo is inseparable from a coloured lockup that cannot be rendered
     * monochrome without distorting it: a plain text attribution sits more
     * safely within fair use than a recoloured or reconstructed mark.
     */
    logoTreatment: z.enum(['image', 'wordmark']).default('image'),
    sector: z.string(),
    order: z.number().int(),
    seo,
    summary: z.string(),
    /** The three-part narrative mandated by the brief. */
    context: z.string(),
    solution: z.string(),
    benefits: z.array(z.string()).min(2),
    /** Service slugs this engagement demonstrates. */
    services: z.array(z.string()).default([]),
    draft: z.boolean().default(false),

    // NOTE: there is deliberately no `metrics` field. These are real client
    // references and the brief forbids inventing figures for them. Benefits
    // are qualitative. Adding a metrics field would invite exactly the
    // fabrication the brief rules out — if real figures are ever cleared for
    // publication, add the field then, with the client's approval.
  }),
});

const blog = defineCollection({
  loader: localised('blog'),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Next Level Code'),
    tags: z.array(z.string()).default([]),
    seo,
    draft: z.boolean().default(false),
  }),
});

const legal = defineCollection({
  loader: localised('legal'),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
    seo,
  }),
});

export const collections = { services, products, work, blog, legal };
