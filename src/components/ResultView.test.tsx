import { describe, expect, it } from 'vitest';
import { render } from 'preact-render-to-string';
import { ResultView } from './ResultView';
import type { EprelRecord } from '../lib/eprel';

// SYNTHETIC test record (the real EPREL fixture, PLAN A1, is not committed yet). Test-only, never shown to users.
const record: EprelRecord = {
  eprelRegistrationNumber: '1417304',
  productGroup: 'washingmachines2019',
  modelIdentifier: 'WAJ240L2SN',
  supplierOrTrademark: 'Bosch',
  onMarketStartDate: '2022-11-30',
  onMarketEndDate: '2024-12-27',
  energyClass: 'B',
  contactDetails: {
    serviceName: 'Bosch Service',
    organisationTitle: null,
    streetName: 'Teststraße',
    streetNumber: '1',
    postalCode: '80000',
    city: 'München',
    country: 'DE',
    phone: '000',
    email: 'service@example.invalid',
    webSiteURL: null,
  },
  webLinkSupplier: null,
};

const fetchedAt = '2026-11-06T10:00:00Z';

describe('ResultView', () => {
  it('shows model, dates, contact and EPREL link', () => {
    const html = render(<ResultView record={record} today="2026-11-06" fetchedAt={fetchedAt} />);
    for (const s of ['Bosch', 'WAJ240L2SN', '27.12.2024', '27.12.2034', 'Bosch Service', 'München']) {
      expect(html).toContain(s);
    }
    expect(html).toContain('https://eprel.ec.europa.eu/qr/1417304');
    expect(html).toContain('Hersteller muss reparieren bis 27.12.2034');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('angemessenes Entgelt');
    expect(html).toContain('Keine Rechtsberatung');
    expect(html).toContain('06.11.2026, 10:00 UTC');
  });

  it('puts the warranty hint above the manufacturer result only for recent purchases', () => {
    const recent = render(<ResultView record={record} today="2026-11-06" fetchedAt={fetchedAt} purchaseDate="2025-06-01" />);
    const hint = recent.indexOf('Zuerst kostenlos: Gewährleistung beim Verkäufer');
    expect(hint).toBeGreaterThan(-1);
    expect(hint).toBeLessThan(recent.indexOf('Hersteller muss reparieren'));
    const old = render(<ResultView record={record} today="2026-11-06" fetchedAt={fetchedAt} purchaseDate="2020-06-01" />);
    expect(old).not.toContain('Zuerst kostenlos');
  });

  it('shows expired, still-on-market, not-covered and no-period states', () => {
    const base = { today: '2026-11-06', fetchedAt };
    expect(render(<ResultView {...base} record={{ ...record, onMarketEndDate: '2010-01-01' }} />)).toContain('Wahrscheinlich nicht erfasst');
    expect(render(<ResultView {...base} record={{ ...record, onMarketEndDate: '2021-03-02' }} />)).toContain('Hersteller muss reparieren bis 02.03.2031');
    expect(render(<ResultView {...base} record={{ ...record, onMarketEndDate: null }} />)).toContain('noch in Verkehr gebracht');
    expect(render(<ResultView {...base} record={{ ...record, productGroup: 'lightsources' }} />)).toContain('keine Ersatzteilfrist');
    expect(render(<ResultView today="2040-01-01" fetchedAt={fetchedAt} record={record} />)).toContain('Frist abgelaufen am 27.12.2034');
  });
});
