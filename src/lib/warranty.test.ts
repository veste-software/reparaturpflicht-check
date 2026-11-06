import { describe, expect, it } from 'vitest';
import { isWithinWarranty } from './warranty';

describe('isWithinWarranty', () => {
  const today = '2026-11-06';
  it('is true under 2 years', () => {
    expect(isWithinWarranty('2025-11-06', today)).toBe(true);
    expect(isWithinWarranty('2024-11-07', today)).toBe(true);
    expect(isWithinWarranty(today, today)).toBe(true);
  });
  it('is false at exactly 2 years and older', () => {
    expect(isWithinWarranty('2024-11-06', today)).toBe(false);
    expect(isWithinWarranty('2020-01-01', today)).toBe(false);
  });
  it('is false for empty, malformed or future dates', () => {
    expect(isWithinWarranty('', today)).toBe(false);
    expect(isWithinWarranty(null, today)).toBe(false);
    expect(isWithinWarranty('06.11.2025', today)).toBe(false);
    expect(isWithinWarranty('2027-01-01', today)).toBe(false);
  });
  it('handles 29 February', () => {
    expect(isWithinWarranty('2024-02-29', '2026-02-27')).toBe(true);
    expect(isWithinWarranty('2024-02-29', '2026-02-28')).toBe(false);
  });
});
