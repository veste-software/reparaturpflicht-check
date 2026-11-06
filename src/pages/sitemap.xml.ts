import type { APIRoute } from 'astro';
import { sitemapPaths } from '../lib/sitemap';
import { withBase } from '../lib/url';

// Every static .astro page except 404, dynamic routes and the noindex /qr/* result pages.
const pageFiles = Object.keys(import.meta.glob('./**/*.astro'));

export const GET: APIRoute = ({ site }) => {
  const urls = sitemapPaths(pageFiles)
    .map((p) => `  <url><loc>${new URL(withBase(p), site).href}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
