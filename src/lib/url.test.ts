import { describe, expect, it } from 'vitest';
import { joinBase } from './url';

describe('joinBase', () => {
  it('works with the root base', () => {
    expect(joinBase('/', '')).toBe('/');
    expect(joinBase('/', 'impressum')).toBe('/impressum');
    expect(joinBase('/', '/qr/1417304')).toBe('/qr/1417304');
  });

  it('works under a sub-path with or without trailing slash', () => {
    expect(joinBase('/preview', '')).toBe('/preview/');
    expect(joinBase('/preview/', 'impressum')).toBe('/preview/impressum');
    expect(joinBase('/preview', '/api/eprel/1')).toBe('/preview/api/eprel/1');
  });
});
