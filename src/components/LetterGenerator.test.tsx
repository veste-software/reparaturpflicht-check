import { describe, expect, it, vi } from 'vitest';
import { render } from 'preact-render-to-string';
import LetterGenerator from './LetterGenerator';
import { computeDeadline } from '../lib/deadline';
import type { EprelRecord } from '../lib/eprel';

// SYNTHETIC record (never shown to users).
const record: EprelRecord = {
  eprelRegistrationNumber: '1417304',
  productGroup: 'washingmachines2019',
  modelIdentifier: 'WAJ240L2SN',
  supplierOrTrademark: 'Bosch',
  onMarketStartDate: null,
  onMarketEndDate: '2024-12-27',
  energyClass: null,
  contactDetails: {
    serviceName: 'Bosch Service', organisationTitle: null, streetName: null, streetNumber: null,
    postalCode: null, city: 'München', country: null, phone: null, email: 'service@example.invalid', webSiteURL: null,
  },
  webLinkSupplier: null,
};
const today = '2026-11-06';

describe('LetterGenerator', () => {
  it('renders a labelled form, the preview and a mailto link without any network call', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const html = render(
      <LetterGenerator record={record} today={today} deadline={computeDeadline('waschmaschine', '2024-12-27', today)} />,
    );
    vi.unstubAllGlobals();
    expect(html).toContain('for="letter-name"');
    expect(html).toContain('for="letter-fault"');
    expect(html).toContain('27.12.2034');
    expect(html).toContain('href="mailto:service@example.invalid?subject=');
    expect(html).toContain('Kopieren');
    expect(html).toContain('Drucken / als PDF speichern');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows model fields and no mailto in manual mode', () => {
    const html = render(
      <LetterGenerator manual={{ groupId: 'waschmaschine', model: '' }} today={today} deadline={null} />,
    );
    expect(html).toContain('for="letter-model"');
    expect(html).not.toContain('mailto:');
  });
});
