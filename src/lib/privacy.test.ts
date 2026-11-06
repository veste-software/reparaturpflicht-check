import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...sourceFiles(p));
    else if (/\.(ts|tsx|astro|js|mjs)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

const files = [...sourceFiles('src'), ...sourceFiles('functions')];

describe('privacy scan', () => {
  it('finds source files to scan', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it.each(['document.cookie', 'localStorage', 'sessionStorage', 'Set-Cookie'])('has no %s', (needle) => {
    const hits = files.filter((f) => readFileSync(f, 'utf8').includes(needle));
    expect(hits).toEqual([]);
  });

  it('loads no external script besides the analytics variable', () => {
    const hits: string[] = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/<script[^>]*\ssrc=([^>]*)>/g)) {
        if (!m[1].includes('analyticsSrc')) hits.push(`${f}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
