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
 * The year Next Level Code was founded. A verifiable public fact.
 *
 * Company age is always computed from this rather than stored, so it cannot
 * drift out of date.
 */
export const FOUNDED_YEAR = 2024;

/** How long the company has existed. Derived — never hard-coded. */
export function companyAgeYears(now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - FOUNDED_YEAR);
}

/*
 * There is deliberately no figure for the founder's individual experience,
 * tenure or career timeline, and none may be added.
 *
 * The site speaks at company level only. Next Level Code is presented as a
 * founder-led practice with a delivery collective of software architects,
 * senior engineers and AI specialists — never through one person's personal
 * history. Any "N years of experience" claim is out of scope for every page,
 * /about/ included: the only age the site states is the company's own,
 * derived from FOUNDED_YEAR above.
 */

/** Client projects delivered. Confirmed by the owner; update by hand. */
export const CLIENT_PROJECTS_DELIVERED = 25;

/** Named client references published on the site — see AGENTS.md §5bis. */
export const CLIENT_REFERENCES = 6;
