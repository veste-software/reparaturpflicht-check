import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('legal page drafts', () => {
  for (const page of ['impressum', 'datenschutz']) {
    const src = readFileSync(`src/pages/${page}.astro`, 'utf8');
    it(`${page} is marked ENTWURF and has bracketed placeholders`, () => {
      expect(src).toContain('ENTWURF');
      expect(src).toMatch(/\[[^\]]+\]/);
    });
  }

  it('datenschutz covers hosting, EPREL, analytics, affiliate and rights', () => {
    const src = readFileSync('src/pages/datenschutz.astro', 'utf8');
    for (const word of ['Cloudflare', 'EPREL', 'Reichweitenmessung', 'Affiliate', 'Deine Rechte', 'Aufsichtsbehörde']) {
      expect(src).toContain(word);
    }
  });
});
