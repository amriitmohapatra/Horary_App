/**
 * Step controls of the transit screen (PLAN.md §3.8: 1 s … 10 yr, plus 1 week). Pure.
 * Fixed units add exact multiples of a day; months and years are calendar
 * steps in UT: same day of month and time of day, the day clamped to the
 * end of a shorter month (31 Jan + 1 mo = 28/29 Feb; 29 Feb + 1 y = 28 Feb).
 * Calendar of julian.ts (Gregorian from 1582-10-15).
 */
import { fromJulianDay, julianDay } from '../time/julian';

export type StepUnit = 's' | 'min' | 'h' | 'd' | 'w' | 'mo' | 'y' | '10y';

const FIXED: Partial<Record<StepUnit, number>> = { s: 1 / 86400, min: 1 / 1440, h: 1 / 24, d: 1, w: 7 };
const MONTHS: Partial<Record<StepUnit, number>> = { mo: 1, y: 12, '10y': 120 };

const daysInMonth = (y: number, m: number) =>
  Math.round(julianDay(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) - julianDay(y, m, 1));

export function stepJd(jd: number, unit: StepUnit, n: number): number {
  const fixed = FIXED[unit];
  if (fixed !== undefined) return jd + n * fixed;
  const months = MONTHS[unit];
  if (months === undefined) throw new Error(`unknown step unit ${String(unit)}`);
  if (!Number.isInteger(n)) throw new RangeError('calendar steps take a whole number');
  const day0 = Math.floor(jd + 0.5) - 0.5; // 0h UT of the civil day
  const tod = jd - day0;
  const c = fromJulianDay(day0);
  const mm = c.y * 12 + (c.m - 1) + n * months;
  const y = Math.floor(mm / 12), m = mm - y * 12 + 1;
  return julianDay(y, m, Math.min(c.d, daysInMonth(y, m))) + tod;
}
