/** Pages that are legally required but carry no search value; kept out of the sitemap. */
const EXCLUDED = new Set(['404', 'impressum', 'datenschutz']);

/**
 * Turn page file keys from import.meta.glob('./**\/*.astro') into sitemap paths.
 * Excludes 404, legal pages, dynamic routes ([param]) and everything under qr/ (noindex).
 */
export function sitemapPaths(pageFiles: string[]): string[] {
  return pageFiles
    .map((f) => f.replace(/^\.\//, '').replace(/\.astro$/, ''))
    .filter((p) => !p.includes('['))
    .filter((p) => !/^qr(\/|$)/.test(p))
    .map((p) => (p === 'index' ? '' : p.replace(/\/index$/, '')))
    .filter((p) => !EXCLUDED.has(p))
    .sort();
}
