import { describe, expect, it } from 'vitest';
import { render as renderToString } from 'preact-render-to-string';
import { h } from 'preact';
import { affiliateSlots } from './affiliate';
import AffiliateSlots from '../components/AffiliateSlots';

const covered = { kind: 'covered', deadline: '2034-12-27', years: 10 } as const;
const expired = { kind: 'expired', deadline: '2020-01-01', years: 7 } as const;

describe('affiliateSlots', () => {
  it('only returns the neutral link when env is unset', () => {
    const s = affiliateSlots({ groupId: 'waschmaschine', deadline: covered, model: 'WAJ240L2SN' }, {});
    expect(s).toHaveLength(1);
    expect(s[0].sponsored).toBe(false);
  });

  it('url-encodes the model into the parts template', () => {
    const s = affiliateSlots(
      { groupId: 'waschmaschine', deadline: covered, model: 'WAJ 240/L2' },
      { PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE: 'https://shop.example/s?q={model}' },
    );
    expect(s[0].href).toBe('https://shop.example/s?q=WAJ%20240%2FL2');
    expect(s[0].badge).toBe('Anzeige');
  });

  it('shows refurb only for phone/TV with expired or not covered results', () => {
    const env = { PUBLIC_AFFILIATE_REFURB_URL: 'https://refurb.example/' };
    expect(affiliateSlots({ groupId: 'smartphone-tablet', deadline: expired }, env).some((x) => x.id === 'refurb')).toBe(true);
    expect(affiliateSlots({ groupId: 'smartphone-tablet', deadline: covered }, env).some((x) => x.id === 'refurb')).toBe(false);
    expect(affiliateSlots({ groupId: 'waschmaschine', deadline: expired }, env).some((x) => x.id === 'refurb')).toBe(false);
  });

  it('rejects non-http templates', () => {
    const s = affiliateSlots(
      { groupId: 'waschmaschine', deadline: covered, model: 'X' },
      { PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE: 'javascript:alert({model})' },
    );
    expect(s.some((x) => x.sponsored)).toBe(false);
  });
});

describe('AffiliateSlots component', () => {
  it('renders no sponsored markup without env', () => {
    const html = renderToString(h(AffiliateSlots, { groupId: 'waschmaschine', deadline: covered, model: 'X', testEnv: {} as never }));
    expect(html).not.toContain('sponsored');
    expect(html).toContain('Reparaturcafé');
  });

  it('renders rel and label with env', () => {
    const html = renderToString(
      h(AffiliateSlots, {
        groupId: 'waschmaschine',
        deadline: covered,
        model: 'X',
        testEnv: { PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE: 'https://shop.example/?q={model}', PUBLIC_AFFILIATE_REFURB_URL: undefined },
      }),
    );
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain('Anzeige');
    expect(html).toContain('target="_blank"');
  });
});
