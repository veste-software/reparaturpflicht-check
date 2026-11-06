import { describe, expect, it, vi } from 'vitest';
import { idFromQrPath, lookupRegistration } from './lookup';

const reply = (status: number, body: unknown) =>
  vi.fn(async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status })) as unknown as typeof fetch;

describe('lookupRegistration', () => {
  it('returns record and fetchedAt on success', async () => {
    const f = reply(200, { productGroup: 'washingmachines2019', modelIdentifier: 'X', fetchedAt: '2026-11-06T10:00:00Z' });
    const r = await lookupRegistration(5, '/api/eprel/', f);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fetchedAt).toBe('2026-11-06T10:00:00Z');
      expect(r.record.modelIdentifier).toBe('X');
      expect('fetchedAt' in r.record).toBe(false);
    }
    expect(f).toHaveBeenCalledWith('/api/eprel/5', expect.anything());
  });
  it('maps 404, 502, non-JSON and offline to German messages', async () => {
    expect(await lookupRegistration(5, '/a/', reply(404, { error: 'Kein Eintrag.' }))).toEqual({ ok: false, error: 'Kein Eintrag.' });
    const bad = await lookupRegistration(5, '/a/', reply(502, { error: 'Nicht erreichbar.' }));
    expect(bad).toEqual({ ok: false, error: 'Nicht erreichbar.' });
    const html = await lookupRegistration(5, '/a/', reply(404, '<html>'));
    expect(html.ok).toBe(false);
    const off = await lookupRegistration(5, '/a/', vi.fn(async () => { throw new Error('x'); }) as unknown as typeof fetch);
    expect(off).toEqual({ ok: false, error: expect.stringContaining('Verbindung') });
  });
});

describe('idFromQrPath', () => {
  it('reads the number under any base', () => {
    expect(idFromQrPath('/qr/1417304')).toBe('1417304');
    expect(idFromQrPath('/preview/qr/1417304/')).toBe('1417304');
    expect(idFromQrPath('/preview/')).toBeNull();
    expect(idFromQrPath('/qr/abc')).toBeNull();
  });
});
