import { describe, expect, it } from 'vitest';
import { addYears, computeDeadline } from './deadline';
import { formatDate } from './format';

const today = '2026-11-06';

describe('computeDeadline (SPEC §6.2)', () => {
  it('washing machine, end 2024-12-27 → covered until 2034-12-27', () => {
    expect(computeDeadline('waschmaschine', '2024-12-27', today)).toMatchObject({ kind: 'covered', deadline: '2034-12-27' });
  });
  it('smartphone, end 2027-12-15 → 2034-12-15', () => {
    expect(computeDeadline('smartphone-tablet', '2027-12-15', today)).toMatchObject({ kind: 'covered', deadline: '2034-12-15' });
  });
  it('dishwasher, end 2020-06-30 → not covered', () => {
    expect(computeDeadline('geschirrspueler', '2020-06-30', today)).toEqual({ kind: 'not_covered', appliesFrom: '2021-03-01' });
  });
  it('washing machine, end null → still on market, minimum today + 10 years', () => {
    expect(computeDeadline('waschmaschine', null, today)).toMatchObject({ kind: 'still_on_market', minimumDate: '2036-11-06' });
  });
  it('washing machine, end 2050-12-31 → still on market', () => {
    expect(computeDeadline('waschmaschine', '2050-12-31', today).kind).toBe('still_on_market');
  });
  it('TV, end 2021-05-01, today 2029-01-01 → expired 2028-05-01', () => {
    expect(computeDeadline('fernseher-monitor', '2021-05-01', '2029-01-01')).toMatchObject({ kind: 'expired', deadline: '2028-05-01' });
  });
  it('unknown group → no parts period', () => {
    expect(computeDeadline(null, '2024-01-01', today)).toEqual({ kind: 'no_parts_period' });
    expect(computeDeadline('lightsources', '2024-01-01', today)).toEqual({ kind: 'no_parts_period' });
  });
});

describe('date helpers', () => {
  it('29 Feb moves to 28 Feb in non-leap years', () => {
    expect(addYears('2024-02-29', 10)).toBe('2034-02-28');
    expect(addYears('2024-02-29', 4)).toBe('2028-02-29');
  });
  it('formats German dates', () => {
    expect(formatDate('2034-12-27')).toBe('27.12.2034');
  });
});
