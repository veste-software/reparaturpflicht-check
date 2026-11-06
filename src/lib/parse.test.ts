import { describe, expect, it } from 'vitest';
import { parseRegistrationInput } from './parse';

describe('parseRegistrationInput', () => {
  it.each([
    '1417304',
    ' 1417304 ',
    'https://eprel.ec.europa.eu/qr/1417304',
    'eprel.ec.europa.eu/qr/1417304?x=1',
    'https://eprel.ec.europa.eu/screen/product/washingmachines2019/1417304',
  ])('accepts %s', (input) => {
    expect(parseRegistrationInput(input)).toEqual({ ok: true, id: 1417304 });
  });

  it.each(['abc', '', '   ', 'eprel.ec.europa.eu/qr/', '-5', '12345678901', '0', 'https://example.com/qr/123'])(
    'rejects %j with a German error',
    (input) => {
      const r = parseRegistrationInput(input);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.length).toBeGreaterThan(10);
    },
  );
});
