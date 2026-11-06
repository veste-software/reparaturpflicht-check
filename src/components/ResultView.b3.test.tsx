import { describe, expect, it } from 'vitest';
import { render } from 'preact-render-to-string';
import { ResultView } from './ResultView';
import type { EprelRecord } from '../lib/eprel';

// SYNTHETIC test records (never shown to users).
const base: EprelRecord = {
  eprelRegistrationNumber: '1',
  productGroup: 'lightsources',
  modelIdentifier: 'TEST-1',
  supplierOrTrademark: 'Testmarke',
  onMarketStartDate: null,
  onMarketEndDate: null,
  energyClass: null,
  contactDetails: null,
  webLinkSupplier: null,
};
const props = { today: '2026-11-06', fetchedAt: '2026-11-06T10:00:00Z' };

describe('unknown group and not-covered texts', () => {
  it('explains that lightsources have no parts period and names the exceptions', () => {
    const html = render(<ResultView {...props} record={base} />);
    expect(html).toContain('Für diese Produktgruppe gibt es (noch) keine Ersatzteilfrist');
    expect(html).toContain('Staubsauger');
    expect(html).toContain('Batterien');
    expect(html).toContain('Datenspeicher');
  });

  it('explains the start date and points to warranty for a dishwasher ending 2020-06-30', () => {
    const html = render(
      <ResultView {...props} record={{ ...base, productGroup: 'dishwashers2019', onMarketEndDate: '2020-06-30' }} />,
    );
    expect(html).toContain('Wahrscheinlich nicht erfasst');
    expect(html).toContain('ab dem die Ersatzteilpflicht gilt');
    expect(html).toContain('Gewährleistung');
    expect(html).toContain('freiwillige Angebote');
  });
});
