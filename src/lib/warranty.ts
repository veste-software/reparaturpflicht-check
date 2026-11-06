import { addYears } from './deadline';

/**
 * True when the purchase was less than 2 years before `today` (calendar dates, `YYYY-MM-DD`).
 * Exactly 2 years ago counts as outside the warranty. Invalid or future-free input → false.
 */
export function isWithinWarranty(purchaseDate: string | null | undefined, today: string): boolean {
  if (!purchaseDate || !/^\d{4}-\d{2}-\d{2}$/.test(purchaseDate)) return false;
  if (purchaseDate > today) return false;
  return addYears(purchaseDate, 2) > today;
}
