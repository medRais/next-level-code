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

/**
 * The founder's individual senior engineering experience, which predates the
 * company.
 *
 * ── This is NOT company age, and the two must never be merged. ──
 * Presenting 13 years as "years in business" would overstate the age of a
 * company founded in 2024. This figure may appear only where it is explicitly
 * attributed to the founder's personal track record — /about/ is the intended
 * place, phrased so the distinction is unmissable, e.g. "Founded in 2024,
 * Next Level Code is built on 13 years of hands-on senior engineering
 * experience."
 *
 * It must not appear in the home metrics band, the footer, or anywhere the
 * surrounding context reads as a company statistic.
 */
export const FOUNDER_EXPERIENCE_YEARS = 13;

/** Client projects delivered. Confirmed by the owner; update by hand. */
export const CLIENT_PROJECTS_DELIVERED = 25;

/** Named client references published on the site — see AGENTS.md §5bis. */
export const CLIENT_REFERENCES = 6;
