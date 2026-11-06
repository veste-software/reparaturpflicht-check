import { groupById, type RuleGroup } from './rules';

/** Calendar dates as `YYYY-MM-DD`. */
export type DeadlineResult =
  | { kind: 'covered'; deadline: string; years: number }
  | { kind: 'expired'; deadline: string; years: number }
  | { kind: 'still_on_market'; minimumDate: string; years: number }
  | { kind: 'not_covered'; appliesFrom: string }
  | { kind: 'no_parts_period' };

/** Add years to a calendar date; 29 Feb in a non-leap target year becomes 28 Feb. */
export function addYears(date: string, years: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const ty = y + years;
  const leap = (ty % 4 === 0 && ty % 100 !== 0) || ty % 400 === 0;
  const day = m === 2 && d === 29 && !leap ? 28 : d;
  return `${String(ty).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Compute the end of the manufacturer's spare-parts / repair period.
 * `group` is a rule group (or its id); null/unknown → no parts period.
 * `onMarketEndDate` null/undefined means EPREL has no end date.
 */
export function computeDeadline(
  group: RuleGroup | string | null,
  onMarketEndDate: string | null | undefined,
  today: string,
): DeadlineResult {
  const g = typeof group === 'string' ? groupById(group) : group;
  if (!g) return { kind: 'no_parts_period' };

  // Placeholder rule: no end date, or an end date 3+ years ahead, means "still sold".
  if (!onMarketEndDate || onMarketEndDate >= addYears(today, 3)) {
    return { kind: 'still_on_market', minimumDate: addYears(today, g.years), years: g.years };
  }
  if (onMarketEndDate < g.appliesFrom) return { kind: 'not_covered', appliesFrom: g.appliesFrom };

  const deadline = addYears(onMarketEndDate, g.years);
  return deadline >= today
    ? { kind: 'covered', deadline, years: g.years }
    : { kind: 'expired', deadline, years: g.years };
}
