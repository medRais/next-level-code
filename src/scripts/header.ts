/**
 * The intelligent header.
 *
 * Retreats on downward scroll to give the content the full screen, returns on
 * the first upward scroll, and densifies its background once detached from
 * the hero. Only `transform` and `opacity` change, so it stays on the
 * compositor.
 *
 * Under `prefers-reduced-motion` the header simply never hides: a header that
 * slides in and out is exactly the kind of movement that setting asks us to
 * stop making.
 */

/** Below this the header is still visually part of the hero. */
const DETACH_THRESHOLD_PX = 12;

/** Ignore scroll jitter and rubber-banding under this delta. */
const DIRECTION_THRESHOLD_PX = 6;

/** Never hide the header while the visitor is still near the top. */
const HIDE_AFTER_PX = 240;

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lastY = window.scrollY;
  let ticking = false;

  const update = (): void => {
    const currentY = window.scrollY;
    const delta = currentY - lastY;

    header.classList.toggle('is-detached', currentY > DETACH_THRESHOLD_PX);

    if (!prefersReducedMotion && Math.abs(delta) > DIRECTION_THRESHOLD_PX) {
      const scrollingDown = delta > 0;
      // An open mobile menu must never scroll out of reach.
      const menuIsOpen = header.getAttribute('data-menu-open') === 'true';
      header.classList.toggle('is-hidden', scrollingDown && currentY > HIDE_AFTER_PX && !menuIsOpen);
      lastY = currentY;
    } else if (Math.abs(delta) > DIRECTION_THRESHOLD_PX) {
      lastY = currentY;
    }

    ticking = false;
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    // One read per frame — no layout thrashing.
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();

  initMenu(header);
}

/**
 * Mobile menu.
 *
 * The panel carries the `hidden` attribute in the markup, so with JavaScript
 * off it stays closed and the full navigation is still reachable from the
 * footer sitemap. `aria-expanded` and the label are kept in step with the
 * visual state.
 */
function initMenu(header: HTMLElement): void {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = header.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;

  const openLabel = toggle.getAttribute('aria-label') ?? 'Open menu';
  const closeLabel = toggle.dataset.closeLabel ?? openLabel;

  // A navigation that happened with the panel open would otherwise leave the
  // scroll lock behind on the new page.
  document.documentElement.style.overflow = '';

  const setOpen = (open: boolean): void => {
    header.setAttribute('data-menu-open', String(open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
    panel.hidden = !open;
    // Stop the page scrolling behind an open full-height panel.
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Escape closes and returns focus to the control that opened it.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });

  // Following a link inside the panel should not leave it open behind the
  // next page — view transitions keep the DOM alive across navigations.
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  // Returning to desktop width with the panel open would leave the scroll
  // lock in place with no visible way to undo it.
  const desktop = window.matchMedia('(width >= 64rem)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
