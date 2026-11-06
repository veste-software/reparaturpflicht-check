// Checks the static build in dist/. Run after `npm run build` or `npm run build:preview`.
// Usage: node scripts/check-dist.mjs [distDir] [basePath]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] || 'dist';
const base = (process.argv[3] || process.env.SITE_BASE || '/').replace(/\/+$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const errors = [];
const titles = new Map();
const FORBIDDEN = ['kostenlose Reparatur garantiert', 'Ihr Anspruch besteht'];

for (const f of htmlFiles) {
  const rel = relative(dist, f).replace(/\\/g, '/');
  const html = readFileSync(f, 'utf8');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${rel}: expected 1 <h1>, found ${h1}`);
  if (!/<html[^>]*\slang="de"/.test(html)) errors.push(`${rel}: missing lang="de"`);
  if (!/<meta name="viewport"/.test(html)) errors.push(`${rel}: missing viewport meta`);
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1];
  if (!title) errors.push(`${rel}: missing <title>`);
  else {
    if (titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
  }
  if (rel.startsWith('qr/') && !html.includes('<meta name="robots" content="noindex">')) {
    errors.push(`${rel}: /qr/ page without noindex`);
  }
  if (/rel="[^"]*sponsored/.test(html) && !process.env.PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE && !process.env.PUBLIC_AFFILIATE_REFURB_URL) {
    errors.push(`${rel}: sponsored link although affiliate env is unset`);
  }
  for (const phrase of FORBIDDEN) if (html.includes(phrase)) errors.push(`${rel}: forbidden phrase "${phrase}"`);
  if (base) {
    for (const m of html.matchAll(/\s(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
      const url = m[1];
      if (!url.startsWith(`${base}/`) && url !== base) errors.push(`${rel}: internal URL without base: ${url}`);
    }
  }
}

const sitemapPath = join(dist, 'sitemap.xml');
let sitemap = '';
try {
  sitemap = readFileSync(sitemapPath, 'utf8');
} catch {
  errors.push('sitemap.xml missing');
}
if (sitemap) {
  const required = [
    '',
    'waschmaschine',
    'geschirrspueler',
    'kuehlschrank',
    'waschtrockner',
    'trockner',
    'fernseher-monitor',
    'smartphone-tablet',
    'musterbrief',
    'registriernummer-finden',
    'methodik',
  ];
  for (const p of required) {
    const re = new RegExp(`<loc>[^<]*${base}/${p}/?</loc>`.replace('//', '/'));
    if (!re.test(sitemap)) errors.push(`sitemap.xml: missing /${p}`);
  }
  if (/<loc>[^<]*\/qr\//.test(sitemap)) errors.push('sitemap.xml: contains /qr/ URL');
}

if (errors.length) {
  console.error(`check-dist: ${errors.length} problem(s)\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-dist: ${htmlFiles.length} HTML files OK`);
