import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildLetter, buildMailto, buildSubject } from './letter';
import { computeDeadline } from './deadline';
import { groupFromEprel } from './rules';
import type { EprelRecord } from './eprel';

// SYNTHETIC record (real fixture still missing, PLAN A1).
const record: EprelRecord = {
  eprelRegistrationNumber: '1417304',
  productGroup: 'washingmachines2019',
  modelIdentifier: 'WAJ240L2SN',
  supplierOrTrademark: 'Bosch',
  onMarketStartDate: '2022-11-30',
  onMarketEndDate: '2024-12-27',
  energyClass: 'B',
  contactDetails: {
    serviceName: 'Bosch Service', organisationTitle: null, streetName: 'Teststraße', streetNumber: '1',
    postalCode: '80000', city: 'München', country: 'DE', phone: null, email: 'service@example.invalid', webSiteURL: null,
  },
  webLinkSupplier: null,
};
const today = '2026-11-06';
const deadline = computeDeadline(groupFromEprel(record.productGroup), record.onMarketEndDate, today);
const user = { name: 'Erika Muster', address: 'Hauptstr. 2\n10115 Berlin', fault: 'Pumpe defekt' };

describe('buildLetter', () => {
  it('contains the key facts', () => {
    const text = buildLetter({ record, deadline, user, today });
    for (const s of ['WAJ240L2SN', '1417304', '27.12.2034', '§§ 479a ff. BGB', 'Bosch Service', 'München', 'Erika Muster', 'Pumpe defekt', 'Kostenvoranschlag', '06.11.2026']) {
      expect(text).toContain(s);
    }
  });

  it('works in manual mode with placeholders for missing data', () => {
    const text = buildLetter({
      manual: { groupId: 'waschmaschine', model: 'XY-1' },
      deadline: computeDeadline('waschmaschine', '2024-12-27', today),
      user: { name: '', address: '', fault: '' },
      today,
    });
    expect(text).toContain('XY-1');
    expect(text).toContain('[Deine Anschrift]');
    expect(text).toContain('[Nummer]');
    expect(text).toContain('Kostenvoranschlag');
  });

  it('builds a mailto only with an e-mail', () => {
    const body = buildLetter({ record, deadline, user, today });
    const href = buildMailto(record.contactDetails?.email, buildSubject(record), body)!;
    expect(href.startsWith('mailto:service@example.invalid?subject=')).toBe(true);
    expect(href).toContain('body=');
    expect(href).not.toContain('\n');
    expect(buildMailto(null, 's', 'b')).toBeNull();
  });

  it('never fetches (pure module)', () => {
    const src = readFileSync(new URL('./letter.ts', import.meta.url), 'utf8');
    expect(src).not.toContain('fetch(');
  });
});
