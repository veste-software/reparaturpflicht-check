// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / SITE_BASE are set by the GitHub Pages preview workflow (sub-path /<repo>/)
// and by the production host (custom domain, base "/"). Local builds fall back to localhost and "/".
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.SITE_BASE || '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  // sitemap.xml is our own endpoint (src/pages/sitemap.xml.ts) so the file name matches SPEC §6.16
  // and /qr/* stays out of it.
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});
