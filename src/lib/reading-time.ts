/**
 * Reading time from raw Markdown.
 *
 * Deliberately approximate. The number exists to set expectations — "is this
 * two minutes or twelve" — so precision would be false comfort. Code blocks
 * are excluded because nobody reads them at prose speed, and counting them
 * inflates technical articles substantially.
 */

const WORDS_PER_MINUTE = 220;

export function readingTimeMinutes(markdown: string): number {
  const prose = markdown
    // Fenced code blocks.
    .replace(/```[\s\S]*?```/g, ' ')
    // Inline code, links and emphasis markers.
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ');

  const words = prose.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
