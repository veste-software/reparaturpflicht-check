/**
 * Join the configured base path (SITE_BASE, e.g. "/" or "/repo") with an internal path.
 * Every internal link and asset reference must go through this, so the GitHub Pages
 * preview under /<repo>/ works exactly like the root-domain production site.
 */
export function joinBase(base: string, path = ''): string {
  const b = (base || '/').replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  if (!p) return `${b}/`;
  return `${b}/${p}`;
}

/** Internal link relative to the build's base path. */
export function withBase(path = ''): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
