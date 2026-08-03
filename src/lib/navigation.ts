/**
 * Site navigation, defined once.
 *
 * Labels are translation keys rather than strings, so the header, the footer
 * and the 404 page all rename together when a locale is added. Paths are
 * locale-less; `localePath()` prefixes them per locale.
 */

import type { TranslationKey } from '../i18n/ui';

export interface NavItem {
  labelKey: TranslationKey;
  /** Locale-less path, always trailing-slashed to match `trailingSlash: 'always'`. */
  path: string;
}

/** Header navigation. Kept to six items — a longer bar stops being scannable. */
export const PRIMARY_NAV: NavItem[] = [
  { labelKey: 'nav.services', path: '/services/' },
  { labelKey: 'nav.products', path: '/products/' },
  { labelKey: 'nav.work', path: '/work/' },
  { labelKey: 'nav.howWeWork', path: '/how-we-work/' },
  { labelKey: 'nav.about', path: '/about/' },
  { labelKey: 'nav.blog', path: '/blog/' },
];

export const SERVICE_NAV: NavItem[] = [
  { labelKey: 'services.customSoftware', path: '/services/custom-software/' },
  { labelKey: 'services.aiSolutions', path: '/services/ai-solutions/' },
  { labelKey: 'services.apisAndProducts', path: '/services/apis-and-products/' },
  { labelKey: 'services.consultingAndAudit', path: '/services/consulting-and-audit/' },
];

export const COMPANY_NAV: NavItem[] = [
  { labelKey: 'nav.about', path: '/about/' },
  { labelKey: 'nav.howWeWork', path: '/how-we-work/' },
  { labelKey: 'nav.work', path: '/work/' },
  { labelKey: 'nav.contact', path: '/contact/' },
];

export const RESOURCE_NAV: NavItem[] = [
  { labelKey: 'nav.blog', path: '/blog/' },
  { labelKey: 'nav.products', path: '/products/' },
];

export const LEGAL_NAV: NavItem[] = [
  { labelKey: 'footer.legalNotice', path: '/legal/notice/' },
  { labelKey: 'footer.privacyPolicy', path: '/legal/privacy/' },
];

/**
 * True when `path` is the current page or one of its descendants, so
 * `/services/ai-solutions/` also lights up "Services".
 */
export function isActivePath(currentPath: string, itemPath: string, localePrefix = ''): boolean {
  const target = `${localePrefix}${itemPath}`;
  if (target === `${localePrefix}/`) return currentPath === target;
  return currentPath === target || currentPath.startsWith(target);
}
