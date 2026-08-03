/**
 * Count-up for key figures, triggered when the number enters the viewport.
 *
 * The final value is rendered server-side and is what a visitor without
 * JavaScript — or with reduced motion — sees. This script only replaces it
 * with a brief animation up to the same number, so the figure is never
 * dependent on script execution.
 */

const COUNTER_SELECTOR = '[data-counter]';
const DURATION_MS = 1400;

/** Decelerating, no overshoot — matches --ease-precise in global.css. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function animate(element: HTMLElement): void {
  const target = Number(element.dataset.counter);
  if (!Number.isFinite(target)) return;

  const finalText = element.textContent ?? String(target);
  // Preserve whatever the server rendered around the number ("6", "10+", …).
  const suffix = finalText.replace(/[\d\s,.]/g, '');
  const start = performance.now();

  const step = (now: number): void => {
    const progress = Math.min((now - start) / DURATION_MS, 1);
    const value = Math.round(easeOut(progress) * target);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = finalText;
    }
  };

  requestAnimationFrame(step);
}

export function initCounters(): void {
  const elements = document.querySelectorAll<HTMLElement>(COUNTER_SELECTOR);
  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 },
  );

  elements.forEach((element) => observer.observe(element));
}
