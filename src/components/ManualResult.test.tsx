import { describe, expect, it, vi } from 'vitest';
import { render } from 'preact-render-to-string';
import { ManualResult } from './ManualResult';

describe('ManualResult', () => {
  it('computes 27.12.2034 for Waschmaschine + 2024-12-27 without any network call', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const html = render(<ManualResult groupId="waschmaschine" mode="ended" endDate="2024-12-27" today="2026-11-06" />);
    expect(html).toContain('27.12.2034');
    expect(html).toContain('Keine Rechtsberatung');
    expect(html).not.toContain('Gewährleistung beim Verkäufer');
    expect(fetchSpy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('works for Schnurlostelefon and still-selling models', () => {
    expect(render(<ManualResult groupId="schnurlostelefon" mode="ended" endDate="2026-01-10" today="2026-11-06" />)).toContain('10.01.2033');
    expect(render(<ManualResult groupId="waschmaschine" mode="still_selling" endDate="" today="2026-11-06" />)).toContain('noch in Verkehr gebracht');
  });

  it('renders nothing without a group or a valid date', () => {
    expect(render(<ManualResult groupId="" mode="still_selling" endDate="" today="2026-11-06" />)).toBe('');
    expect(render(<ManualResult groupId="waschmaschine" mode="ended" endDate="" today="2026-11-06" />)).toBe('');
  });

  it('shows the warranty hint above the manufacturer result', () => {
    const html = render(
      <ManualResult groupId="waschmaschine" mode="ended" endDate="2024-12-27" purchaseDate="2025-06-01" today="2026-11-06" />,
    );
    const hint = html.indexOf('Zuerst kostenlos: Gewährleistung beim Verkäufer');
    expect(hint).toBeGreaterThan(-1);
    expect(hint).toBeLessThan(html.indexOf('27.12.2034'));
  });
});
