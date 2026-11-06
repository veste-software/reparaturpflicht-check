import { describe, expect, it } from 'vitest';
import { GROUPS, groupFromEprel, periodText } from './rules';

describe('rules', () => {
  it('maps EPREL groups by prefix', () => {
    expect(groupFromEprel('washingmachines2019')?.label).toBe('Waschmaschine');
    expect(groupFromEprel('smartphones2023')?.label).toBe('Smartphone / Tablet');
    expect(groupFromEprel('lightsources')).toBeNull();
    expect(groupFromEprel(undefined)).toBeNull();
  });
  it('has 8 groups with unique ids', () => {
    expect(new Set(GROUPS.map((g) => g.id)).size).toBe(8);
  });
  it('shows the part split text where periods differ', () => {
    expect(periodText(GROUPS.find((g) => g.id === 'geschirrspueler')!)).toBe('7 oder 10 Jahre je nach Ersatzteil');
    expect(periodText(GROUPS.find((g) => g.id === 'waschmaschine')!)).toBe('10 Jahre');
  });
});
