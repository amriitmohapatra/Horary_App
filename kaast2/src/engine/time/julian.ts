/** Calendar ↔ Julian Day (Meeus, ch. 7). Gregorian from 1582-10-15. Pure. */

export function julianDay(y: number, m: number, d: number, hours = 0): number {
  let Y = y, M = m;
  if (M <= 2) { Y -= 1; M += 12; }
  const greg = y > 1582 || (y === 1582 && (m > 10 || (m === 10 && d >= 15)));
  const A = Math.floor(Y / 100);
  const B = greg ? 2 - A + Math.floor(A / 4) : 0;
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 + hours / 24;
}

export interface CivilDateTime { y: number; m: number; d: number; h: number; mi: number; s: number }

/** JD → calendar date and time, rounded to the nearest second. */
export function fromJulianDay(jd: number): CivilDateTime {
  // round to whole seconds first so 23:59:59.7 carries into the next day
  const jdr = Math.round((jd + 0.5) * 86400) / 86400;
  const Z = Math.floor(jdr);
  const F = jdr - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const d = B - D - Math.floor(30.6001 * E);
  const m = E < 14 ? E - 1 : E - 13;
  const y = m > 2 ? C - 4716 : C - 4715;
  let secs = Math.round(F * 86400);
  const h = Math.floor(secs / 3600); secs -= h * 3600;
  const mi = Math.floor(secs / 60);
  return { y, m, d, h, mi, s: secs - mi * 60 };
}

/** 0 = Sunday … 6 = Saturday, for the civil date containing jd. */
export function weekday(jd: number): number {
  return ((Math.floor(jd + 1.5) % 7) + 7) % 7;
}

/** Decimal year, as used by Delta-T tables. */
export function decimalYear(jd: number): number {
  return 2000 + (jd - 2451544.5) / 365.2425;
}
