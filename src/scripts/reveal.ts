/**
 * Scroll reveals.
 *
 * Elements marked `data-reveal` fade and rise once as they enter the
 * viewport, then are unobserved — the brief calls for a single pass, never a
 * re-trigger on scroll back.
 *
 * The hidden starting state lives in CSS behind both `.js` and
 * `prefers-reduced-motion: no-preference`, so if this script never runs, or
 * the visitor has asked for less motion, the content is simply there.
 */

const REVEAL_SELECTOR = '[data-reveal]';

/** Fires slightly before the element is fully in view, so the motion reads as
    part of the scroll rather than a delayed reaction to it. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.15,
};

function revealAll(elements: NodeListOf<HTMLElement>): void {
  elements.forEach((element) => element.classList.add('is-revealed'));
}

export function initReveals(): void {
  const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll(elements);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, OBSERVER_OPTIONS);

  elements.forEach((element) => {
    // Anything already on screen at load reveals immediately rather than
    // waiting for a scroll that may never come on a short page.
    observer.observe(element);
  });
}
