import { describe, expect, it, vi } from 'vitest';
import { handleEprelRequest } from './eprel-proxy';
import { EPREL_FIELDS, CONTACT_FIELDS } from './eprel';

// Synthetic raw response shaped like EPREL's (the recorded fixture of A1 is still pending).
const raw = {
  eprelRegistrationNumber: '1417304',
  productGroup: 'washingmachines2019',
  modelIdentifier: 'TEST-MODEL',
  supplierOrTrademark: 'TestBrand',
  onMarketStartDate: [2022, 1, 5],
  onMarketEndDate: [2024, 12, 27],
  energyClass: 'A',
  webLinkSupplier: 'https://example.com',
  internalSecret: 'must not leak',
  contactDetails: { serviceName: 'Test Service', city: 'Berlin', email: 'a@example.com', fax: 'x' },
};
const ok = (body: unknown, status = 200) => vi.fn(async (..._a: unknown[]) => new Response(JSON.stringify(body), { status }));
const env = { EPREL_USER_AGENT_CONTACT: 'test@example.com' };
const asFetch = (f: unknown) => f as typeof fetch;

describe('handleEprelRequest', () => {
  it('returns only whitelisted fields with ISO dates', async () => {
    const f = ok(raw);
    const res = await handleEprelRequest('1417304', asFetch(f), env, () => new Date('2026-01-01T00:00:00Z'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=86400');
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual([...EPREL_FIELDS, 'fetchedAt'].sort());
    expect(Object.keys(body.contactDetails).sort()).toEqual([...CONTACT_FIELDS].sort());
    expect(body.onMarketEndDate).toBe('2024-12-27');
    expect(body.fetchedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(JSON.stringify(body)).not.toContain('leak');
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://eprel.ec.europa.eu/api/product/1417304');
    expect((init.headers as Record<string, string>)['User-Agent']).toBe('Reparaturpflicht-Check (+test@example.com)');
  });

  it('returns 400 for non-numeric ids without calling EPREL', async () => {
    const f = ok(raw);
    const res = await handleEprelRequest('abc', asFetch(f), env);
    expect(res.status).toBe(400);
    expect(f).not.toHaveBeenCalled();
  });

  it('returns 404 with German message for unknown products', async () => {
    for (const f of [ok({}, 404), ok({}, 200)]) {
      const res = await handleEprelRequest('1', asFetch(f), env);
      expect(res.status).toBe(404);
      expect((await res.json()).error).toContain('EPREL');
    }
  });

  it('returns 502 on network error, 5xx and invalid JSON', async () => {
    const fails = [
      vi.fn(async () => {
        throw new Error('boom at stack.ts:1');
      }),
      ok({}, 503),
      vi.fn(async () => new Response('<html>', { status: 200 })),
    ];
    for (const f of fails) {
      const res = await handleEprelRequest('1', asFetch(f), env);
      expect(res.status).toBe(502);
      const text = await res.text();
      expect(text).toContain('nicht erreichbar');
      expect(text).not.toContain('stack.ts');
    }
  });
});
