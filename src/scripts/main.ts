/**
 * Single client entry point.
 *
 * Everything runs on `astro:page-load`, which Astro's view transitions fire
 * both on first paint and after every navigation. Binding to `DOMContentLoaded`
 * instead would leave the behaviours dead on every page after the first.
 */

import { initReveals } from './reveal';
import { initHeader } from './header';
import { initCounters } from './counter';

function init(): void {
  initHeader();
  initReveals();
  initCounters();
}

document.addEventListener('astro:page-load', init);
