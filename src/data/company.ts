/**
 * Verified company facts.
 *
 * ONLY figures the owner has explicitly confirmed belong in this file, and
 * nothing on the site may publish a number that is not here. The brief rules
 * out invented metrics, and a single reviewed source is what makes that rule
 * enforceable rather than aspirational.
 *
 * Labels live in the i18n dictionaries; the numbers do not translate.
 */

/**
 * Years in business.
 *
 * The owner confirmed 13 years as of 2026. Storing that statement and
 * counting forward keeps the figure true on every rebuild instead of
 * quietly going stale next January. A founding year is deliberately not
 * recorded: deriving one from "13 years" would be an assumption, and would
 * be off by one for most of any given year.
 */
const YEARS_IN_BUSINESS_ANCHOR = { years: 13, asOfYear: 2026 } as const;

export function yearsInBusiness(now: Date = new Date()): number {
  const elapsed = now.getFullYear() - YEARS_IN_BUSINESS_ANCHOR.asOfYear;
  return YEARS_IN_BUSINESS_ANCHOR.years + Math.max(0, elapsed);
}

/** Client projects delivered. Confirmed by the owner; update by hand. */
export const CLIENT_PROJECTS_DELIVERED = 25;

/** Named client references published on the site — see AGENTS.md §5bis. */
export const CLIENT_REFERENCES = 6;
