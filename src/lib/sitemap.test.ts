import { describe, expect, it } from 'vitest';
import { sitemapPaths } from './sitemap';

describe('sitemapPaths', () => {
  it('keeps content pages and drops 404, legal, dynamic and /qr/ pages', () => {
    const files = [
      './index.astro',
      './404.astro',
      './impressum.astro',
      './datenschutz.astro',
      './waschmaschine.astro',
      './qr/index.astro',
      './qr/1417304.astro',
      './qr/[n].astro',
      './methodik.astro',
    ];
    expect(sitemapPaths(files)).toEqual(['', 'methodik', 'waschmaschine']);
  });
});
